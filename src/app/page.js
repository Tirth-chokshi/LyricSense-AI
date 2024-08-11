"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import Keywords from "@/components/Keywords"
import Analysis from "@/components/Analysis"
import ChatInterface from '@/components/ChatInterface'
import BTheme from '@/components/BTheme'
import SearchBar from '@/components/SearchBar'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import TrendingSongs from '@/components/TrendingSongs'
import { themes } from '@/lib/theme'
import { Lightbulb, Music, Disc3, TrendingUp, AlertCircle, RefreshCw, MessageCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SparklesCore } from "@/components/ui/sparkles";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation'
import { BackgroundGradient } from '@/components/BackgroundGradient '

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState(getRandomTheme())
  const [isDarkMode, setIsDarkMode] = useState(false);
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
  const [error, setError] = useState(null)

  function getRandomTheme() {
    const themeNames = Object.keys(themes);
    return themeNames[Math.floor(Math.random() * themeNames.length)];
  }

  useEffect(() => {
    fetchTrendingSongs()
  }, [])

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    updateCSSVariables(currentTheme, darkModeMediaQuery.matches);

    const listener = (e) => {
      setIsDarkMode(e.matches);
      updateCSSVariables(currentTheme, e.matches);
    };
    darkModeMediaQuery.addListener(listener);

    return () => darkModeMediaQuery.removeListener(listener);
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

  const updateCSSVariables = (themeName, isDark) => {
    const root = document.documentElement;
    const theme = themes[themeName][isDark ? 'dark' : 'light'];
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const changeTheme = (newTheme, isDark) => {
    setCurrentTheme(newTheme);
    setIsDarkMode(isDark);
    updateCSSVariables(newTheme, isDark);
  };

  const shuffleTheme = () => {
    const newTheme = getRandomTheme();
    changeTheme(newTheme, isDarkMode);
  };

  const handleSubmit = async (e, title = songTitle, artist = artistName) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError(null);

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
      const themeNames = Object.keys(themes);
      const randomTheme = themeNames[Math.floor(Math.random() * themeNames.length)];
      changeTheme(randomTheme);
      shuffleTheme()

      setSubmitted(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('We\'re experiencing high traffic. Please try again.')
    } finally {
      setLoading(false);
    }
  }
 
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background via-secondary to-background"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-12 space-y-4 sm:space-y-0">
          <div className="relative">
            <motion.h1 
              className="text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <TextGenerateEffect words="LyricSense AI" />
            </motion.h1>
            <SparklesCore
              id="tsparticles"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full absolute top-0 left-0 pointer-events-none"
              particleColor="#FFFFFF"
            />
          </div>
          <BTheme onThemeChange={(isDark) => updateCSSVariables(currentTheme, isDark)} />
        </header>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <SearchBar onSearch={handleSearch} onSelect={handleSongSelection} selectedSong={selectedSong} />
        </motion.div>

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
              <motion.div 
                className="flex justify-center items-center h-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="loader"></div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="bg-destructive/10 border-destructive/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-destructive">
                      <AlertCircle className="h-5 w-5" />
                      <CardTitle className="text-lg font-medium">Oops! Something went wrong</CardTitle>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 bg-destructive/10 hover:bg-destructive/20 text-destructive"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Page
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : submitted && (
              <motion.div 
                className="space-y-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <BackgroundGradient className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900">
                  <Card className="overflow-hidden bg-transparent">
                    <CardHeader className="bg-primary/10">
                      <CardTitle className="flex items-center text-primary">
                        <Music className="mr-2" /> Song Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {selectedSong && (
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                          <AnimatedTooltip
                            items={[
                              {
                                id: 1,
                                name: selectedSong.title,
                                designation: selectedSong.artist,
                                image: selectedSong.albumArt,
                              },
                            ]}
                          />
                          <div className='m-3'>
                            <h3 className="text-xl font-semibold">{selectedSong.title}</h3>
                            <p className="text-muted-foreground">{selectedSong.artist}</p>
                            <p className="text-sm text-muted-foreground mt-2">{selectedSong.fullTitle}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </BackgroundGradient>

                <motion.h2 
                  className="text-3xl font-bold mb-6 text-card-foreground flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Lightbulb className="mr-2" /> Interpretation
                </motion.h2>

                <div className="grid gap-8 md:grid-cols-2">
                  <motion.div 
                    className="youtube-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {youtubeUrl && (
                      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                          src={youtubeUrl}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Keywords keywords={keywordsResponse} />
                  </motion.div>
                </div>

                <motion.h2 
                  className="text-3xl font-bold mb-6 text-card-foreground flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <TrendingUp className="mr-2" /> Detailed Analysis
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Analysis analysis={analysisResponse} />
                </motion.div>

                <motion.h2 
                  className="text-3xl font-bold mb-6 text-card-foreground flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <MessageCircle className="mr-2" /> Chat with Song
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <ChatInterface songTitle={songTitle} artistName={artistName} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}