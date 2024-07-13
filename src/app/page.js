"use client";
import { useState } from 'react';
import axios from 'axios';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Keywords from "@/components/Keywords";
import Analysis from "@/components/Analysis";
import ChatInterface from '@/components/ChatInterface';
import EmotionGraph from '@/components/EmotionGraph';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WordCloud from '@/components/WordCloud';
import SentimentTimeline from '@/components/SentimentTimeline';
import ThemeRadar from '@/components/ThemeRadar';
import RhymeScheme from '@/components/RhymeScheme';
import InteractiveLyrics from '@/components/InteractiveLyrics';

export default function Home() {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [keywordsResponse, setKeywordsResponse] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');
  const [emotionData, setEmotionData] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [moodsAndThemes, setMoodsAndThemes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // New state variables for additional data
  const [wordCloudData, setWordCloudData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);
  const [themeData, setThemeData] = useState([]);
  const [rhymeData, setRhymeData] = useState({});
  const [lyricsData, setLyricsData] = useState([]);

  const { setTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    try {
      console.log('Submitting form with:', { songTitle, artistName });
      const [keywordsRes, analysisRes] = await Promise.all([
        axios.post('/api/keywords', { songTitle, artistName }),
        axios.post('/api/analysis', { songTitle, artistName })
      ]);

      console.log('Keywords Response:', keywordsRes.data);
      console.log('Analysis Response:', analysisRes.data);

      setKeywordsResponse(keywordsRes.data.response);
      setAnalysisResponse(analysisRes.data.overallAnalysis);
      setEmotionData(analysisRes.data.emotionData);
      setYoutubeUrl(keywordsRes.data.youtubeUrl);
      setMoodsAndThemes(keywordsRes.data.moodsAndThemes);

      // Set the new state variables
      setWordCloudData(analysisRes.data.wordCloudData || []);
      setSentimentData(analysisRes.data.sentimentData || []);
      setThemeData(analysisRes.data.themeData || []);
      setRhymeData(analysisRes.data.rhymeData || {});
      setLyricsData(analysisRes.data.lyricsData || []);

      setSubmitted(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setKeywordsResponse('Error fetching data');
      setAnalysisResponse('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative container mx-auto p-4 max-w-3xl">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-center">LyricSense AI</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <Input
          type="text"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          placeholder="Enter song title"
          className="w-full"
        />
        <Input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Enter artist name (optional)"
          className="w-full"
        />
        <Button type="submit" variant="outline" className="w-full">Submit</Button>
      </form>
      <div className="mt-6">
        <h2 className="text-xl flex justify-center mb-4 font-semibold">Interpretation:</h2>
        <div className="prose dark:prose-dark space-y-4">
          {loading ? (
            <div className="flex justify-center items-center max-w-md mx-auto">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            submitted && (
              <>
                <WordCloud words={wordCloudData} />
                <SentimentTimeline sentimentData={sentimentData} />
                {/* <ThemeRadar themeData={themeData} /> */}
                {/* <RhymeScheme rhymeData={rhymeData} /> */}
                {/* <InteractiveLyrics lyricsData={lyricsData} /> */}
                <Keywords keywords={keywordsResponse} className="max-w-md mx-auto" />
                {moodsAndThemes && <EmotionGraph moodsAndThemes={moodsAndThemes} />}
                {/* <EmotionGraph emotionData={emotionData} /> */}
                {youtubeUrl && (
                  <div className="mt-4 flex justify-center max-w-md mx-auto">
                    <iframe
                      width="560"
                      height="315"
                      src={youtubeUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
                <Analysis analysis={analysisResponse} />
              </>
            )
          )}
        </div>
      </div>
      {submitted && (
        <div className="mt-6">
          <h2 className="text-xl flex justify-center mb-4 font-semibold max-w-md mx-auto">Chat with AI:</h2>
          <div className="max-w-md mx-auto">
            <ChatInterface songTitle={songTitle} artistName={artistName} />
          </div>
        </div>
      )}
    </div>
  );
}