"use client"
import React, { useState } from 'react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const InteractiveLyrics = ({ lyricsData }) => {
  const [activeWord, setActiveWord] = useState(null);

  return (
    <TooltipProvider>
      <div className="interactive-lyrics">
        {lyricsData.map((line, lineIndex) => (
          <div key={lineIndex} className="line">
            {line.words.map((word, wordIndex) => (
              <Tooltip key={wordIndex}>
                <TooltipTrigger asChild>
                  <span 
                    className="word"
                    onMouseEnter={() => setActiveWord(`${lineIndex}-${wordIndex}`)}
                    onMouseLeave={() => setActiveWord(null)}
                  >
                    {word.text}{' '}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <p>Part of Speech: {word.partOfSpeech}</p>
                    <p>Sentiment: {word.sentiment}</p>
                    {word.definition && <p>Definition: {word.definition}</p>}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
        <style jsx>{`
          .interactive-lyrics {
            font-family: Arial, sans-serif;
            line-height: 1.6;
          }
          .line {
            margin-bottom: 10px;
          }
          .word {
            cursor: pointer;
          }
          .word:hover {
            background-color: #f0f0f0;
          }
        `}</style>
      </div>
    </TooltipProvider>
  );
};

export default InteractiveLyrics;
