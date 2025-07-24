import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Disc3, TrendingUp, Play } from 'lucide-react';

const TrendingSongs = ({ songs, onSelect }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="trending-songs mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-4 mb-8">
        <motion.h2 
          className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TrendingUp className="inline mr-3 text-primary" size={32} />
          Trending Songs
        </motion.h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover what's popular and start your lyrical journey with these trending tracks
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {songs.map((song, index) => (
          <motion.div
            key={song.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <Card 
                className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer h-full bg-gradient-to-br from-card/90 to-card border-border/50 group-hover:border-primary/30"
                onClick={() => onSelect(song)}
              >
                <div className="relative pb-[100%] overflow-hidden">
                  <img 
                    src={song.albumArt} 
                    alt={`${song.title} by ${song.artist}`}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay with play button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                  {/* Trending badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-primary/90 text-primary-foreground text-xs font-bold">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {song.artist}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-secondary/10 border-secondary/30 text-secondary-foreground"
                    >
                      <Disc3 className="w-3 h-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TrendingSongs;