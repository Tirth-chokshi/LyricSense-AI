"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import ReactMarkdown from 'react-markdown';

const Analysis = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Analysis Response</h2>
      </CardHeader>
      <CardContent>
        <ReactMarkdown>
          {analysis}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default Analysis;
