import searchSong from "@/misc/searchSong";
import { LYRIC_API } from '@/lib/config';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const trendingSongs = [
        { title: "Bye Bye Bye", artist: "NSYNC" },
        { title: "Birds of a feather", artist: "Billie Eilish" },
        { title: "MILLION DOLLAR BABY", artist: "Tommy Richman" },
        { title: "Not Like Us", artist: "Kendirck Lamar" },
        { title: "Big Dawgs", artist: "Hanumankind" }
      ];

      const trendingSongsPromises = trendingSongs.map(async ({ title, artist }) => {
        const options = {
          apiKey: LYRIC_API,
          title: title,
          artist: artist,
          optimizeQuery: true
        };

        const searchResults = await searchSong(options);
        
        if (searchResults && searchResults.length > 0) {
          const result = searchResults[0]
          return {
            id: result.id,
            title: result.title,
            artist: result.artist,
            albumArt: result.albumArt,
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