"use client"
import { useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import axios from 'axios'
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const [emotionData, setEmotionData] = useState([])
  // const [wordCloudData, setWordCloudData] = useState([])
  // const [sentimentData, setSentimentData] = useState([])
  // const [themeData, setThemeData] = useState([])
  // const [rhymeData, setRhymeData] = useState({})
  // const [lyricsData, setLyricsData] = useState([])

  const { setTheme } = useTheme()

  const debouncedSearch = useCallback(
    debounce((query) => handleSearch(query), 300),
    []
  )

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/search', { songTitle: query });
      if (response.data.success) {
        setSearchResults(response.data.results);
      } else {
        console.error('Search failed:', response.data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSongSelection = async (result) => {
    setSongTitle(result.title);
    setArtistName(result.artist);
    setSearchQuery(''); // Clear the search query
    setSearchResults([]); // Clear the search results

    // Trigger analysis immediately
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

      setKeywordsResponse(keywordsRes.data.response);
      setAnalysisResponse(analysisRes.data.overallAnalysis);
      setYoutubeUrl(keywordsRes.data.youtubeUrl);
      setMoodsAndThemes(keywordsRes.data.moodsAndThemes);

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
           <BTheme/>
          </div>
        </header>

        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
          placeholder="Search for a song"
          className="w-full pl-4 pr-10 py-2 border rounded-md bg-gradient-to-r from-background to-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-card p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSongSelection(result)}
            >
              <img src={result.albumArt} alt={result.fullTitle} className="w-full h-40 object-cover rounded-md mb-2" />
              <h3 className="font-bold">{result.fullTitle}</h3>
            </div>
          ))}
        </div>

        <main>
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
              <h2 className="text-3xl font-bold mb-6 text-card-foreground">Chat with Song</h2>
              <ChatInterface songTitle={songTitle} artistName={artistName} />
              {/* </section> */}
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
