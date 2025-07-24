"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
        <Card className="relative bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">
                  Lyrical Deep Dive
                </h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analysis of literary devices, themes, and artistic intent
                </p>
              </div>
              {showExpandButton && (
                <Button 
                  onClick={toggleExpand}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Read More
                    </>
                  )}
                  {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="relative">
            <motion.div 
              ref={contentRef}
              className={`prose prose-sm dark:prose-invert max-w-none transition-all duration-500 ${
                !isExpanded ? 'max-h-[30em] overflow-hidden' : ''
              }`}
              animate={{ 
                height: isExpanded ? 'auto' : undefined,
                opacity: 1 
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold mb-4 text-primary border-b border-primary/20 pb-2" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-semibold text-foreground mb-3 mt-6 flex items-center gap-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-4 text-muted-foreground leading-relaxed" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1 text-muted-foreground" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary/50 pl-4 italic my-4 bg-primary/5 py-2 rounded-r-lg" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-primary" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-secondary" {...props} />
                  ),
                  code: ({ node, inline, ...props }) => 
                    inline 
                      ? <code className="px-2 py-1 rounded-md bg-muted text-muted-foreground font-mono text-sm" {...props} />
                      : <pre className="p-4 rounded-lg bg-muted text-muted-foreground overflow-x-auto font-mono text-sm border border-border/50" {...props} />,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </motion.div>
            
            {/* Gradient overlay for collapsed state */}
            {!isExpanded && showExpandButton && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            )}
            
            {/* Mobile expand button */}
            {showExpandButton && (
              <div className="mt-6 text-center md:hidden">
                <Button 
                  onClick={toggleExpand}
                  variant="outline"
                  className="text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-300 px-6 py-2"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Read Full Analysis
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Analysis;