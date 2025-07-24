// Debug lyrics extraction process step by step
import getLyrics from '@/misc/getLyrics';
import searchSong from '@/misc/searchSong';
import extractLyrics from '@/misc/helpers/extractLyrics';
import { LYRIC_API } from '@/lib/config';

export default async function handler(req, res) {
  const { songTitle = 'BIRDS OF A FEATHER', artistName = 'Billie Eilish' } = req.query;
  
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    query: { songTitle, artistName },
    steps: []
  };

  try {
    // Step 1: Test search
    const searchOptions = {
      apiKey: LYRIC_API,
      title: songTitle,
      artist: artistName,
      optimizeQuery: true
    };

    debug.steps.push({
      step: 'Search Setup',
      status: 'success',
      options: {
        title: searchOptions.title,
        artist: searchOptions.artist,
        optimizeQuery: searchOptions.optimizeQuery,
        hasApiKey: !!searchOptions.apiKey
      }
    });

    let searchResults;
    try {
      console.log('[Debug Extract] Starting search...');
      searchResults = await searchSong(searchOptions);
      
      debug.steps.push({
        step: 'Search Results',
        status: searchResults ? 'success' : 'no_results',
        resultCount: searchResults?.length || 0,
        results: searchResults?.slice(0, 3).map(r => ({
          title: r.title,
          artist: r.artist,
          fullTitle: r.fullTitle,
          url: r.url,
          id: r.id
        })) || []
      });

      if (!searchResults || searchResults.length === 0) {
        return res.status(404).json({
          ...debug,
          success: false,
          message: 'No search results found'
        });
      }

    } catch (searchError) {
      debug.steps.push({
        step: 'Search Results',
        status: 'error',
        error: searchError.message
      });
      return res.status(500).json({
        ...debug,
        success: false,
        error: 'Search failed: ' + searchError.message
      });
    }

    // Step 2: Test lyrics extraction from first result
    const firstResult = searchResults[0];
    try {
      console.log('[Debug Extract] Attempting lyrics extraction from:', firstResult.url);
      
      const lyrics = await extractLyrics(firstResult.url);
      
      debug.steps.push({
        step: 'Lyrics Extraction',
        status: lyrics ? 'success' : 'no_lyrics',
        url: firstResult.url,
        lyricsLength: lyrics?.length || 0,
        lyricsPreview: lyrics ? lyrics.substring(0, 200) + '...' : null,
        hasLyrics: !!lyrics
      });

      if (lyrics) {
        return res.status(200).json({
          ...debug,
          success: true,
          lyrics: lyrics.substring(0, 1000) + (lyrics.length > 1000 ? '...' : ''),
          fullLyricsLength: lyrics.length,
          extractedFrom: firstResult.fullTitle
        });
      } else {
        // Try alternative extraction methods
        debug.steps.push({
          step: 'Alternative Extraction Attempt',
          status: 'attempting',
          message: 'Standard extraction failed, trying alternatives'
        });

        // Let's try to get the raw HTML and see what's there
        const axios = require('axios');
        const response = await axios.get(firstResult.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const htmlPreview = response.data.substring(0, 2000);
        const hasLyricsContainer = response.data.includes('data-lyrics-container');
        const hasLyricsClass = response.data.includes('Lyrics__Container');
        
        debug.steps.push({
          step: 'HTML Analysis',
          status: 'info',
          htmlLength: response.data.length,
          hasLyricsContainer,
          hasLyricsClass,
          htmlPreview: htmlPreview.replace(/<[^>]*>/g, '').substring(0, 500) + '...'
        });

        return res.status(404).json({
          ...debug,
          success: false,
          message: 'Lyrics extraction failed - page structure may have changed',
          troubleshooting: [
            'The page loaded successfully but lyrics selectors failed',
            'Genius may have updated their page structure',
            'Consider updating the extraction selectors',
            'Page might be detecting and blocking automated access'
          ]
        });
      }

    } catch (extractError) {
      debug.steps.push({
        step: 'Lyrics Extraction',
        status: 'error',
        error: extractError.message,
        url: firstResult.url
      });

      return res.status(500).json({
        ...debug,
        success: false,
        error: 'Extraction failed: ' + extractError.message
      });
    }

  } catch (error) {
    debug.steps.push({
      step: 'Unexpected Error',
      status: 'error',
      error: error.message
    });

    return res.status(500).json({
      ...debug,
      success: false,
      error: error.message
    });
  }
}
