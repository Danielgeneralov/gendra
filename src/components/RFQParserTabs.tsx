"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ParsedRFQ } from '@/types/ParsedRFQ';
import RFQUploader from './RFQUploader';
import FileUploader from './FileUploader';

/**
 * Tab options for the RFQ parser
 */
type TabOption = 'text' | 'file';

/**
 * Props for the RFQParserTabs component
 */
type RFQParserTabsProps = {
  /**
   * Optional callback that is triggered when an RFQ is successfully parsed
   */
  onParsedRFQ?: (parsedData: ParsedRFQ, detectedIndustry?: string) => void;
};

/**
 * RFQParserTabs Component
 * Provides a tabbed interface to switch between text and file upload methods
 */
export default function RFQParserTabs({ onParsedRFQ }: RFQParserTabsProps) {
  // Active tab state
  const [activeTab, setActiveTab] = useState<TabOption>('text');
  
  /**
   * Handles tab change
   * 
   * @param tab Tab to activate
   */
  const handleTabChange = (tab: TabOption) => {
    setActiveTab(tab);
  };
  
  /**
   * Error handler for parsing errors
   */
  const handleError = (error: Error) => {
    console.error('Parsing error in RFQParserTabs:', error);
    // Could add toast notifications or other error handling here
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Tab navigation */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => handleTabChange('text')}
          className={`flex-1 py-4 text-center text-sm font-medium ${
            activeTab === 'text'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Paste RFQ Text
        </button>
        <button
          onClick={() => handleTabChange('file')}
          className={`flex-1 py-4 text-center text-sm font-medium ${
            activeTab === 'file'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Upload RFQ File
        </button>
      </div>

      {/* Tab content */}
      <div className="p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'text' ? (
            <RFQUploader onParsedRFQ={onParsedRFQ} onError={handleError} />
          ) : (
            <FileUploader onParsedRFQ={onParsedRFQ} onError={handleError} />
          )}
        </motion.div>
      </div>
    </div>
  );
} 