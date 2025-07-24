import { analysisgetGroqChatCompletion } from "@/lib/action";
import getLyrics from "@/misc/getLyrics";
import analyzeThemes from '@/lib/analyzeThemes';
import analyzeRhymes from '@/lib/analyzeRhymes';
import { LYRIC_API } from '@/lib/config';
import { ANALYSIS_PROMPT } from '@/lib/prompts';

export default async function handler(req, res) {
  // Enhanced error handling and logging
  const debugInfo = {
    method: req.method,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasLyricAPI: !!LYRIC_API,
    hasAnalysisPrompt: !!ANALYSIS_PROMPT
  };

  console.log('[Analysis API] Request started:', debugInfo);

  if (req.method !== 'POST') {
    console.log('[Analysis API] Method not allowed:', req.method);
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
      console.log('[Analysis API] Missing required fields:', { songTitle: !!songTitle, artistName: !!artistName });
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Both songTitle and artistName are required',
        debug: { ...debugInfo, receivedFields: { songTitle: !!songTitle, artistName: !!artistName } }
      });
    }

    // Validate environment variables
    if (!LYRIC_API) {
      console.error('[Analysis API] Missing LYRIC_API environment variable');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Missing required API configuration',
        debug: { ...debugInfo, error: 'LYRIC_API not configured' }
      });
    }

    if (!ANALYSIS_PROMPT) {
      console.error('[Analysis API] Missing ANALYSIS_PROMPT');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Missing prompt configuration',
        debug: { ...debugInfo, error: 'ANALYSIS_PROMPT not configured' }
      });
    }

    console.log('[Analysis API] Processing request for:', { songTitle, artistName });

    // Get lyrics with error handling
    const options = {
      apiKey: LYRIC_API,
      title: songTitle,
      artist: artistName + ' ',
      optimizeQuery: true
    };

    let lyrics;
    try {
      console.log('[Analysis API] Fetching lyrics...');
      lyrics = await getLyrics(options);
      console.log('[Analysis API] Lyrics fetched successfully:', !!lyrics);
    } catch (lyricsError) {
      console.error('[Analysis API] Lyrics fetch error:', lyricsError);
      return res.status(404).json({ 
        error: 'Lyrics not found',
        message: `Could not find lyrics for "${songTitle}" by ${artistName}`,
        debug: { 
          ...debugInfo, 
          error: 'lyrics_fetch_failed',
          details: lyricsError.message || lyricsError.toString()
        }
      });
    }

    if (!lyrics) {
      console.log('[Analysis API] No lyrics returned - trying fallback analysis');
      
      // Fallback: Provide analysis based on song title and artist
      const fallbackPrompt = `${ANALYSIS_PROMPT}
      
      Note: Lyrics could not be retrieved for this song, but please provide a comprehensive analysis based on the song title and artist information:
      
      Song Title: "${songTitle}"
      Artist: "${artistName}"
      
      Please provide:
      1. Analysis based on the song title and what it might suggest
      2. Context about the artist's typical musical style and themes
      3. Any known information about this specific song
      4. General themes that might be present based on the title
      
      Please mention that this analysis is based on available information rather than full lyrics analysis.`;

      try {
        console.log('[Analysis API] Attempting fallback analysis...');
        const fallbackCompletion = await analysisgetGroqChatCompletion(fallbackPrompt);
        
        if (fallbackCompletion?.choices?.[0]?.message?.content) {
          const fallbackAnalysis = `[Limited Analysis - Lyrics unavailable]\n\n${fallbackCompletion.choices[0].message.content}`;
          
          // Return partial analysis
          const response = {
            themeData: [
              { 
                name: "Limited Analysis", 
                description: "Analysis based on song title and artist information only" 
              }
            ],
            rhymeData: {},
            lyricsData: null,
            overallAnalysis: fallbackAnalysis,
            warnings: ['Lyrics could not be retrieved - analysis is based on song title and artist information'],
            debug: process.env.NODE_ENV === 'development' ? {
              ...debugInfo,
              fallbackUsed: true,
              lyricsAvailable: false
            } : undefined
          };

          console.log('[Analysis API] Fallback analysis completed successfully');
          return res.status(200).json(response);
        }
      } catch (fallbackError) {
        console.error('[Analysis API] Fallback analysis also failed:', fallbackError);
      }

      return res.status(404).json({ 
        error: 'Lyrics not found',
        message: `No lyrics available for "${songTitle}" by ${artistName} and fallback analysis failed`,
        debug: { 
          ...debugInfo, 
          error: 'no_lyrics_returned',
          suggestions: [
            'Try searching for exact song title and artist spelling',
            'Check if song exists in Genius database', 
            'Verify song title matches what\'s in the lyrics database',
            'The song may be too new or not available in the lyrics database'
          ]
        }
      });
    }

    // Initialize analysis components
    let themeData, rhymeData, overallAnalysis;
    const warnings = [];
    
    // Analyze themes with error handling
    try {
      console.log('[Analysis API] Analyzing themes...');
      themeData = await analyzeThemes(lyrics);
      console.log('[Analysis API] Theme analysis completed');
    } catch (error) {
      console.warn('[Analysis API] Error analyzing themes:', error);
      themeData = [{ name: "Analysis Unavailable", description: "Theme analysis could not be completed." }];
      warnings.push('Theme analysis failed');
    }

    // Analyze rhymes with error handling
    try {
      console.log('[Analysis API] Analyzing rhymes...');
      rhymeData = analyzeRhymes(lyrics);
      console.log('[Analysis API] Rhyme analysis completed');
    } catch (error) {
      console.warn('[Analysis API] Error analyzing rhymes:', error);
      rhymeData = {};
      warnings.push('Rhyme analysis failed');
    }

    // Perform overall analysis with error handling
    try {
      console.log('[Analysis API] Performing overall analysis...');
      const analysisPrompt = ANALYSIS_PROMPT;
      const overallAnalysisPrompt = `${analysisPrompt} 
        Song Title: "${songTitle}"
        Artist: "${artistName}"
        Lyrics: ${lyrics}`;
      
      const completion = await analysisgetGroqChatCompletion(overallAnalysisPrompt);
      
      if (!completion || !completion.choices || !completion.choices[0]) {
        throw new Error('Invalid AI response structure');
      }
      
      overallAnalysis = completion.choices[0].message.content;
      console.log('[Analysis API] Overall analysis completed');
      
    } catch (error) {
      console.error('[Analysis API] Error performing overall analysis:', error);
      overallAnalysis = "Analysis could not be completed due to a technical issue. Please try again later.";
      warnings.push('Overall analysis failed');
    }

    // Return successful response
    const response = {
      themeData,
      rhymeData,
      lyricsData: lyrics,
      overallAnalysis,
      warnings: warnings.length > 0 ? warnings : undefined,
      debug: process.env.NODE_ENV === 'development' ? debugInfo : undefined
    };

    console.log('[Analysis API] Request completed successfully');
    return res.status(200).json(response);

  } catch (error) {
    console.error('[Analysis API] Unexpected error:', error);
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
