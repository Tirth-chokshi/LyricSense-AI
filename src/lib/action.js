import searchSong from '@/misc/searchSong.js';
import { checkOptions } from '@/misc/helpers/index.js';
import extractLyrics from '@/misc/helpers/extractLyrics.js';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API });

export async function getGroqChatCompletion(prompt) {
  return await groq.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content: prompt,
      },
    ],
    model: 'gemma-7b-it',
    // model: 'llama3-70b-8192',
    // model: 'llama3-8b-8192',
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

