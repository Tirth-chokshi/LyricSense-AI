"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Search, Music, User, Clock, Heart } from "lucide-react";
import { debounce } from "lodash";

export default function LyricsSearchApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  const [error, setError] = useState("");

  // Search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
      } else {
        setError(data.error || "Failed to search songs");
        setSearchResults([]);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search using useEffect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle song selection and lyrics fetching
  const handleSongSelect = async (song) => {
    setSelectedSong(song);
    setIsLoadingLyrics(true);
    setError("");

    try {
      const response = await fetch("/api/lyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: song.url }),
      });

      const data = await response.json();

      if (response.ok) {
        setLyrics(data.lyrics);
      } else {
        setError(data.error || "Failed to get lyrics");
        setLyrics("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLyrics("");
    } finally {
      setIsLoadingLyrics(false);
    }
  };

  const handleBackToSearch = () => {
    setSelectedSong(null);
    setLyrics("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            🎵 LyricsSearch
          </h1>
          <p className="text-gray-300 text-lg">
            Discover lyrics for your favorite songs instantly
          </p>
        </div>

        {!selectedSong ? (
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for songs, artists, or lyrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Search Results ({searchResults.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((song) => (
                    <div
                      key={song.id}
                      onClick={() => handleSongSelect(song)}
                      className="group cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {song.albumArt ? (
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                              <Image
                                src={song.albumArt}
                                alt={song.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                              <Music className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-purple-300 transition-colors">
                            {song.songTitle}
                          </h3>
                          <p className="text-gray-300 text-xs mb-2 flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {song.artist}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              Click for lyrics
                            </span>
                            <Heart className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {searchQuery &&
              !isSearching &&
              searchResults.length === 0 &&
              !error && (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No songs found
                  </h3>
                  <p className="text-gray-300">
                    Try searching with different keywords
                  </p>
                </div>
              )}

            {/* Initial State */}
            {!searchQuery && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-purple-400 to-pink-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Start your musical journey
                </h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  Enter a song title, artist name, or any keywords to discover
                  lyrics from millions of songs
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Lyrics Display */
          <div className="max-w-4xl mx-auto">
            {/* Back Button and Song Info */}
            <div className="mb-8">
              <button
                onClick={handleBackToSearch}
                className="mb-6 flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
              >
                <span>←</span>
                <span>Back to search</span>
              </button>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {selectedSong.albumArt ? (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                        <Image
                          src={selectedSong.albumArt}
                          alt={selectedSong.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                        <Music className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedSong.songTitle}
                    </h2>
                    <p className="text-purple-300 text-lg mb-4 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {selectedSong.artist}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lyrics Content */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              {isLoadingLyrics ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-300">Loading lyrics...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 mb-4">❌</div>
                  <p className="text-red-300">{error}</p>
                </div>
              ) : lyrics ? (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <Music className="w-5 h-5 mr-2" />
                    Lyrics
                  </h3>
                  <div className="bg-black/20 rounded-lg p-6">
                    <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed font-mono text-sm">
                      {lyrics}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-300">
                    No lyrics available for this song
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
