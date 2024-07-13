import { getGroqChatCompletion } from "@/lib/action";
import getLyrics from "@/misc/getLyrics";
import generateWordCloudData from '@/lib/generateWordCloudData';
import analyzeSentiment from '@/lib/analyzeSentiment';
import analyzeThemes from '@/lib/analyzeThemes';
import analyzeRhymes from '@/lib/analyzeRhymes';
import analyzeLyricsInDetail from '@/lib/analyzeLyricsInDetail'

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
      const lyrics = await getLyrics(options);
      if (!lyrics) {
        return res.status(404).json({ error: 'Lyrics not found' });
      }

      let wordCloudData, sentimentData, themeData, rhymeData, lyricsData, overallAnalysis;

      // Analyze lyrics in detail
      try {
        lyricsData = await analyzeLyricsInDetail(lyrics);
      } catch (error) {
        console.error('Error analyzing lyrics in detail:', error);
        lyricsData = [{ line: "Error analyzing lyrics", words: [] }];
      }

      // Analyze sentiment
      try {
        sentimentData = analyzeSentiment(lyrics);
      } catch (error) {
        console.error('Error analyzing sentiment:', error);
        sentimentData = { score: 0, comparative: 0 };
      }

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

      try {
        lyricsData = await analyzeLyricsInDetail(lyrics);
      } catch (error) {
        console.error('Error analyzing lyrics in detail:', error);
        lyricsData = [{ line: "Error analyzing lyrics", words: [] }];
      }

      // Split lyrics into verses or lines
      const segments = lyrics.split('\n\n'); // Adjust this based on your lyrics format

      emotionData = [];
      for (let i = 0; i < segments.length; i++) {
        try {
          const segment = segments[i];
          const prompt = `Analyze the following lyric segment and provide the dominant emotion and its intensity on a scale of 1-10:

${segment}

Response format:
Emotion: [emotion]
Intensity: [1-10]`;

          const chatCompletion = await getGroqChatCompletion(prompt);
          const response = chatCompletion.choices[0].message.content;

          // Parse the response
          const [emotionLine, intensityLine] = response.split('\n');
          const emotion = emotionLine.split(': ')[1];
          const intensity = parseInt(intensityLine.split(': ')[1]);

          emotionData.push({ segment, emotion, intensity });
        } catch (error) {
          console.error('Error analyzing emotion for segment:', error);
          emotionData.push({ segment: segments[i], emotion: "Error", intensity: 0 });
        }
      }

      // Perform overall analysis
      try {
        const analysisPrompt = process.env.ANALYSIS_PROMPT;
        const overallAnalysisPrompt = `${analysisPrompt} ${lyrics}`;
        overallAnalysis = await getGroqChatCompletion(overallAnalysisPrompt);
      } catch (error) {
        console.error('Error performing overall analysis:', error);
        overallAnalysis = { choices: [{ message: { content: "Error in overall analysis" } }] };
      }

      res.status(200).json({
        overallAnalysis: overallAnalysis.choices[0].message.content,
        wordCloudData,
        sentimentData,
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