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
import { Badge } from "@/components/ui/badge";
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
      console.error('Error occured:', error);
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
              <TextGenerateEffect words="LyricSense" />
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
                className="flex flex-col justify-center items-center h-96 space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75 animate-pulse"></div>
                  <div className="relative loader bg-gradient-to-r from-primary to-secondary"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Analyzing Lyrics</h3>
                  <p className="text-muted-foreground">Discovering the emotional depth and meaning...</p>
                  <div className="flex items-center justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-md mx-auto"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-50"></div>
                  <Card className="relative bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
                    <CardContent className="pt-6 text-center space-y-4">
                      <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-destructive">Oops! Something went wrong</h3>
                        <p className="text-sm text-muted-foreground">{error}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-4 bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/30"
                        onClick={() => window.location.reload()}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ) : submitted && (
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Enhanced Song Details Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <BackgroundGradient className="rounded-[22px] p-1 dark:bg-zinc-900">
                    <Card className="overflow-hidden bg-transparent border-0 shadow-none">
                      <CardContent className="p-8">
                        {selectedSong && (
                          <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                            {/* Album Art with Enhanced Styling */}
                            <div className="flex-shrink-0">
                              <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-xl overflow-hidden shadow-2xl">
                                  <img 
                                    src={selectedSong.albumArt} 
                                    alt={selectedSong.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Song Information */}
                            <div className="flex-1 space-y-4">
                              <div className="space-y-2">
                                <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent leading-tight">
                                  {selectedSong.title}
                                </h3>
                                <p className="text-xl text-muted-foreground font-medium">
                                  by {selectedSong.artist}
                                </p>
                                {selectedSong.fullTitle && (
                                  <p className="text-sm text-muted-foreground/80 italic">
                                    {selectedSong.fullTitle}
                                  </p>
                                )}
                              </div>
                              
                              {/* Song Stats/Badges */}
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                  <Music className="w-3 h-3 mr-1" />
                                  Now Analyzing
                                </Badge>
                                <Badge variant="outline" className="border-secondary/50">
                                  <Disc3 className="w-3 h-3 mr-1" />
                                  Song Details
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </BackgroundGradient>
                </motion.div>

                {/* Interpretation Section with Enhanced Layout */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <motion.h2 
                      className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Song Interpretation
                    </motion.h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      Discover the deeper meaning and emotional landscape of this track
                    </p>
                  </div>

                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* YouTube Video with Enhanced Styling */}
                    {/* <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {youtubeUrl && (
                        <div className="group">
                          <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                            <div className="relative bg-card rounded-xl overflow-hidden shadow-2xl">
                              <div className="aspect-video">
                                <iframe
                                  className="w-full h-full"
                                  src={youtubeUrl}
                                  title="YouTube video player"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 text-center">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                              <Music className="w-4 h-4" />
                              Official Music Video
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div> */}

                    {/* Keywords with Enhanced Styling */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Keywords keywords={keywordsResponse} />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Detailed Analysis Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <motion.h2 
                      className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      Deep Dive Analysis
                    </motion.h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      Comprehensive breakdown of lyrical themes, literary devices, and artistic intent
                    </p>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Analysis analysis={analysisResponse} />
                  </motion.div>
                </motion.div>

                {/* Interactive Chat Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <motion.h2 
                      className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      Ask About This Song
                    </motion.h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      Have questions about the lyrics, meaning, or context? Start a conversation!
                    </p>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <ChatInterface songTitle={songTitle} artistName={artistName} />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}