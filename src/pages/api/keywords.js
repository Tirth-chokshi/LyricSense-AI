import { getGroqChatCompletion } from '@/lib/action';
import getLyrics from '@/misc/getLyrics';
import getYoutubeVideo from '@/misc/getYtVideo';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { songTitle, artistName } = req.body;
      const options = {
        apiKey: process.env.LYRIC_API,
        title: songTitle,
        artist: artistName + ' ',
        optimizeQuery: true
      };
      const keywordPrompt = process.env.KEYWORD_PROMPT;
      const lyrics = await getLyrics(options);
      if (!lyrics) {
        return res.status(404).json({ error: 'Lyrics not found' });
      }
      const prompt = `${keywordPrompt} ${lyrics}`;
      const chatCompletion = await getGroqChatCompletion(prompt);
      const youtubeUrl = await getYoutubeVideo(songTitle, artistName);
      res.status(200).json({ 
        response: chatCompletion.choices[0].message.content,youtubeUrl
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}