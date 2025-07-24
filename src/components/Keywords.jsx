"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

const Keywords = ({ keywords }) => {
  // Handle empty or undefined keywords
  if (!keywords || typeof keywords !== 'string') {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
        <CardHeader>
          <h3 className="text-xl font-semibold text-primary">
            <Tag className="mr-2" size={18} /> Key Themes & Motifs
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No keywords available</p>
        </CardContent>
      </Card>
    );
  }

  // Split the keywords string into moods and themes
  const lines = keywords.split('\n').filter(line => line.trim());
  const moodsString = lines.find(line => line.startsWith('Moods:')) || '';
  const themesString = lines.find(line => line.startsWith('Themes:')) || '';

  // Parse moods and themes
  const parseMoodsThemes = (str) => {
    const regex = /(\w+(?:\s+\w+)*)\((\d+)\)/g;
    const matches = [...str.matchAll(regex)];
    return matches.map(match => ({ text: match[1], value: parseInt(match[2]) }));
  };

  const moods = parseMoodsThemes(moodsString.replace('Moods: ', ''));
  const themes = parseMoodsThemes(themesString.replace('Themes: ', ''));

  const renderBadges = (items) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="text-sm font-medium py-1 px-3 bg-primary/20 text-foreground"
        >
          {`${item.text} (${item.value})`}
        </Badge>
      ))}
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
      <CardHeader>
        <h3 className="text-xl font-semibold text-primary">
          <Tag className="mr-2" size={18} /> Key Themes & Motifs
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-lg font-medium mb-2">Moods:</h4>
          {renderBadges(moods)}
        </div>
        <div>
          <h4 className="text-lg font-medium mb-2">Themes:</h4>
          {renderBadges(themes)}
        </div>
      </CardContent>
    </Card>
  );
};

export default Keywords;
