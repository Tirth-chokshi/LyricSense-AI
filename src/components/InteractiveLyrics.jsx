import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveLyrics = ({ lyrics, currentTime, duration }) => {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    const lineCount = lyrics.length;
    const newIndex = Math.floor((currentTime / duration) * lineCount);
    setHighlightedIndex(newIndex);
  }, [currentTime, duration, lyrics]);

  return (
    <div className="h-64 overflow-y-auto p-4 bg-card rounded-lg shadow-inner">
      {lyrics.map((line, index) => (
        <motion.div
          key={index}
          className={`text-lg mb-2 ${index === highlightedIndex ? 'text-primary font-bold' : 'text-foreground'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
};
