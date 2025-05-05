"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ParsedRFQ } from '@/lib/groqParser';

/**
 * RFQ Uploader Component
 * Allows users to input RFQ text, parse it, and save the structured data
 */
export default function RFQUploader({
  onParsedRFQ
}: {
  onParsedRFQ?: (parsedData: ParsedRFQ, detectedIndustry?: string) => void;
}) {
  // Form state
  const [rfqText, setRfqText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Response state
  const [parsedRFQ, setParsedRFQ] = useState<ParsedRFQ | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /**
   * Handles the RFQ text submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setParsedRFQ(null);
    setSaveSuccess(false);
    setIsSubmitting(true);
    
    try {
      // Call the parse API
      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: rfqText }),
      });
      
      if (!parseResponse.ok) {
        const errorData = await parseResponse.json();
        throw new Error(errorData.error || 'Failed to parse RFQ');
      }
      
      // Get the parsed RFQ data
      const parsedData = await parseResponse.json() as ParsedRFQ;
      setParsedRFQ(parsedData);
      
      // Store parsed data in sessionStorage for form prefilling
      try {
        sessionStorage.setItem('lastParsedRFQ', JSON.stringify(parsedData));
        console.log('RFQ data stored in sessionStorage for prefilling');
      } catch (storageError) {
        console.error('Error storing RFQ data in sessionStorage:', storageError);
      }
      
      // Call the callback if provided
      if (onParsedRFQ) {
        onParsedRFQ(parsedData, parsedData.industry);
      }
      
      // Mock successful save after a short delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set success state
      setSaveSuccess(true);
    } catch (err) {
      // Handle errors
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload RFQ</h2>
        
        {/* Error notification */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Success notification */}
        <AnimatePresence>
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-50 border-l-4 border-green-500 p-4 mb-6"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">RFQ successfully parsed and saved!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="rfq-text" className="block text-sm font-medium text-gray-700 mb-1">
              Paste RFQ Text
            </label>
            <textarea
              id="rfq-text"
              name="rfq-text"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste your RFQ details here..."
              value={rfqText}
              onChange={(e) => setRfqText(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !rfqText.trim()}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Parse & Save RFQ"}
            </motion.button>
          </div>
        </form>
        
        {/* Results Preview */}
        <AnimatePresence>
          {parsedRFQ && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="mt-8 border-t pt-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parsed RFQ Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Material</p>
                  <p className="font-medium">{parsedRFQ.material || 'Not specified'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{parsedRFQ.quantity || 'Not specified'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Complexity</p>
                  <p className="font-medium capitalize">{parsedRFQ.complexity || 'Not specified'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium">
                    {parsedRFQ.deadline 
                      ? new Date(parsedRFQ.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Dimensions</p>
                <div className="flex space-x-4">
                  <div>
                    <span className="text-xs text-gray-400">Length</span>
                    <p className="font-medium">{parsedRFQ.dimensions.length} in</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Width</span>
                    <p className="font-medium">{parsedRFQ.dimensions.width} in</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Height</span>
                    <p className="font-medium">{parsedRFQ.dimensions.height} in</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 