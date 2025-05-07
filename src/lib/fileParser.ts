/**
 * fileParser.ts
 * Utilities for extracting text content from various file types (PDF, Excel, CSV)
 */

import * as XLSX from 'xlsx';
import { FileParsingError } from './errors';
import logger from './logger';

// Component name for logging
const COMPONENT = 'fileParser';

/**
 * Supported file types by MIME type
 */
export const SUPPORTED_FILE_TYPES = {
  pdf: ['application/pdf'],
  excel: [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ],
  csv: ['text/csv'],
  text: ['text/plain'],
};

/**
 * File extraction result with metadata
 */
export interface ExtractedFileContent {
  text: string;
  metadata: {
    fileType: string;
    fileName: string;
    fileSize: number;
    pageCount?: number;
    sheetCount?: number;
    selectedSheet?: string;
    processingTime: number;
    charCount: number;
  };
  sheets?: Array<{
    name: string;
    text: string;
    rowCount: number;
    isEmpty: boolean;
  }>;
}

/**
 * Extracts text from a File object based on its type
 * 
 * @param file - The file to extract text from
 * @returns A promise resolving to the extracted text with metadata
 * @throws {FileParsingError} If the file type is unsupported or extraction fails
 */
export async function extractTextFromFile(file: File): Promise<ExtractedFileContent> {
  // Determine the file type and validate
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  const startTime = Date.now();
  
  logger.info(COMPONENT, 'Starting file extraction', {
    fileType,
    fileName,
    fileSize: file.size,
  });
  
  try {
    let result: ExtractedFileContent;
    
    // Handle file types
    if (SUPPORTED_FILE_TYPES.pdf.includes(fileType) || fileName.endsWith('.pdf')) {
      result = await extractTextFromPDF(file);
    } else if (
      SUPPORTED_FILE_TYPES.excel.includes(fileType) || 
      fileName.endsWith('.xlsx') || 
      fileName.endsWith('.xls')
    ) {
      result = await extractTextFromExcel(file);
    } else if (
      SUPPORTED_FILE_TYPES.csv.includes(fileType) || 
      fileName.endsWith('.csv')
    ) {
      result = await extractTextFromCSV(file);
    } else if (
      SUPPORTED_FILE_TYPES.text.includes(fileType) || 
      fileName.endsWith('.txt')
    ) {
      const text = await file.text();
      result = {
        text,
        metadata: {
          fileType: 'text/plain',
          fileName,
          fileSize: file.size,
          processingTime: Date.now() - startTime,
          charCount: text.length,
        },
      };
    } else {
      throw new FileParsingError(
        `Unsupported file type: ${fileType || 'unknown'}`, 
        fileType
      );
    }
    
    // Log successful extraction
    logger.info(COMPONENT, 'File extraction complete', {
      fileName,
      charCount: result.text.length,
      processingTime: result.metadata.processingTime,
    });
    
    return result;
  } catch (error) {
    // Log error and rethrow
    if (error instanceof FileParsingError) {
      logger.error(COMPONENT, `File parsing error: ${error.message}`, error, {
        fileName,
        fileType,
      });
      throw error;
    }
    
    logger.error(COMPONENT, 'Unexpected file parsing error', error, {
      fileName,
      fileType,
    });
    
    throw new FileParsingError(
      `Failed to extract text from ${fileName}: ${error instanceof Error ? error.message : String(error)}`,
      fileType,
      error
    );
  }
}

/**
 * Extracts text from a PDF file using pdf.js
 * 
 * @param file - The PDF file to extract text from
 * @returns A promise resolving to the extracted text with metadata
 * @throws {FileParsingError} If PDF extraction fails
 */
