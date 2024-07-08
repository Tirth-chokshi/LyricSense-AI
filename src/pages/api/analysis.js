import { getGroqChatCompletion } from "@/lib/action";
import getLyrics from "@/misc/getLyrics";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { songTitle, artistName } = req.body;
      const options = {
        apiKey: process.env.LYRIC_API,
        title: songTitle,
        artist: artistName,
        optimizeQuery: true
      };
      const analysisPrompt = process.env.ANALYSIS_PROMPT
      const lyrics = await getLyrics(options);
      if (!lyrics) {
        return res.status(404).json({ error: 'Lyrics not found' });
      }
      const prompt = `${analysisPrompt} ${lyrics}`;
      const chatCompletion = await getGroqChatCompletion(prompt);      
      res.status(200).json({ response: chatCompletion.choices[0].message.content });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
