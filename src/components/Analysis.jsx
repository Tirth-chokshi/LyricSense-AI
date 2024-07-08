// src/components/Analysis.jsx
"use client";

import React from 'react';
import { Card,CardContent,CardFooter,CardHeader } from './ui/card';

const Analysis = ({ analysis }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Analysis Response</h2>
      </CardHeader>
      <CardContent>
        <p>{analysis}</p>
      </CardContent>
    </Card>
  );
};

export default Analysis;
