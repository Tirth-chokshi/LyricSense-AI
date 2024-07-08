"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from './ui/card';
import ReactMarkdown from 'react-markdown';
const Keywords = ({ keywords }) => {
  return (
    <Card>
      <CardHeader>
        {/* <h2 className="text-xl font-semibold">Keywords Response</h2> */}
      </CardHeader>
      <CardContent>
        <ReactMarkdown>
          {keywords}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default Keywords;
