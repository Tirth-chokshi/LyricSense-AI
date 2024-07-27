// pages/api/trending-songs.js
import axios from 'axios'

const DEEZER_API_URL = 'https://api.deezer.com/chart/0/tracks'
const CACHE_EXPIRATION = 5 * 60 * 1000 // 5 minutes in milliseconds

let cachedSongs = null
let lastFetchTime = 0

async function fetchTrendingSongs() {
  const currentTime = Date.now()
  
  // If cache is valid, return cached songs
  if (cachedSongs && (currentTime - lastFetchTime < CACHE_EXPIRATION)) {
    return cachedSongs
  }

  try {
    const response = await axios.get(DEEZER_API_URL, {
      params: {
        limit: 10 // Fetch top 10 tracks
      }
    })

    const trendingSongs = response.data.data.map(track => ({
      title: track.title,
      artist: track.artist.name,
      url: track.link,
      albumArt: track.album.cover_medium,
      rank: track.position // Add this line to get the track's position
    }))

    // Sort songs by rank
    trendingSongs.sort((a, b) => a.rank - b.rank)

    // Update cache
    cachedSongs = trendingSongs
    lastFetchTime = currentTime

    return trendingSongs
  } catch (error) {
    console.error('Error fetching trending songs:', error)
    throw error
  }
}
