"use client"
import { useState } from 'react'
import axios from 'axios'
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Keywords from "@/components/Keywords"
import Analysis from "@/components/Analysis"
import ChatInterface from '@/components/ChatInterface'
import { ComingSoonSection } from '@/components/ComingSoonSection'
import BTheme from '@/components/BTheme'

export default function Home() {
  const [songTitle, setSongTitle] = useState('')
  const [artistName, setArtistName] = useState('')
  const [keywordsResponse, setKeywordsResponse] = useState('')
  const [analysisResponse, setAnalysisResponse] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [moodsAndThemes, setMoodsAndThemes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  // const [emotionData, setEmotionData] = useState([])
  // const [wordCloudData, setWordCloudData] = useState([])
  // const [sentimentData, setSentimentData] = useState([])
  // const [themeData, setThemeData] = useState([])
  // const [rhymeData, setRhymeData] = useState({})
  // const [lyricsData, setLyricsData] = useState([])

  const { setTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitted(false)

    try {
      console.log('Submitting form with:', { songTitle, artistName })
      const [keywordsRes, analysisRes] = await Promise.all([
        axios.post('/api/keywords', { songTitle, artistName }),
        axios.post('/api/analysis', { songTitle, artistName })
      ])

      setKeywordsResponse(keywordsRes.data.response)
      setAnalysisResponse(analysisRes.data.overallAnalysis)
      setYoutubeUrl(keywordsRes.data.youtubeUrl)
      setMoodsAndThemes(keywordsRes.data.moodsAndThemes)
      // setEmotionData(analysisRes.data.emotionData)
      // setWordCloudData(analysisRes.data.wordCloudData || [])
      // setSentimentData(analysisRes.data.sentimentData || [])
      // setThemeData(analysisRes.data.themeData || [])
      // setRhymeData(analysisRes.data.rhymeData || {})
      // setLyricsData(analysisRes.data.lyricsData || [])

      setSubmitted(true)
    } catch (error) {
      console.error('Error fetching data:', error)
      setKeywordsResponse('Error fetching data')
      setAnalysisResponse('Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-12">
          <div className="flex-grow"></div>
          <h1 className="text-center text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            LyricSense AI
          </h1>
          <div className="flex-grow flex justify-end">
            <BTheme/>
          </div>
        </header>

        <main>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mb-12 bg-card p-6 rounded-lg shadow-lg">
            <div className="relative">
              <Input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder="Enter song title"
                className="w-full pl-4 pr-10 py-2 border rounded-md bg-gradient-to-r from-background to-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                </svg>
              </div>
            </div>
            <div className="relative">
              <Input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Enter artist name (optional)"
                className="w-full pl-4 pr-10 py-2 border rounded-md bg-gradient-to-r from-background to-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
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
            <div className="space-y-12 animate-fadeIn">
              {/* <section className="bg-card rounded-lg shadow-lg p-8 transition-all hover:shadow-xl"> */}
                <h2 className="text-3xl font-bold mb-6 text-card-foreground">Interpretation</h2>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="youtube-container">
                  <h3 className="flex justify-center items-center text-2xl font-semibold mb-4 text-primary/80">
                    Golden Minute
                  </h3>
                    {youtubeUrl && (
                      <iframe
                        className="w-full h-full rounded-md shadow-md"
                        src={youtubeUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  {/* <div className="bg-popover rounded-md p-6 shadow-inner"> */}
                    <Keywords keywords={keywordsResponse} />
                  {/* </div> */}
                </div>
              {/* </section> */}

              {/* <section className="bg-card rounded-lg shadow-lg p-8 transition-all hover:shadow-xl"> */}
                <h2 className="text-3xl font-bold mb-6 text-card-foreground">Detailed Analysis</h2>
                <Analysis analysis={analysisResponse} />
              {/* </section> */}

              {/* <section className="bg-card rounded-lg shadow-lg p-8 transition-all hover:shadow-xl"> */}
                <h2 className="text-3xl font-bold mb-6 text-card-foreground">Chat with Lyrics</h2>
                <ChatInterface songTitle={songTitle} artistName={artistName} />
              {/* </section> */}
            </div>
          )}
        </main>
        <div className='mt-12' >
        <ComingSoonSection />
        </div>
      </div>
    </div>
  )
}