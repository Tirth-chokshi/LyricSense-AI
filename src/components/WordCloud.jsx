"use client"
import React from 'react';
import ReactWordcloud from 'react-wordcloud';

const WordCloud = ({ words }) => {
  const options = {
    rotations: 2,
    rotationAngles: [-90, 0],
    fontSizes: [12, 60],
    fontFamily: 'Impact',
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ReactWordcloud words={words} options={options} />
    </div>
  );
};

export default WordCloud;
