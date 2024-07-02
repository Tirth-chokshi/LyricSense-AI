// import Groq from "groq-sdk";
// import getSong from "@/misc/getSong.js";
// import getLyrics from "@/misc/getLyrics.js";

// const groq = new Groq({ apiKey: process.env.GROQ_API });

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion();
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }

// export async function getGroqChatCompletion(prompt) {
//   return await groq.chat.completions.create({
//     messages: [
//       {
//         role: "assistant",
//         content: prompt,
//       },
//     ],
//     model:'gemma-7b-it',
//     // model: 'llama3-70b-8192',
//     // model: 'llama3-8b-8192',
//     // model: 'mixtral-8x7b-32768',
//   });
// }

// const options = {
//     apiKey: process.env.LYRIC_API,
//     title: '',
//     artist: ' ',
//     optimizeQuery: true
// };

// getLyrics(options).then((lyrics) => console.log(lyrics)).catch((error) => console.error(error));
// getSong(options).then((song) => console.log(`${song.lyrics}`)).catch((error) => console.error(error));


import searchSong from '@/misc/searchSong.js';
import { checkOptions } from '@/misc/helpers/index.js';
import extractLyrics from '@/misc/helpers/extractLyrics.js';
import Groq from "groq-sdk";

/**
 * @param {({apiKey: string, title: string, artist: string, optimizeQuery: boolean}|string)} arg - options object, or Genius URL
 */

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
  });
}
export default async function (arg) {
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
};
