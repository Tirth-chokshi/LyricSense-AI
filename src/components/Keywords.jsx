// src/components/Keywords.jsx
"use client";

import React from 'react';
import { Card,CardContent,CardHeader,CardFooter } from './ui/card';

const Keywords = ({ keywords }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Keywords Response</h2>
      </CardHeader>
      <CardContent>
        <p>{keywords}</p>
      </CardContent>
    </Card>
  );
};

export default Keywords;
