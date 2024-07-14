"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';

const Keywords = ({ keywords }) => {
  // Split the keywords string into an array
  const keywordArray = keywords.split(',').map(keyword => keyword.trim());

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
      <CardHeader>
        <h3 className="text-xl font-semibold text-primary">Key Themes & Motifs</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keywordArray.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-sm font-medium py-1 px-3 bg-primary/20 text-primary-foreground">
              {keyword}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Keywords;
