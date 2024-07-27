"use client"
import React from 'react'
import { Button } from "@/components/ui/button"

export const TrendingSongs = ({ songs, onSelect }) => {
  return (
    <div className="my-6">
      <h2 className="text-2xl font-semibold mb-4">Trending Songs</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {songs.map((song, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative">
              <img 
                src={song.albumArt || '/placeholder-album-art.jpg'} 
                alt={`${song.title} album art`}
                className="w-full h-auto mb-2 rounded-md"
              />
              <span className="absolute top-0 left-0 bg-primary text-primary-foreground px-2 py-1 rounded-tl-md rounded-br-md">
                #{song.rank}
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full text-sm truncate"
              onClick={() => onSelect(song)}
            >
              {song.title} - {song.artist}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
