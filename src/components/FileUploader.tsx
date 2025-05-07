"use client";

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParsedRFQ } from '@/types/ParsedRFQ';
import { extractTextFromFile } from '@/lib/fileParser';
import ExtractedTextPreview from './ExtractedTextPreview';
import ParsingResults from './ParsingResults';
import { FileIcon, UploadIcon, DocumentTextIcon, LoadingIcon, AlertIcon } from './icons';

/**
 * Accepted file types for the uploader
 */
const ACCEPTED_FILE_TYPES = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  csv: 'text/csv',
  txt: 'text/plain',
};

/**
 * Props for the FileUploader component
 */
type FileUploaderProps = {
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
  | 'extracting'    // File uploaded, extracting text
  | 'preview'       // Text extracted, showing preview for user to confirm
  | 'parsing'       // Sending to API for parsing
  | 'success'       // Parsing successful
  | 'error';        // Error in any step

/**
 * FileUploader Component
 * Handles file uploads, text extraction, and Groq parsing for RFQs
 */
export default function FileUploader({ onParsedRFQ, onError }: FileUploaderProps) {
  // File reference and states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploaderState>('idle');
  const [progress, setProgress] = useState(0);
  
  // Text and results states
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [parsedRFQ, setParsedRFQ] = useState<ParsedRFQ | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Handles the file selection
   */
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset states
    setError(null);
    setState('idle');
    setParsedRFQ(null);
    
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setState('extracting');
    setProgress(20);
    
    try {
      // Extract text from the file
      const result = await extractTextFromFile(selectedFile);
      setExtractedText(result.text);
      setEditedText(result.text); // Initialize edited text with extracted text
      setProgress(50);
      setState('preview');
    } catch (err) {
      console.error('Error extracting text from file:', err);
      setError(err instanceof Error ? err.message : String(err));
      setState('error');
      if (onError && err instanceof Error) onError(err);
    }
  }, [onError]);
  
  /**
   * Handles text editing
   */
  const handleTextChange = useCallback((value: string) => {
    setEditedText(value);
  }, []);
  
  /**
   * Handles the submit button click to parse the text
   */
  const handleParseClick = useCallback(async () => {
    if (!file || !editedText.trim()) return;
    
    setState('parsing');
    setProgress(70);
    
    try {
      // Send just the text and file metadata to the API for parsing
      const response = await fetch('/api/v1/parse-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: editedText,
          fileContext: {
            filename: file.name,
            fileType: file.type
          }
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to parse RFQ');
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
  }, [file, editedText, onParsedRFQ, onError]);
  
  /**
   * Resets the uploader to initial state
   */
  const handleReset = useCallback(() => {
    setFile(null);
    setExtractedText('');
    setEditedText('');
    setParsedRFQ(null);
    setError(null);
    setState('idle');
    setProgress(0);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  /**
   * Triggers the file input click
   */
  const handleUploadClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
   * Renders the upload area
   */
  const renderUploadArea = () => (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={Object.values(ACCEPTED_FILE_TYPES).join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <motion.div
        className="border-2 border-dashed border-gray-600 rounded-lg p-10 w-full text-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleUploadClick}
      >
        <div className="flex flex-col items-center justify-center text-gray-400">
          <UploadIcon className="w-16 h-16 mb-4" />
          <p className="text-xl font-medium mb-2">Upload RFQ Document</p>
          <p className="text-sm">Drag & drop or click to browse</p>
          <p className="text-xs mt-2 text-gray-500">Supported formats: PDF, Excel, CSV, TXT</p>
        </div>
      </motion.div>
    </div>
  );
  
  /**
   * Renders the file information
   */
  const renderFileInfo = () => {
    if (!file) return null;
    
    // Get the file icon based on type
    let FileTypeIcon = DocumentTextIcon;
    if (file.type === ACCEPTED_FILE_TYPES.pdf) {
      FileTypeIcon = FileIcon;
    }
    
    return (
      <div className="mt-4">
        <div className="flex items-center p-3 bg-gray-800 rounded-lg">
          <div className="bg-gray-700 rounded-md p-2 mr-3">
            <FileTypeIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{file.name}</p>
            <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            onClick={handleReset}
            className="ml-4 text-xs text-gray-400 hover:text-white"
          >
            Remove
          </button>
        </div>
      </div>
    );
  };
  
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
        return renderUploadArea();
        
      case 'extracting':
        return (
          <div className="text-center py-10">
            <LoadingIcon className="w-10 h-10 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-300 mb-2">Extracting text from file...</p>
            {renderProgressBar()}
          </div>
        );
        
      case 'preview':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              <h3 className="text-lg font-medium text-white mb-3">Extracted Text Preview</h3>
              <p className="text-sm text-gray-400 mb-4">
                Review and edit the extracted text before sending for parsing. This helps improve accuracy.
              </p>
              
              <ExtractedTextPreview
                text={extractedText}
                value={editedText}
                onChange={handleTextChange}
              />
              
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-gray-300 border border-gray-700 rounded-md hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleParseClick}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={!editedText.trim()}
                >
                  Parse with Groq
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        );
        
      case 'parsing':
        return (
          <div className="text-center py-10">
            <LoadingIcon className="w-10 h-10 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-300 mb-2">Analyzing RFQ with Groq...</p>
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
            <p className="text-red-400 font-medium mb-2">Error Processing File</p>
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
        return renderUploadArea();
    }
  };
  
  return (
    <div className="w-full">
      {(state === 'preview' || state === 'parsing' || state === 'success') && renderFileInfo()}
      {renderContent()}
      {renderError()}
    </div>
  );
} 