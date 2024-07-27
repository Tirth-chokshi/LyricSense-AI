"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const SentimentTimeline = ({ sentimentData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LineChart className="mr-2" /> Sentiment Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis domain={[-1, 1]} />
              <Tooltip />
              <Line type="monotone" dataKey="sentiment" stroke="#8884d8" />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card> 
  );
};

export default SentimentTimeline;
