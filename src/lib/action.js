import searchSong from '@/misc/searchSong.js';
import { checkOptions } from '@/misc/helpers/index.js';
import extractLyrics from '@/misc/helpers/extractLyrics.js';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API });
export async function keywordsgetGroqChatCompletion(yourOriginalPrompt) {
  const prompt = `Please provide the response in plain text without any Markdown formatting: ${yourOriginalPrompt}`;
  return await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    // model: 'gemma-7b-it',
    model: 'llama3-70b-8192',
    // model: 'gemma2-9b-it',
  });
}
export async function analysisgetGroqChatCompletion(yourOriginalPrompt) {
  const prompt = `Please provide the response in plain text without any Markdown formatting: ${yourOriginalPrompt}`;
  return await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: 'gemma-7b-it',
    // model: 'llama3-70b-8192',
    // model: 'gemma2-9b-it',
  });
}
export default async function fetchLyrics(arg) {
  try {
    if (arg && typeof arg === 'string') {
      let lyrics = await extractLyrics(arg);
      return lyrics;
    } else if (typeof arg === 'object') {
      checkOptions(arg);
      let results = await searchSong(arg);
      if (!results) return null;
      let lyrics = await extractLyrics(results[0].url);
      return lyrics;
    } else {
      throw 'Invalid argument';
    }
  } catch (e) {
    throw e;
  }
}
export async function handleChat(req, res) {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      const prompt = `Analyze the given lyrics and respond to the user's message: "${message}"`;
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