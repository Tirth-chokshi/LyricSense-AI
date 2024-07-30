"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import Keywords from "@/components/Keywords"
import Analysis from "@/components/Analysis"
import ChatInterface from '@/components/ChatInterface'
import BTheme from '@/components/BTheme'
import SearchBar from '@/components/SearchBar'
import { Lightbulb, Music, Disc3, TrendingUp, BookOpen, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import TrendingSongs from '@/components/TrendingSongs'
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
  const [trendingSongs, setTrendingSongs] = useState([])

  useEffect(() => {
    fetchTrendingSongs()
  }, [])
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
  const fetchTrendingSongs = async () => {
    try {
      const response = await axios.get('/api/trending-songs')
      setTrendingSongs(response.data.songs)
    } catch (error) {
      console.error('Error fetching trending songs:', error)
    }
  }
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
        <header className="flex flex-col sm:flex-row justify-between items-center mb-12 space-y-4 sm:space-y-0">
          <h1 className="text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">
            LyricSense AI
          </h1>
          <BTheme />
        </header>
          <SearchBar onSearch={handleSearch} onSelect={handleSongSelection} selectedSong={selectedSong} />

          <main className="mt-8">
            <AnimatePresence mode="wait">
              {!selectedSong && (
                <motion.div
                  key="trending"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <TrendingSongs songs={trendingSongs} onSelect={handleSongSelection} />
                </motion.div>
              )}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <span className="loader"></span>
                </div>

              ) : submitted && (
                <div className="space-y-12 animate-fadeIn">
                  <Card className="col-span-2 md:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Music className="mr-2" /> Song Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSong && (
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                          <img
                            src={selectedSong.albumArt}
                            alt={selectedSong.fullTitle}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="text-xl font-semibold">{selectedSong.title}</h3>
                            <p className="text-muted-foreground">{selectedSong.artist}</p>
                            <p className="text-sm text-muted-foreground mt-2">{selectedSong.fullTitle}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  <h2 className="text-3xl font-bold mb-6 text-card-foreground flex items-center">
                    <Lightbulb className="mr-2" /> Interpretation
                  </h2>
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="youtube-container">
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

                  <h2 className="text-3xl font-bold mb-6 text-card-foreground flex items-center">
                    <TrendingUp className="mr-2" /> Detailed Analysis
                  </h2>
                  <Analysis analysis={analysisResponse} />

                  <h2 className="text-3xl font-bold mb-6 text-card-foreground flex items-center">
                    <MessageCircle className="mr-2" /> Chat with Song
                  </h2>
                  <ChatInterface songTitle={songTitle} artistName={artistName} />
                </div>
              )}
            </AnimatePresence>
          </main>
      </div>
    </div>
  )
}
