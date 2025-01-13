import { keywordsgetGroqChatCompletion } from '@/lib/action';
import getLyrics from '@/misc/getLyrics';
import { LYRIC_API } from '@/lib/config';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { message, songTitle, artistName } = req.body;
            const options = {
                apiKey: LYRIC_API,
                title: songTitle,
                artist: artistName+' ',
                optimizeQuery: true
            };
            const lyrics = await getLyrics(options);
            if (!lyrics) {
                return res.status(404).json({ error: 'Lyrics not found' });
            }
            const prompt = `Analyze the given lyrics and respond to the user's message: ${lyrics}\nUser's message: "${message}"`;
            const chatCompletion = await keywordsgetGroqChatCompletion(prompt);
            res.status(200).json({ response: chatCompletion.choices[0].message.content });
        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}