"use client"
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EmotionGraph = ({ emotionData }) => {
  const data = emotionData.map((item, index) => ({
    name: `Segment ${index + 1}`,
    intensity: item.intensity,
    emotion: item.emotion,
  }));

  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 10]} />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 border">
                    <p>{`${label}`}</p>
                    <p>{`Emotion: ${payload[0].payload.emotion}`}</p>
                    <p>{`Intensity: ${payload[0].value}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line type="monotone" dataKey="intensity" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionGraph;