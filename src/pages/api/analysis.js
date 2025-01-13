import { analysisgetGroqChatCompletion } from "@/lib/action";
import getLyrics from "@/misc/getLyrics";
import analyzeThemes from '@/lib/analyzeThemes';
import analyzeRhymes from '@/lib/analyzeRhymes';
import { LYRIC_API } from '@/lib/config';
import { ANALYSIS_PROMPT } from '@/lib/prompts';

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
      const lyrics = await getLyrics(options);
      if (!lyrics) {
        return res.status(404).json({ error: 'Lyrics not found' });
      }

      let  themeData, rhymeData, lyricsData, overallAnalysis;
      // Analyze themes
      try {
        themeData = await analyzeThemes(lyrics);
      } catch (error) {
        console.error('Error analyzing themes:', error);
        themeData = [{ name: "Error", description: "An error occurred while analyzing themes." }];
      }

      // Analyze rhymes
      try {
        rhymeData = analyzeRhymes(lyrics);
      } catch (error) {
        console.error('Error analyzing rhymes:', error);
        rhymeData = {};
      }

      // Perform overall analysis
      try {
        const analysisPrompt = ANALYSIS_PROMPT;
        const overallAnalysisPrompt = `${analysisPrompt} 
        Song Title: "${songTitle}"
        Artist: "${artistName}"
        Lyrics: ${lyrics}`;
        overallAnalysis = await analysisgetGroqChatCompletion(overallAnalysisPrompt);
      } catch (error) {
        console.error('Error performing overall analysis:', error);
        overallAnalysis = { choices: [{ message: { content: "Error in overall analysis" } }] };
      }

      res.status(200).json({
        overallAnalysis: overallAnalysis.choices[0].message.content,
        themeData,
        rhymeData,
        lyricsData
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
