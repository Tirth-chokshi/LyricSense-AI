"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import ReactMarkdown from 'react-markdown';

const Analysis = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
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
