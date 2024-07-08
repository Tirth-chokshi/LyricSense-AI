"use client";
import { useState } from 'react';
import axios from 'axios';
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Keywords from "@/components/Keywords";
import Analysis from "@/components/Analysis";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [keywordsResponse, setKeywordsResponse] = useState('');
  const [analysisResponse, setAnalysisResponse] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const [keywordsRes, analysisRes] = await Promise.all([
        axios.post('/api/keywords', { songTitle, artistName }),
        axios.post('/api/analysis', { songTitle, artistName })
      ]);

      setKeywordsResponse(keywordsRes.data.response);
      setAnalysisResponse(analysisRes.data.response);
      setYoutubeUrl(keywordsRes.data.youtubeUrl);
    } catch (error) {
      console.error('Error fetching data:', error);
      setKeywordsResponse('Error fetching data');
      setAnalysisResponse('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const { setTheme } = useTheme();

  return (
    <div className="relative container mx-auto p-4">
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
      <h1 className="text-2xl font-bold mb-4">LyricSense AI</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
          placeholder="Enter song title (optional)"
          className="w-full"
        />
        <Input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Enter artist name"
          className="w-full"
        />
        <Button type="submit" variant="outline" className="w-full">Submit</Button>
      </form>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Interpretation :</h2>
        <div className="prose dark:prose-dark space-y-4">
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            <>
              {youtubeUrl && (
                <div className="mt-4 flex justify-center">                  
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
              <Keywords keywords={keywordsResponse} />
              <Analysis analysis={analysisResponse} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
