import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disc3 } from 'lucide-react';

const TrendingSongs = ({ songs, onSelect }) => {
  return (
    <motion.div 
      className="trending-songs mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-card-foreground flex items-center">
        <Disc3 className="mr-2" /> Trending Songs
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className="overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full"
              onClick={() => onSelect(song)}
            >
              <div className="relative pb-[100%]">
                <img 
                  src={song.albumArt} 
                  alt={`${song.title} by ${song.artist}`}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-1 truncate">{song.title}</h3>
                <p className="text-xs text-muted-foreground mb-2 truncate">{song.artist}</p>
                <Badge variant="secondary" className="text-xs">{song.plays} plays</Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TrendingSongs;