import { analysisgetGroqChatCompletion } from '@/lib/action';
import getLyrics from '@/misc/getLyrics';
import { LYRIC_API } from '@/lib/config';
import { INTERPRETATION_PROMPT } from '@/lib/prompts';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { songTitle, artistName } = req.body;
      const options = {
        apiKey: LYRIC_API,
        title: songTitle,
        artist: artistName + ' ',
        optimizeQuery: true
      };
      const interpretationPrompt = INTERPRETATION_PROMPT;
      const lyrics = await getLyrics(options);
      if (!lyrics) {
        return res.status(404).json({ error: 'Lyrics not found' });
      }
      const prompt = `${interpretationPrompt} ${lyrics}`;
      const chatCompletion = await analysisgetGroqChatCompletion(prompt);
      res.status(200).json({ 
        interpretation: chatCompletion.choices[0].message.content
      });
    } catch (error) {
      console.error('Error fetching interpretation:', error);
      res.status(500).json({ error: 'Error fetching interpretation' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}