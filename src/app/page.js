"use client"
import { useState, useCallback, useEffect } from 'react'
import debounce from 'lodash/debounce'
import axios from 'axios'
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Keywords from "@/components/Keywords"
import Analysis from "@/components/Analysis"
import ChatInterface from '@/components/ChatInterface'
import { ComingSoonSection } from '@/components/ComingSoonSection'
import BTheme from '@/components/BTheme'
import { Search, X } from 'lucide-react'

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

  const { setTheme, theme } = useTheme()

  useEffect(() => {
    // Apply gradient style based on theme
    document.body.className = theme === 'dark' 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-rose-100 via-teal-100 to-lavender-200';
  }, [theme]);

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
    setSearchQuery('');
    setSearchResults([]);
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
    <div className="min-h-screen">
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

        <div className="relative mb-8">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debouncedSearch(e.target.value);
            }}
            placeholder="Search for a song"
            className="w-full pl-10 pr-10 py-2 border rounded-md bg-gradient-to-r from-background to-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {searchQuery && (
            <Button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-card p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow transform hover:scale-105 transition-transform duration-200"
              onClick={() => handleSongSelection(result)}
            >
              <img src={result.albumArt} alt={result.fullTitle} className="w-full h-40 object-cover rounded-md mb-2" />
              <h3 className="font-bold text-primary">{result.title}</h3>
              <p className="text-sm text-muted-foreground">{result.artist}</p>
            </div>
          ))}
        </div>

        <main>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : submitted && (
            <div className="space-y-12 animate-fadeIn">
              <h2 className="text-3xl font-bold mb-6 text-primary">Interpretation</h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="youtube-container bg-card rounded-lg overflow-hidden shadow-lg">
                  <h3 className="text-2xl font-semibold mb-4 text-primary p-4">
                    Golden Minute
                  </h3>
                  {youtubeUrl && (
                    <iframe
                      className="w-full aspect-video rounded-b-lg"
                      src={youtubeUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <Keywords keywords={keywordsResponse} />
              </div>

              <h2 className="text-3xl font-bold mb-6 text-primary">Detailed Analysis</h2>
              <Analysis analysis={analysisResponse} />

              <h2 className="text-3xl font-bold mb-6 text-primary">Chat with Song</h2>
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