async function extractTextFromPDF(file: File): Promise<ExtractedFileContent> {
  const startTime = Date.now();
  const fileName = file.name;
  
  try {
    // Load PDF.js as a global for better compatibility
    if (typeof window !== 'undefined') {
      // Load only once
      if (!window.pdfjsLib) {
        // Use the CDN version to avoid bundling issues
        await loadPdfJsFromCdn();
      }
      
      // Convert the file to an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Ensure pdfjsLib is loaded
      if (!window.pdfjsLib) {
        throw new Error('PDF.js library failed to load');
      }
      
      // Load the PDF document
      const pdf = await window.pdfjsLib.getDocument({data: arrayBuffer}).promise;
      
      // Track errors during text extraction
      const errors: string[] = [];
      let extractedText = '';
      
      // Get the total number of pages
      const numPages = pdf.numPages;
      
      // Process each page
      for (let i = 1; i <= numPages; i++) {
        try {
          // Get the page
          const page = await pdf.getPage(i);
          
          // Extract text content
          const content = await page.getTextContent();
          
          // Combine the text items with better whitespace handling
          const pageText = content.items
            .map((item: any) => 'str' in item ? item.str : '')
            .join(' ')
            .replace(/\s+/g, ' '); // Normalize whitespace
          
          // Add page number and text
          extractedText += `\n--- Page ${i} ---\n${pageText}\n`;
        } catch (pageError) {
          const errorMsg = `Error on page ${i}: ${pageError instanceof Error ? pageError.message : String(pageError)}`;
          errors.push(errorMsg);
          logger.warn(COMPONENT, errorMsg, { fileName, page: i });
        }
      }
      
      // Clean up extracted text
      extractedText = extractedText.trim();
      
      // Check if we have any text
      if (extractedText.length === 0) {
        // If we have errors, throw with the error details
        if (errors.length > 0) {
          throw new FileParsingError(
            `Failed to extract text from PDF: ${errors.join(', ')}`,
            'application/pdf'
          );
        }
        
        // If we have no text but no errors, the PDF might be empty or image-based
        throw new FileParsingError(
          'No text content could be extracted from the PDF. The PDF might be empty, contain only images, or be password-protected.',
          'application/pdf'
        );
      }
      
      // Log warnings if we had errors but still extracted some text
      if (errors.length > 0) {
        logger.warn(COMPONENT, 'PDF extraction had issues but text was extracted', {
          fileName,
          errorCount: errors.length,
        });
      }
      
      // Return the extracted text with metadata
      return {
        text: extractedText,
        metadata: {
          fileType: 'application/pdf',
          fileName,
          fileSize: file.size,
          pageCount: numPages,
          processingTime: Date.now() - startTime,
          charCount: extractedText.length,
        },
      };
    } else {
      // Server-side - should not happen with 'use client' components
      throw new FileParsingError(
        'PDF extraction is only supported in the browser',
        'application/pdf'
      );
    }
  } catch (error) {
    // Enhance error message for PDF-specific issues
    let errorMessage = 'Failed to extract text from PDF';
    if (error instanceof Error) {
      // Check for common PDF-specific errors
      if (error.message.includes('password')) {
        errorMessage = 'The PDF is password-protected';
      } else if (error.message.includes('corrupt')) {
        errorMessage = 'The PDF file appears to be corrupted';
      } else {
        errorMessage = `${errorMessage}: ${error.message}`;
      }
    }
    
    throw new FileParsingError(errorMessage, 'application/pdf', error);
  }
}

/**
 * Loads PDF.js from CDN and sets it up globally
 */
