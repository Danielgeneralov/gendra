"use client";

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ParsedRFQ, VALID_INDUSTRIES } from '@/types/ParsedRFQ';

/**
 * Props for the ParsingResults component
 */
type ParsingResultsProps = {
  /**
   * The parsed RFQ data
   */
  result: ParsedRFQ;
  
  /**
   * Optional callback when the user wants to reset
   */
  onReset?: () => void;
  
  /**
   * Optional callback when the user confirms the industry
   */
  onConfirmIndustry?: (industry: string) => void;
};

/**
 * Format ISO date string to a readable format
 * 
 * @param isoDate - ISO date string
 * @returns Formatted date string
 */
function formatDate(isoDate: string): string {
  if (!isoDate) return 'Not specified';
  
  try {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return isoDate; // Return original if parsing fails
  }
}

/**
 * Get CSS color class based on confidence score
 * 
 * @param confidence - Confidence score (0-1)
 * @returns CSS color class
 */
function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-green-400';
  if (confidence >= 0.6) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * ParsingResults Component
 * Displays the parsed RFQ data with confidence scores and allows industry confirmation
 */
export default function ParsingResults({ result, onReset, onConfirmIndustry }: ParsingResultsProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(result.industry);
  
  /**
   * Handles industry selection
   */
  const handleIndustryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIndustry(e.target.value);
  }, []);
  
  /**
   * Handles confirmation button click
   */
  const handleConfirm = useCallback(() => {
    if (onConfirmIndustry) {
      onConfirmIndustry(selectedIndustry);
    }
  }, [selectedIndustry, onConfirmIndustry]);
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mt-6">
      <h3 className="text-xl font-medium text-white mb-6">Parsing Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Material */}
        <div>
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm text-gray-400">Material</p>
            {result.material_confidence !== undefined && (
              <span className={`text-xs ${getConfidenceColor(result.material_confidence)}`}>
                {Math.round(result.material_confidence * 100)}% confident
              </span>
            )}
          </div>
          <p className="font-medium text-white">{result.material || 'Not specified'}</p>
        </div>
        
        {/* Quantity */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Quantity</p>
          <p className="font-medium text-white">{result.quantity || 'Not specified'}</p>
        </div>
        
        {/* Complexity */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Complexity</p>
          <p className="font-medium text-white capitalize">{result.complexity || 'Not specified'}</p>
        </div>
        
        {/* Industry */}
        <div>
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm text-gray-400">Industry</p>
            {result.industry_confidence !== undefined && (
              <span className={`text-xs ${getConfidenceColor(result.industry_confidence)}`}>
                {Math.round(result.industry_confidence * 100)}% confident
              </span>
            )}
          </div>
          <select
            value={selectedIndustry}
            onChange={handleIndustryChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {VALID_INDUSTRIES.map(industry => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
        
        {/* Deadline */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Deadline</p>
          <p className="font-medium text-white">
            {result.deadline ? formatDate(result.deadline) : 'Not specified'}
          </p>
        </div>
        
        {/* Finish */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Finish</p>
          <p className="font-medium text-white">{result.finish || 'Not specified'}</p>
        </div>
        
        {/* Tolerance */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Tolerance</p>
          <p className="font-medium text-white">{result.tolerance || 'Not specified'}</p>
        </div>
        
        {/* Model Used */}
        <div>
          <p className="text-sm text-gray-400 mb-1">Parsing Version</p>
          <p className="font-medium text-gray-500 text-sm">
            {result.parsing_version || 'Unknown'} 
            {result.modelUsed ? ` (${result.modelUsed})` : ''}
          </p>
        </div>
      </div>
      
      {/* Dimensions */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2">Dimensions</p>
        <div className="flex flex-wrap gap-6">
          <div className="px-4 py-2 bg-gray-700 rounded-md">
            <span className="text-xs text-gray-400">Length</span>
            <p className="font-medium text-white">{result.dimensions.length} mm</p>
          </div>
          <div className="px-4 py-2 bg-gray-700 rounded-md">
            <span className="text-xs text-gray-400">Width</span>
            <p className="font-medium text-white">{result.dimensions.width} mm</p>
          </div>
          <div className="px-4 py-2 bg-gray-700 rounded-md">
            <span className="text-xs text-gray-400">Height</span>
            <p className="font-medium text-white">{result.dimensions.height} mm</p>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end space-x-4 mt-6">
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
          >
            Upload Another File
          </button>
        )}
        
        {onConfirmIndustry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm & Proceed to {selectedIndustry} Quote
          </motion.button>
        )}
      </div>
    </div>
  );
} 