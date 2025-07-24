import searchSong from "@/misc/searchSong";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { songTitle } = req.body;
      const options = {
        apiKey: process.env.LYRIC_API,
        title: songTitle,
        artist: ' ',
        optimizeQuery: true
      };

      const searchResults = await searchSong(options);

      if (!searchResults) {
        return res.status(404).json({ error: 'No results found' });
      }

      // Process the search results
      const processedResults = searchResults.map(result => ({
        id: result.id,
        title: result.title,
        artist: result.artist,
        fullTitle: result.fullTitle,
        albumArt: result.albumArt,
        url: result.url,
      }));
      

      res.status(200).json({ 
        success: true,
        message: 'Search completed successfully',
        resultsCount: processedResults.length,
        results: processedResults
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error fetching data',
        message: error.message || 'An unexpected error occurred'
      });
    }
  } else {
    res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }
}
