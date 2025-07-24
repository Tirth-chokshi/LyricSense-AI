"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from 'lucide-react';

const RhymeScheme = ({ rhymeData }) => {
  const colors = ['bg-red-200', 'bg-purple-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-orange-200', 'bg-pink-200', 'bg-indigo-200'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="mr-2" /> Rhyme Scheme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {rhymeData.map((line, index) => (
            <div 
              key={index} 
              className={`p-2 rounded ${colors[line.rhymeGroup % colors.length]}`}
            >
              <span className="text-sm">{line.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RhymeScheme;
