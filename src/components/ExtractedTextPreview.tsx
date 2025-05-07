"use client";

import { useState, useCallback } from 'react';

/**
 * Props for the ExtractedTextPreview component
 */
type ExtractedTextPreviewProps = {
  /**
   * The original extracted text
   */
  text: string;
  
  /**
   * The current value (may be edited)
   */
  value: string;
  
  /**
   * Callback when the text changes
   */
  onChange: (value: string) => void;
};

/**
 * ExtractedTextPreview Component
 * Displays the extracted text and allows for editing before submitting for parsing
 */
export default function ExtractedTextPreview({ text, value, onChange }: ExtractedTextPreviewProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  
  /**
   * Handles the text change event
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);
  
  /**
   * Toggles between original and edited text
   */
  const toggleView = useCallback(() => {
    setShowOriginal(prev => !prev);
  }, []);
  
  /**
   * Resets to the original text
   */
  const handleReset = useCallback(() => {
    onChange(text);
  }, [text, onChange]);
  
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <h4 className="text-sm font-medium text-white">
          {showOriginal ? 'Original Text' : 'Editable Text'}
        </h4>
        <div className="flex space-x-3">
          <button
            onClick={toggleView}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {showOriginal ? 'Edit Text' : 'View Original'}
          </button>
          
          {!showOriginal && (
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-300"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      
      <div className="relative bg-gray-900">
        {showOriginal ? (
          <div className="p-4 overflow-auto text-sm text-gray-300 font-mono whitespace-pre-wrap h-64 max-h-64">
            {text}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={handleChange}
            className="w-full h-64 max-h-64 p-4 bg-gray-900 text-gray-300 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="No text was extracted from the file"
          />
        )}
      </div>
    </div>
  );
} 