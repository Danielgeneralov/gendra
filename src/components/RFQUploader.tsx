"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParsedRFQ } from '@/types/ParsedRFQ';
import ExtractedTextPreview from './ExtractedTextPreview';
import ParsingResults from './ParsingResults';
import { AlertIcon, LoadingIcon } from './icons';

/**
 * Props for the RFQUploader component
 */
type RFQUploaderProps = {
  /**
   * Optional callback when parsing is complete
   */
  onParsedRFQ?: (parsedData: ParsedRFQ, detectedIndustry?: string) => void;
  
  /**
   * Optional callback when parsing fails
   */
  onError?: (error: Error) => void;
};

/**
 * Component states
 */
type UploaderState = 
  | 'idle'          // Initial state
  | 'parsing'       // Sending to API for parsing
  | 'success'       // Parsing successful
  | 'error';        // Error in any step

/**
 * RFQUploader Component
 * Allows users to paste RFQ text and send it for parsing
 */
export default function RFQUploader({ onParsedRFQ, onError }: RFQUploaderProps) {
  // State
  const [text, setText] = useState<string>('');
  const [state, setState] = useState<UploaderState>('idle');
  const [progress, setProgress] = useState(0);
  const [parsedRFQ, setParsedRFQ] = useState<ParsedRFQ | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Handles text input change
   */
  const handleTextChange = useCallback((value: string) => {
    setText(value);
    
    // Reset error if user is typing again
    if (error) {
      setError(null);
    }
    
    // Reset to idle state if user starts editing after an error
    if (state === 'error' || state === 'success') {
      setState('idle');
    }
  }, [error, state]);
  
  /**
   * Handles the parse button click
   */
  const handleParseClick = useCallback(async () => {
    if (!text.trim()) return;
    
    setState('parsing');
    setProgress(30);
    setError(null);
    
    try {
      // Send text to API
      const response = await fetch('/api/v1/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      setProgress(70);
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to parse RFQ');
      }
      
      if (result.warning) {
        // Handle low confidence but still show results
        setError(`Warning: ${result.warning}`);
      } else {
        setError(null);
      }
      
      setParsedRFQ(result.data);
      setState('success');
      setProgress(100);
      
      // Call the callback if it exists
      if (onParsedRFQ) {
        onParsedRFQ(result.data, result.data.industry);
      }
    } catch (err) {
      console.error('Error parsing RFQ:', err);
      setError(err instanceof Error ? err.message : String(err));
      setState('error');
      if (onError && err instanceof Error) onError(err);
    }
  }, [text, onParsedRFQ, onError]);
  
  /**
   * Resets the component state
   */
  const handleReset = useCallback(() => {
    setText('');
    setParsedRFQ(null);
    setError(null);
    setState('idle');
    setProgress(0);
  }, []);
  
  /**
   * Renders the progress bar
   */
  const renderProgressBar = () => (
    <div className="w-full h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
      <motion.div 
        className="h-full bg-blue-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
  
  /**
   * Renders the error message
   */
  const renderError = () => {
    if (!error) return null;
    
    return (
      <motion.div 
        className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-300">{error}</div>
      </motion.div>
    );
  };
  
  /**
   * Renders the appropriate UI based on the current state
   */
  const renderContent = () => {
    switch (state) {
      case 'idle':
        return (
          <>
            <div className="mb-4">
              <label htmlFor="rfq-text" className="block text-sm font-medium text-gray-300 mb-2">
                Paste RFQ Text
              </label>
              <ExtractedTextPreview
                text=""
                value={text}
                onChange={handleTextChange}
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={handleParseClick}
                disabled={!text.trim()}
                className={`px-5 py-2 rounded-md text-white ${
                  text.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
                }`}
              >
                Parse with Groq
              </button>
            </div>
          </>
        );
        
      case 'parsing':
        return (
          <div className="text-center py-10">
            <LoadingIcon className="w-10 h-10 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-300 mb-2">Analyzing with Groq...</p>
            <p className="text-sm text-gray-500 mb-4">This might take a few seconds</p>
            {renderProgressBar()}
          </div>
        );
        
      case 'success':
        if (parsedRFQ) {
          return (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ParsingResults 
                  result={parsedRFQ} 
                  onReset={handleReset}
                />
              </motion.div>
            </AnimatePresence>
          );
        }
        return null;
        
      case 'error':
        return (
          <div className="text-center py-8">
            <AlertIcon className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 font-medium mb-2">Error Processing RFQ</p>
            <p className="text-sm text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full">
      {renderContent()}
      {state === 'idle' && renderError()}
    </div>
  );
} 