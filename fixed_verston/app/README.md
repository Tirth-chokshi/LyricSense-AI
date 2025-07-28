# LyricsSearch - Elegant Lyrics Search Application

A beautiful, modern Next.js application for searching and discovering song lyrics with a Spotify-like interface.

## Features

- 🎵 **Dynamic Search**: Real-time search with debouncing to prevent excessive API calls
- 🎨 **Elegant UI**: Beautiful gradient backgrounds with glassmorphism effects
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Fast Performance**: Optimized with Next.js and efficient API calls
- 🔍 **Smart Search**: Search by song title, artist, or keywords
- 🎪 **Album Art Display**: Shows album artwork when available
- 💫 **Smooth Animations**: Hover effects and loading animations

## How to Use

1. **Start the Application**:
   ```bash
   npm run dev
   ```

2. **Search for Songs**:
   - Type any song title, artist name, or keywords in the search bar
   - Results will appear automatically as you type (with 500ms debounce)
   - No need to press Enter - the search is dynamic!

3. **Get Lyrics**:
   - Click on any song from the search results
   - The app will automatically fetch and display the lyrics
   - Use the "Back to search" button to search for more songs

## Project Structure

```
app/
├── src/
│   └── app/
│       ├── api/
│       │   ├── search/route.js      # Search API endpoint
│       │   └── lyrics/route.js      # Lyrics extraction endpoint
│       ├── page.js                  # Main application component
│       ├── layout.js                # Root layout
│       └── globals.css              # Global styles
├── lib/
│   └── api/
│       ├── searchSongs.js           # Search functionality
│       └── extractLyrics.js         # Lyrics extraction
└── package.json
```

## API Integration

The app uses the Genius API for searching songs and extracting lyrics:
- **Search**: `/api/search?q={query}` - Returns song results
- **Lyrics**: `/api/lyrics` (POST) - Extracts lyrics from Genius URLs

## Technologies Used

- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **Lucide React** - Beautiful icons
- **Lodash** - Utility functions (debouncing)
- **Axios** - HTTP requests
- **Cheerio** - HTML parsing for lyrics extraction

## Development

- The app uses the `'use client'` directive for client-side interactivity
- Debouncing prevents excessive API calls while typing
- Error handling for network issues and API failures
- Responsive design with Tailwind CSS
- Image optimization with Next.js Image component

## Deployment

Ready to deploy on Vercel, Netlify, or any platform that supports Next.js applications.

---

Enjoy discovering lyrics with style! 🎵✨
