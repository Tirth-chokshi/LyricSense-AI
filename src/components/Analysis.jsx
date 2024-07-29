"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Analysis = ({ analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * 20;
      setShowExpandButton(contentRef.current.scrollHeight > maxHeight);
    }
  }, [analysis]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="bg-gradient-to-br from-secondary/10 to-primary/10">
      <CardHeader>
        <h3 className="text-xl font-semibold text-primary">Lyrical Interpretation</h3>
      </CardHeader>
      <CardContent className="relative">
        <div 
          ref={contentRef}
          className={`prose prose-sm dark:prose-invert max-w-none ${
            !isExpanded ? 'max-h-[30em] overflow-hidden' : ''
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-semibold text-foreground mb-3" {...props} />,
              p: ({ node, ...props }) => <p className="mb-4 text-muted-foreground" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1 text-muted-foreground" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-bold text-primary" {...props} />,
              em: ({ node, ...props }) => <em className="italic text-secondary-foreground" {...props} />,
              code: ({ node, inline, ...props }) => 
                inline 
                  ? <code className="px-1 py-0.5 rounded bg-muted text-muted-foreground" {...props} />
                  : <pre className="p-4 rounded bg-muted text-muted-foreground overflow-x-auto" {...props} />,
            }}
          >
            {analysis}
          </ReactMarkdown>
        </div>
        {!isExpanded && showExpandButton && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none"></div>
        )}
        {showExpandButton && (
          <div className="mt-4 text-center">
            <Button 
              onClick={toggleExpand}
              variant="outline"
              className="text-primary hover:text-primary-foreground hover:bg-primary transition-colors duration-200"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Analysis;