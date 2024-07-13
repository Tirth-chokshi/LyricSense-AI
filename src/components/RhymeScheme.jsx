"use client"
import React from 'react';

const RhymeScheme = ({ rhymeData }) => {
  const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'];

  return (
    <div className="rhyme-scheme">
      {rhymeData.map((line, index) => (
        <div key={index} className="line">
          <span className="text">{line.text}</span>
          <span 
            className="rhyme-indicator" 
            style={{backgroundColor: colors[line.rhymeGroup % colors.length]}}
          ></span>
        </div>
      ))}
      <style jsx>{`
        .rhyme-scheme {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .line {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
        }
        .text {
          flex-grow: 1;
        }
        .rhyme-indicator {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default RhymeScheme;
