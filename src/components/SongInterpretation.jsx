"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const SongInterpretation = ({ interpretation, songTitle, artistName }) => {
  return (
    <Card className="w-full h-full flex flex-col shadow-lg">
      <CardHeader className="flex-shrink-0 bg-primary/10 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-primary truncate">{songTitle}</CardTitle>
        <p className="text-sm text-muted-foreground">by {artistName}</p>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4">
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-card-foreground">
              {interpretation}
            </p>
          </div>
      </CardContent>
    </Card>
  );
};

export default SongInterpretation;