"use client"
import { useState } from 'react'
import axios from 'axios'
import { useTheme } from "next-themes"
import Keywords from "@/components/Keywords"
import Analysis from "@/components/Analysis"
import ChatInterface from '@/components/ChatInterface'
import { ComingSoonSection } from '@/components/ComingSoonSection'
import BTheme from '@/components/BTheme'
import SearchBar from '@/components/SearchBar'
import { Lightbulb } from 'lucide-react'

export default function Home() {
  const [songTitle, setSongTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [selectedSong, setSelectedSong] = useState(null)
  const [keywordsResponse, setKeywordsResponse] = useState('')
  const [analysisResponse, setAnalysisResponse] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [moodsAndThemes, setMoodsAndThemes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { setTheme } = useTheme()

  const handleSearch = async (query) => {
    try {
      const response = await axios.post('/api/search', { songTitle: query });
      if (response.data.success) {
        return response.data.results;
      } else {
        console.error('Search failed:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error performing search:', error);
      return [];
    }
  };

  const handleSongSelection = async (result) => {
    setSongTitle(result.title);
    setArtistName(result.artist);
    setSelectedSong(result);
    await handleSubmit(null, result.title, result.artist);
  };

  const handleSubmit = async (e, title = songTitle, artist = artistName) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSubmitted(false);

    try {
      console.log('Submitting form with:', { title, artist });
      const [keywordsRes, analysisRes] = await Promise.all([
        axios.post('/api/keywords', { songTitle: title, artistName: artist }),
        axios.post('/api/analysis', { songTitle: title, artistName: artist })
      ]);

      setKeywordsResponse(keywordsRes.data.response)
      setAnalysisResponse(analysisRes.data.overallAnalysis)
      setYoutubeUrl(keywordsRes.data.youtubeUrl)
      setMoodsAndThemes(keywordsRes.data.moodsAndThemes)

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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="flex-grow"></div>
          <h1 className="text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            LyricSense AI
          </h1>
          <div className="flex-grow flex justify-end">
            <BTheme />
          </div>
        </header>

        <SearchBar onSearch={handleSearch} onSelect={handleSongSelection} selectedSong={selectedSong} />

        <main className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loader"></span>
            </div>
          ) : submitted && (
            <div className="space-y-12 animate-fadeIn">
              <h2 className="text-3xl font-bold mb-6 text-card-foreground">Interpretation</h2><Lightbulb/>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="youtube-container">
                  {/* <h3 className="flex justify-center items-center text-2xl font-semibold mb-4 text-primary/80">
                    Golden Minute
                  </h3> */}
                  {youtubeUrl && (
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={youtubeUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    </div>
                  )}
                </div>
                <Keywords keywords={keywordsResponse} />
              </div>

              <h2 className="text-3xl font-bold mb-6 text-card-foreground">Detailed Analysis</h2>
              <Analysis analysis={analysisResponse} />

              <h2 className="text-3xl font-bold mb-6 text-card-foreground">Chat with Song</h2>
              <ChatInterface songTitle={songTitle} artistName={artistName} />
            </div>
          )}
        </main>

        <div className='mt-12'>
          <ComingSoonSection />
        </div>
      </div>
    </div>
  )
}