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
import RhymeScheme from '@/components/RhymeScheme';

export default function Home() {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [keywordsResponse, setKeywordsResponse] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [moodsAndThemes, setMoodsAndThemes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      setYoutubeUrl(keywordsRes.data.youtubeUrl);
      setMoodsAndThemes(keywordsRes.data.moodsAndThemes);

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">LyricSense AI</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mb-8">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze Lyrics'
              )}
            </Button>
          </form>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loader"></span>
            </div>
          ) : submitted && (
            <div className="space-y-8">
              <section className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Interpretation</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="youtube-container">
                    {youtubeUrl && (
                      <iframe
                        className="w-full h-full rounded-md"
                        src={youtubeUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  <div className="bg-popover rounded-md p-4">
                    <Keywords keywords={keywordsResponse} />
                  </div>
                </div>
              </section>

              <section className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Lyrical Analysis</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <WordCloud words={wordCloudData} />
                  <SentimentTimeline sentimentData={sentimentData} />
                </div>
              </section>

              <section className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Song Structure</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <RhymeScheme rhymeData={rhymeData} />
                  {moodsAndThemes && <EmotionGraph moodsAndThemes={moodsAndThemes} />}
                </div>
              </section>

              <section className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Overall Analysis</h2>
                <Analysis analysis={analysisResponse} />
              </section>

              <section className="bg-card rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Chat with AI</h2>
                <ChatInterface songTitle={songTitle} artistName={artistName} />
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}