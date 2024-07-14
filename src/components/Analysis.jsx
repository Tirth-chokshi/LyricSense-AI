"use client";

import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import ReactMarkdown from 'react-markdown';

const Analysis = ({ analysis }) => {
  return (
    <Card className="bg-gradient-to-br from-secondary/10 to-primary/10">
      <CardHeader>
        <h3 className="text-xl font-semibold text-primary">Lyrical Interpretation</h3>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-primary mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-primary-foreground mb-3" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 text-muted-foreground" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1 text-muted-foreground" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />,
            }}
          >
            {analysis}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analysis;
