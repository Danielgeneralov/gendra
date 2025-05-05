"use client";

import { useState } from "react";
import type { ParsedRFQ } from "@/lib/groqParser";

export default function RFQPage() {
  const [rfqText, setRfqText] = useState("");
  const [parsedRFQ, setParsedRFQ] = useState<ParsedRFQ | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Reset states
    setParsedRFQ(null);
    setError(null);
    setSaveSuccess(false);
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: rfqText }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse RFQ");
      }
      
      const data = await response.json();
      setParsedRFQ(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleSaveToSupabase() {
    if (!parsedRFQ) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch("/api/save-parsed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parsed: parsedRFQ,
          sourceText: rfqText,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to save RFQ");
      }
      
      setSaveSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save RFQ data");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">RFQ Parser</h1>
          <p className="mt-2 text-gray-400">
            Paste your Request for Quote text and we&apos;ll extract structured data using Groq AI
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rfq-text" className="block text-sm font-medium text-gray-300 mb-2">
                RFQ Text
              </label>
              <textarea
                id="rfq-text"
                rows={6}
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste manufacturing RFQ text here..."
                value={rfqText}
                onChange={(e) => setRfqText(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || !rfqText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : "Parse RFQ"}
              </button>
            </div>
          </form>
          
          {/* Error message */}
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-800 rounded-md p-4 text-red-200">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {/* Success message */}
          {saveSuccess && (
            <div className="mt-6 bg-green-900/50 border border-green-800 rounded-md p-4 text-green-200">
              <div className="flex">
                <svg className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>RFQ data successfully saved to database!</p>
              </div>
            </div>
          )}
          
          {/* Results Panel */}
          {parsedRFQ && (
            <div className="mt-8 border-t border-gray-700 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Parsed RFQ Data</h2>
                
                <button
                  onClick={handleSaveToSupabase}
                  disabled={isSaving}
                  className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white text-sm py-1 px-3 rounded-md flex items-center transition-colors duration-200"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : "Save to Database"}
                </button>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Material</h3>
                    <p className="text-white">{parsedRFQ.material || "Not specified"}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Quantity</h3>
                    <p className="text-white">{parsedRFQ.quantity}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Manufacturing Complexity</h3>
                    <p className="text-white capitalize">{parsedRFQ.complexity}</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400">Dimensions (inches)</h3>
                    <div className="flex space-x-4 mt-1">
                      <div>
                        <span className="text-xs text-gray-500">Length</span>
                        <p className="text-white">{parsedRFQ.dimensions.length}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Width</span>
                        <p className="text-white">{parsedRFQ.dimensions.width}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Height</span>
                        <p className="text-white">{parsedRFQ.dimensions.height}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Deadline</h3>
                    <p className="text-white">
                      {parsedRFQ.deadline 
                        ? new Date(parsedRFQ.deadline).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 