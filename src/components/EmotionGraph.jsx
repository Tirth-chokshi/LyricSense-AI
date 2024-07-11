"use client"

import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const EmotionGraph = ({ moodsAndThemes }) => {
  // Log the data to verify its structure
  console.log('moodsAndThemes:', moodsAndThemes);

  // Ensure moodsAndThemes is defined and has the expected structure
  if (!moodsAndThemes || !Array.isArray(moodsAndThemes.moods) || !Array.isArray(moodsAndThemes.themes)) {
    return <div>Error: Invalid data structure for moods and themes.</div>;
  }

  // Combine moods and themes into a single array for the chart
  const chartData = [
    ...moodsAndThemes.moods.map(mood => ({ name: mood.name, value: mood.value, category: 'Mood' })),
    ...moodsAndThemes.themes.map(theme => ({ name: theme.name, value: theme.value, category: 'Theme' }))
  ];

  // Custom color scale
  const colorScale = {
    Mood: '#8884d8',
    Theme: '#82ca9d'
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">Emotion Graph</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Tooltip />
            {Object.keys(colorScale).map((category) => (
              <Radar
                key={category}
                name={category}
                dataKey="value"
                stroke={colorScale[category]}
                fill={colorScale[category]}
                fillOpacity={0.6}
                data={chartData.filter(item => item.category === category)}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmotionGraph;
