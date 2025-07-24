// Lyrics service diagnostic endpoint
import getLyrics from '@/misc/getLyrics';
import { LYRIC_API } from '@/lib/config';

export default async function handler(req, res) {
  const { songTitle = 'People You Know', artistName = 'Selena Gomez' } = req.query;
  
  const diagnostic = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    query: { songTitle, artistName },
    lyricAPI: {
      hasKey: !!LYRIC_API,
      keyLength: LYRIC_API?.length || 0,
      keyPrefix: LYRIC_API?.substring(0, 8) + '...' || 'missing'
    },
    steps: []
  };

  try {
    // Step 1: Test basic module import
    diagnostic.steps.push({
      step: 'Module Import',
      status: 'success',
      message: 'getLyrics function imported successfully'
    });

    // Step 2: Validate inputs
    if (!songTitle || !artistName) {
      diagnostic.steps.push({
        step: 'Input Validation',
        status: 'error',
        message: 'songTitle and artistName are required'
      });
      return res.status(400).json(diagnostic);
    }

    diagnostic.steps.push({
      step: 'Input Validation',
      status: 'success',
      message: 'Valid song title and artist provided'
    });

    // Step 3: Check API key
    if (!LYRIC_API) {
      diagnostic.steps.push({
        step: 'API Key Check',
        status: 'error',
        message: 'LYRIC_API environment variable is missing'
      });
      return res.status(500).json(diagnostic);
    }

    diagnostic.steps.push({
      step: 'API Key Check',
      status: 'success',
      message: 'LYRIC_API is available'
    });

    // Step 4: Test lyrics fetching with detailed error handling
    const options = {
      apiKey: LYRIC_API,
      title: songTitle,
      artist: artistName + ' ',
      optimizeQuery: true
    };

    diagnostic.steps.push({
      step: 'Lyrics Request Setup',
      status: 'success',
      message: 'Request options configured',
      options: {
        title: options.title,
        artist: options.artist,
        optimizeQuery: options.optimizeQuery,
        hasApiKey: !!options.apiKey
      }
    });

    try {
      console.log('[Lyrics Test] Starting lyrics fetch for:', songTitle, 'by', artistName);
      
      const startTime = Date.now();
      const lyrics = await getLyrics(options);
      const endTime = Date.now();
      
      diagnostic.steps.push({
        step: 'Lyrics Fetch',
        status: lyrics ? 'success' : 'no_results',
        message: lyrics ? 'Lyrics fetched successfully' : 'No lyrics found',
        duration: endTime - startTime,
        lyricsLength: lyrics?.length || 0,
        lyricsPreview: lyrics ? lyrics.substring(0, 100) + '...' : null
      });

      if (lyrics) {
        return res.status(200).json({
          ...diagnostic,
          success: true,
          lyrics: lyrics.substring(0, 500) + (lyrics.length > 500 ? '...' : ''),
          fullLyricsLength: lyrics.length
        });
      } else {
        return res.status(404).json({
          ...diagnostic,
          success: false,
          message: 'Lyrics not found - this could be due to song not being in the database or API limitations'
        });
      }

    } catch (lyricsError) {
      console.error('[Lyrics Test] Lyrics fetch error:', lyricsError);
      
      diagnostic.steps.push({
        step: 'Lyrics Fetch',
        status: 'error',
        message: 'Lyrics fetch failed',
        error: lyricsError.message || lyricsError.toString(),
        errorType: lyricsError.constructor.name,
        stack: process.env.NODE_ENV === 'development' ? lyricsError.stack : undefined
      });

      // Analyze the error type
      let errorAnalysis = 'Unknown error';
      if (lyricsError.message?.includes('timeout')) {
        errorAnalysis = 'Network timeout - the lyrics service is taking too long to respond';
      } else if (lyricsError.message?.includes('ENOTFOUND')) {
        errorAnalysis = 'DNS resolution failed - cannot reach the lyrics service';
      } else if (lyricsError.message?.includes('ECONNREFUSED')) {
        errorAnalysis = 'Connection refused - the lyrics service is not accepting connections';
      } else if (lyricsError.message?.includes('403')) {
        errorAnalysis = 'API key forbidden - the lyrics API key may be invalid or expired';
      } else if (lyricsError.message?.includes('429')) {
        errorAnalysis = 'Rate limit exceeded - too many requests to the lyrics service';
      } else if (lyricsError.message?.includes('401')) {
        errorAnalysis = 'Unauthorized - the lyrics API key is invalid';
      }

      return res.status(500).json({
        ...diagnostic,
        success: false,
        error: lyricsError.message || lyricsError.toString(),
        errorAnalysis,
        troubleshooting: [
          'Check if the lyrics API service is accessible from your production environment',
          'Verify the LYRIC_API key is correct and has sufficient quota',
          'Test with different song titles to see if it\'s song-specific',
          'Check if your production environment has firewall restrictions'
        ]
      });
    }

  } catch (error) {
    console.error('[Lyrics Test] Unexpected error:', error);
    
    diagnostic.steps.push({
      step: 'Unexpected Error',
      status: 'error',
      message: 'An unexpected error occurred',
      error: error.message || error.toString()
    });

    return res.status(500).json({
      ...diagnostic,
      success: false,
      error: error.message || error.toString(),
      message: 'Unexpected error during lyrics testing'
    });
  }
}
