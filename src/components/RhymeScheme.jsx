"use client"
import React from 'react';

const RhymeScheme = ({ rhymeData }) => {
  const colors = ['#FFCDD2', '#E1BEE7', '#C5CAE9', '#B3E5FC', '#C8E6C9', '#FFF9C4', '#FFECB3', '#D7CCC8'];

  // Function to determine if the text color should be dark or light
  const getTextColor = (bgColor) => {
    const color = bgColor.substring(1); // Remove the '#' character
    const rgb = parseInt(color, 16); // Convert hex to integer
    const r = (rgb >> 16) & 0xff; // Extract red
    const g = (rgb >> 8) & 0xff; // Extract green
    const b = (rgb >> 0) & 0xff; // Extract blue
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b; // Calculate brightness
    return brightness > 186 ? '#000000' : '#FFFFFF'; // Use black or white text based on brightness
  };

  return (
    <div className="rhyme-scheme">
      {rhymeData.map((line, index) => {
        const bgColor = colors[line.rhymeGroup % colors.length];
        const textColor = getTextColor(bgColor);
        return (
          <div 
            key={index} 
            className="line" 
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <span className="text">{line.text}</span>
          </div>
        );
      })}
      <style jsx>{`
        .rhyme-scheme {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .line {
          padding: 5px;
          margin-bottom: 5px;
          border-radius: 5px;
        }
        .text {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
};

export default RhymeScheme;

