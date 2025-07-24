import { keywordsgetGroqChatCompletion } from '@/lib/action';
import getLyrics from '@/misc/getLyrics';
import getYoutubeVideo from '@/misc/getYtVideo';
import { LYRIC_API } from '@/lib/config';
import { KEYWORD_PROMPT } from '@/lib/prompts';

export default async function handler(req, res) {
  // Enhanced error handling and logging
  const debugInfo = {
    method: req.method,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasLyricAPI: !!LYRIC_API,
    hasKeywordPrompt: !!KEYWORD_PROMPT
  };

  console.log('[Keywords API] Request started:', debugInfo);

  if (req.method !== 'POST') {
    console.log('[Keywords API] Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: `Only POST method is allowed, received ${req.method}`,
      debug: debugInfo
    });
  }

  try {
    // Validate request body
    const { songTitle, artistName } = req.body;
    
    if (!songTitle || !artistName) {
      console.log('[Keywords API] Missing required fields:', { songTitle: !!songTitle, artistName: !!artistName });
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Both songTitle and artistName are required',
        debug: { ...debugInfo, receivedFields: { songTitle: !!songTitle, artistName: !!artistName } }
      });
    }

    // Validate environment variables
    if (!LYRIC_API) {
      console.error('[Keywords API] Missing LYRIC_API environment variable');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Missing required API configuration',
        debug: { ...debugInfo, error: 'LYRIC_API not configured' }
      });
    }

    if (!KEYWORD_PROMPT) {
      console.error('[Keywords API] Missing KEYWORD_PROMPT');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Missing prompt configuration',
        debug: { ...debugInfo, error: 'KEYWORD_PROMPT not configured' }
      });
    }

    console.log('[Keywords API] Processing request for:', { songTitle, artistName });

    // Get lyrics with enhanced error handling
    const options = {
      apiKey: LYRIC_API,
      title: songTitle,
      artist: artistName + ' ',
      optimizeQuery: true
    };

    let lyrics;
    try {
      console.log('[Keywords API] Fetching lyrics with options:', {
        title: options.title,
        artist: options.artist,
        optimizeQuery: options.optimizeQuery,
        apiKeyLength: options.apiKey?.length
      });
      
      lyrics = await getLyrics(options);
      console.log('[Keywords API] Lyrics fetch result:', {
        found: !!lyrics,
        length: lyrics?.length || 0,
        preview: lyrics ? lyrics.substring(0, 100) + '...' : null
      });
      
    } catch (lyricsError) {
      console.error('[Keywords API] Lyrics fetch error details:', {
        error: lyricsError.message,
        type: lyricsError.constructor.name,
        songTitle,
        artistName,
        environment: process.env.NODE_ENV
      });

      // Enhanced error analysis for production debugging
      let errorAnalysis = 'Unknown lyrics fetch error';
      let suggestions = [];

      if (lyricsError.message?.includes('timeout')) {
        errorAnalysis = 'Network timeout while fetching lyrics';
        suggestions.push('Check if Genius API is accessible from production environment');
        suggestions.push('Consider increasing timeout values');
      } else if (lyricsError.message?.includes('ENOTFOUND')) {
        errorAnalysis = 'DNS resolution failed for lyrics service';
        suggestions.push('Verify production environment can resolve api.genius.com');
        suggestions.push('Check firewall/proxy settings');
      } else if (lyricsError.message?.includes('403')) {
        errorAnalysis = 'Lyrics API key forbidden';
        suggestions.push('Verify LYRIC_API key is valid for production use');
        suggestions.push('Check if API key has sufficient quota');
      } else if (lyricsError.message?.includes('429')) {
        errorAnalysis = 'Rate limit exceeded on lyrics API';
        suggestions.push('Implement request throttling');
        suggestions.push('Consider upgrading API plan');
      } else if (lyricsError.message?.includes('ECONNREFUSED')) {
        errorAnalysis = 'Connection refused by lyrics service';
        suggestions.push('Check if production IP is whitelisted');
        suggestions.push('Verify lyrics service is not blocking requests');
      }

      return res.status(404).json({ 
        error: 'Lyrics not found',
        message: `Could not find lyrics for "${songTitle}" by ${artistName}`,
        debug: { 
          ...debugInfo, 
          error: 'lyrics_fetch_failed',
          details: lyricsError.message || lyricsError.toString(),
          errorAnalysis,
          suggestions,
          productionNote: 'This works locally but fails in production - likely a network/environment issue'
        }
      });
    }

    if (!lyrics) {
      console.log('[Keywords API] No lyrics returned from service');
      return res.status(404).json({ 
        error: 'Lyrics not found',
        message: `No lyrics available for "${songTitle}" by ${artistName}`,
        debug: { 
          ...debugInfo, 
          error: 'no_lyrics_returned',
          suggestions: [
            'Try searching for exact song title and artist spelling',
            'Check if song exists in Genius database',
            'Verify song title matches what\'s in the lyrics database'
          ]
        }
      });
    }

    // Process with AI
    try {
      console.log('[Keywords API] Processing with AI...');
      const prompt = `${KEYWORD_PROMPT} ${lyrics}`;
      const chatCompletion = await keywordsgetGroqChatCompletion(prompt);
      
      if (!chatCompletion || !chatCompletion.choices || !chatCompletion.choices[0]) {
        throw new Error('Invalid AI response structure');
      }

      console.log('[Keywords API] AI processing successful');

      // Optional: Get YouTube video (commented out but with error handling)
      // let youtubeUrl = null;
      // try {
      //   youtubeUrl = await getYoutubeVideo(songTitle, artistName);
      // } catch (ytError) {
      //   console.warn('[Keywords API] YouTube fetch failed:', ytError.message);
      // }

      return res.status(200).json({ 
        response: chatCompletion.choices[0].message.content,
        // youtubeUrl,
        debug: process.env.NODE_ENV === 'development' ? debugInfo : undefined
      });

    } catch (aiError) {
      console.error('[Keywords API] AI processing error:', aiError);
      return res.status(500).json({ 
        error: 'AI processing failed',
        message: 'Failed to generate keywords analysis',
        debug: { 
          ...debugInfo, 
          error: 'ai_processing_failed',
          details: aiError.message || aiError.toString()
        }
      });
    }

  } catch (error) {
    console.error('[Keywords API] Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request',
      debug: { 
        ...debugInfo, 
        error: 'unexpected_error',
        details: error.message || error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
}