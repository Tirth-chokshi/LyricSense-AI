import searchSong from "@/misc/searchSong";
import { LYRIC_API } from '@/lib/config';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const errors = [];
    let fetchedTrendingSongs = [];
    
    try {
      const trendingSongs = [
        { title: "Bye Bye Bye", artist: "NSYNC" },
        { title: "Birds of a feather", artist: "Billie Eilish" },
        { title: "MILLION DOLLAR BABY", artist: "Tommy Richman" },
        { title: "Not Like Us", artist: "Kendirck Lamar" },
        { title: "Big Dawgs", artist: "Hanumankind" }
      ];

      // Check if LYRIC_API is available
      if (!LYRIC_API) {
        errors.push('LYRIC_API configuration missing');
        return res.status(500).json({ 
          error: 'Configuration error', 
          message: 'API key not configured',
          errors,
          songs: []
        });
      }

      const trendingSongsPromises = trendingSongs.map(async ({ title, artist }, index) => {
        try {
          const options = {
            apiKey: LYRIC_API,
            title: title,
            artist: artist,
            optimizeQuery: true
          };

          const searchResults = await searchSong(options);
          
          if (searchResults && searchResults.length > 0) {
            const result = searchResults[0];
            
            // Validate required fields
            if (!result.id || !result.title || !result.artist) {
              errors.push(`Incomplete data for ${title} by ${artist}`);
              return null;
            }
            
            return {
              id: result.id,
              title: result.title,
              artist: result.artist,
              albumArt: result.albumArt || '/default-album-art.png',
              fullTitle: result.fullTitle || `${result.title} by ${result.artist}`,
              originalIndex: index
            };
          } else {
            errors.push(`No results found for ${title} by ${artist}`);
            return null;
          }
        } catch (songError) {
          console.error(`Error fetching song ${title} by ${artist}:`, songError);
          errors.push(`Failed to fetch ${title} by ${artist}: ${songError.message}`);
          return null;
        }
      });

      fetchedTrendingSongs = (await Promise.all(trendingSongsPromises)).filter(song => song !== null);

      // If no songs were fetched successfully
      if (fetchedTrendingSongs.length === 0) {
        return res.status(206).json({ 
          error: 'No trending songs could be fetched', 
          message: 'All song requests failed',
          errors,
          songs: [],
          warning: 'Trending songs service temporarily unavailable'
        });
      }

      // Return successful response with any errors as warnings
      res.status(200).json({ 
        songs: fetchedTrendingSongs,
        warnings: errors.length > 0 ? errors : undefined,
        totalRequested: trendingSongs.length,
        totalFetched: fetchedTrendingSongs.length
      });

    } catch (error) {
      console.error('Unexpected error in trending songs API:', error);
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message,
        errors: [...errors, `Unexpected error: ${error.message}`],
        songs: fetchedTrendingSongs,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.status(405).json({ 
      error: 'Method not allowed',
      message: `${req.method} method is not supported for this endpoint`,
      allowedMethods: ['GET']
    });
  }
}