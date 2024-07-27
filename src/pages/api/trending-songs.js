import searchSong from "@/misc/searchSong";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // List of trending songs with both title and artist
      const trendingSongs = [
        { title: "Blinding Lights", artist: "The Weeknd" },
        { title: "Shape of You", artist: "Ed Sheeran" },
        { title: "Dance Monkey", artist: "Tones and I" },
        { title: "Someone You Loved", artist: "Lewis Capaldi" },
        { title: "Rockstar", artist: "Post Malone" }
      ];

      // Fetch details for each trending song
      const trendingSongsPromises = trendingSongs.map(async ({ title, artist }) => {
        const options = {
          apiKey: process.env.LYRIC_API,
          title: title,
          artist: artist,
          optimizeQuery: true
        };

        const searchResults = await searchSong(options);
        
        if (searchResults && searchResults.length > 0) {
          const result = searchResults[0]; // Take the first result
          return {
            id: result.id,
            title: result.title,
            artist: result.artist,
            albumArt: result.albumArt,
            plays: generateRandomPlays() // You might want to get real play counts if available
          };
        }
        return null;
      });

      const fetchedTrendingSongs = (await Promise.all(trendingSongsPromises)).filter(song => song !== null);

      res.status(200).json({ songs: fetchedTrendingSongs });
    } catch (error) {
      console.error('Error fetching trending songs:', error);
      res.status(500).json({ error: 'Error fetching trending songs', message: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Helper function to generate random play counts (for demonstration purposes)
function generateRandomPlays() {
  const plays = Math.floor(Math.random() * 3000) + 1000; // Random number between 1000 and 4000
  return `${(plays / 1000).toFixed(1)}B`;
}