"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Bug,
  Wifi,
  Server
} from 'lucide-react';

const ErrorDisplay = ({ 
  errors = [], 
  warnings = [], 
  type = 'error', 
  title,
  onRetry,
  onDismiss,
  showDetails = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || (!errors.length && !warnings.length)) {
    return null;
  }

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'network':
        return <Wifi className="h-5 w-5" />;
      case 'server':
        return <Server className="h-5 w-5" />;
      case 'validation':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bug className="h-5 w-5" />;
    }
  };

  const getErrorColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'yellow';
      case 'info':
        return 'blue';
      default:
        return 'destructive';
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  const allIssues = [
    ...errors.map(error => ({ 
      message: typeof error === 'string' ? error : error.message || 'Unknown error',
      type: 'error',
      details: typeof error === 'object' ? error : null
    })),
    ...warnings.map(warning => ({ 
      message: typeof warning === 'string' ? warning : warning.message || 'Unknown warning',
      type: 'warning',
      details: typeof warning === 'object' ? warning : null
    }))
  ];

  const severity = errors.length > 0 ? 'error' : 'warning';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`w-full ${className}`}
      >
        <Card className={`border-l-4 ${
          severity === 'error' 
            ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
            : 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  severity === 'error' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                }`}>
                  {severity === 'error' ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    severity === 'error' ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {title || (severity === 'error' ? 'Error Occurred' : 'Warning')}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {errors.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {errors.length} Error{errors.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                    {warnings.length > 0 && (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                        {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {allIssues.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`${
                      severity === 'error' ? 'text-red-600 hover:text-red-700' : 'text-yellow-600 hover:text-yellow-700'
                    }`}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className={`${
                    severity === 'error' ? 'text-red-600 hover:text-red-700' : 'text-yellow-600 hover:text-yellow-700'
                  }`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Show first issue always */}
              {allIssues.length > 0 && (
                <div className={`p-3 rounded-lg ${
                  allIssues[0].type === 'error' 
                    ? 'bg-red-100 dark:bg-red-900/20' 
                    : 'bg-yellow-100 dark:bg-yellow-900/20'
                }`}>
                  <div className="flex items-start space-x-2">
                    {getErrorIcon(allIssues[0].details?.type)}
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        allIssues[0].type === 'error' 
                          ? 'text-red-800 dark:text-red-200' 
                          : 'text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {allIssues[0].message}
                      </p>
                      {showDetails && allIssues[0].details && (
                        <pre className={`mt-2 text-xs ${
                          allIssues[0].type === 'error' 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-yellow-600 dark:text-yellow-400'
                        } font-mono bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto`}>
                          {JSON.stringify(allIssues[0].details, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Show additional issues when expanded */}
              <AnimatePresence>
                {isExpanded && allIssues.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {allIssues.slice(1).map((issue, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded ${
                          issue.type === 'error' 
                            ? 'bg-red-50 dark:bg-red-900/10' 
                            : 'bg-yellow-50 dark:bg-yellow-900/10'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {getErrorIcon(issue.details?.type)}
                          <p className={`text-sm ${
                            issue.type === 'error' 
                              ? 'text-red-700 dark:text-red-300' 
                              : 'text-yellow-700 dark:text-yellow-300'
                          }`}>
                            {issue.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                {onRetry && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onRetry}
                    className={`${
                      severity === 'error' 
                        ? 'border-red-300 text-red-700 hover:bg-red-50' 
                        : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                    }`}
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Retry
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className={`${
                    severity === 'error' ? 'text-red-600 hover:text-red-700' : 'text-yellow-600 hover:text-yellow-700'
                  }`}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorDisplay;
