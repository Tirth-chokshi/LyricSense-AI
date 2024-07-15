"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Keywords = ({ keywords }) => {
  // Split the keywords string into moods and themes
  const [moodsString, themesString] = keywords.split('\n');

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
          className="text-sm font-medium py-1 px-3 bg-primary/20 text-primary-foreground"
        >
          {`${item.text} (${item.value})`}
        </Badge>
      ))}
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
      <CardHeader>
        <h3 className="text-xl font-semibold text-primary">Key Themes & Motifs</h3>
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