async function loadPdfJsFromCdn(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Add the PDF.js library script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js';
      script.async = true;
      
      script.onload = () => {
        // Set up worker
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js';
          resolve();
        } else {
          reject(new Error('PDF.js loaded but pdfjsLib is not defined'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load PDF.js from CDN'));
      };
      
      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
}

// Add type definition for window
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

/**
 * Sheet data with text and metadata
 */
interface SheetData {
  name: string;
  text: string;
  rowCount: number;
  isEmpty: boolean;
  rfqLikelihood: number;
}

/**
 * Heuristic words that suggest a sheet contains RFQ data
 */
const RFQ_HEURISTIC_WORDS = [
  'quote', 'rfq', 'request', 'material', 'quantity', 'part',
  'dimension', 'spec', 'specification', 'drawing', 'deadline',
  'due date', 'delivery', 'tolerance', 'finish', 'requirement'
];

/**
 * Calculate likelihood that a sheet contains RFQ data based on heuristics
 * 
 * @param text - Text content of the sheet
 * @returns Score from 0-1 indicating likelihood
 */
function calculateRFQLikelihood(text: string): number {
  const normalizedText = text.toLowerCase();
  
  // Count occurrences of heuristic words
  let matchCount = 0;
  for (const word of RFQ_HEURISTIC_WORDS) {
    if (normalizedText.includes(word)) {
      matchCount++;
    }
  }
  
  // Calculate a score (0-1)
  return Math.min(1, matchCount / (RFQ_HEURISTIC_WORDS.length * 0.5));
}

/**
 * Extracts text from an Excel file with advanced sheet handling
 * 
 * @param file - The Excel file to extract text from
 * @returns A promise resolving to the extracted text with metadata
 * @throws {FileParsingError} If Excel extraction fails
 */
async function extractTextFromExcel(file: File): Promise<ExtractedFileContent> {
  const startTime = Date.now();
  const fileName = file.name;
  
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Read the workbook
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Extract sheets data
    const sheetNames = workbook.SheetNames;
    
    // If no sheets, throw an error
    if (sheetNames.length === 0) {
      throw new FileParsingError('No sheets found in the Excel file', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }
    
    // Process each sheet
    const sheets: SheetData[] = [];
    
    for (const sheetName of sheetNames) {
      // Get the worksheet
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Build text representation
      let sheetText = `\n--- Sheet: ${sheetName} ---\n`;
      
      // Convert JSON data to text
      for (const row of jsonData) {
        if (Array.isArray(row) && row.length > 0) {
          sheetText += row.join('\t') + '\n';
        }
      }
      
      const isEmpty = jsonData.length === 0 || 
                    (jsonData.length === 1 && Array.isArray(jsonData[0]) && jsonData[0].length === 0);
      
      // Calculate RFQ relevance score
      const rfqLikelihood = isEmpty ? 0 : calculateRFQLikelihood(sheetText);
      
      sheets.push({
        name: sheetName,
        text: sheetText,
        rowCount: jsonData.length,
        isEmpty,
        rfqLikelihood
      });
    }
    
    // Sort sheets by RFQ likelihood (most relevant first)
    sheets.sort((a, b) => b.rfqLikelihood - a.rfqLikelihood);
    
    // Choose the most relevant sheet with content
    const nonEmptySheets = sheets.filter(sheet => !sheet.isEmpty);
    const selectedSheet = nonEmptySheets.length > 0 ? nonEmptySheets[0] : sheets[0];
    
    // Combine all sheets' text, with most relevant first
    let combinedText = '';
    for (const sheet of sheets) {
      combinedText += sheet.text;
    }
    
    // Map to the return format
    const sheetsForOutput = sheets.map(({ name, text, rowCount, isEmpty }) => ({
      name,
      text,
      rowCount,
      isEmpty
    }));
    
    // Return the result
    return {
      text: selectedSheet.text,
      sheets: sheetsForOutput,
      metadata: {
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        fileName,
        fileSize: file.size,
        sheetCount: sheets.length,
        selectedSheet: selectedSheet.name,
        processingTime: Date.now() - startTime,
        charCount: selectedSheet.text.length,
      },
    };
  } catch (error) {
    if (error instanceof FileParsingError) {
      throw error;
    }
    
    throw new FileParsingError(
      `Failed to extract text from Excel file: ${error instanceof Error ? error.message : String(error)}`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      error
    );
  }
}

/**
 * Extracts text from a CSV file
 * 
 * @param file - The CSV file to extract text from
 * @returns A promise resolving to the extracted text with metadata
 * @throws {FileParsingError} If CSV extraction fails
 */
async function extractTextFromCSV(file: File): Promise<ExtractedFileContent> {
  const startTime = Date.now();
  const fileName = file.name;
  
  try {
    // Convert the file to text
    const text = await file.text();
    
    // Split into rows for better formatting
    const rows = text.split(/\r?\n/);
    
    // If no rows, throw an error
    if (rows.length === 0 || (rows.length === 1 && rows[0].trim() === '')) {
      throw new FileParsingError('Empty CSV file', 'text/csv');
    }
    
    // Format text for RFQ parsing - separate columns with tabs for better readability
    const formattedText = rows.map(row => {
      // Handle different CSV formats (comma, semicolon, tab)
      let delimiter = ',';
      if (row.includes('\t')) delimiter = '\t';
      else if (row.includes(';')) delimiter = ';';
      
      // Split and rejoin with tabs for consistent formatting
      return row.split(delimiter).join('\t');
    }).join('\n');
    
    return {
      text: formattedText,
      metadata: {
        fileType: 'text/csv',
        fileName,
        fileSize: file.size,
        processingTime: Date.now() - startTime,
        charCount: formattedText.length,
      },
    };
  } catch (error) {
    if (error instanceof FileParsingError) {
      throw error;
    }
    
    throw new FileParsingError(
      `Failed to extract text from CSV file: ${error instanceof Error ? error.message : String(error)}`,
      'text/csv',
      error
    );
  }
} 