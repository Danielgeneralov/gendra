// src/app/quote/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RFQParserTabs from "@/components/RFQParserTabs";
import IndustryCarousel from "@/components/IndustryCarousel";
import { INDUSTRIES } from "@/lib/industryData";
import type { ParsedRFQ } from "@/types/ParsedRFQ";
import { useProtectedPage } from "@/lib/hooks/useProtectedPage";
import StructuredData from "@/components/SEO/StructuredData";
import Breadcrumbs from "@/components/Breadcrumbs";

// Storage key for quote form data
const STORAGE_KEY = "gendra_draft_quote";

// Industry mapping for routing from parser results to slugs
const INDUSTRY_MAP: Record<string, string> = {
  "metal fabrication": "metal-fabrication",
  "injection molding": "injection-molding",
  "cnc machining": "cnc-machining",
  "sheet metal": "sheet-metal",
  "electronics assembly": "electronics-assembly",
  // Additional mappings for potential industry matches
  "printed circuit board": "electronics-assembly",
  "pcb assembly": "electronics-assembly",
  "plastic molding": "injection-molding",
  "machining": "cnc-machining"
};

export default function QuotePage() {
  useProtectedPage();
  
  const router = useRouter();
  const [parsingFailed, setParsingFailed] = useState(false);
  const [parsingError, setParsingError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // State for storing quote form data
  const [quoteData, setQuoteData] = useState<ParsedRFQ | null>(null);

  // Restore quote form data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setQuoteData(JSON.parse(saved));
        console.log("Restored quote draft from localStorage");
      } catch (error) {
        console.warn("Failed to restore quote draft", error);
      }
    }
  }, []);

  // Save quote form data to localStorage as user types
  useEffect(() => {
    if (quoteData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quoteData));
    }
  }, [quoteData]);

  // Handler for when RFQ is successfully parsed
  const handleParsedRFQ = (parsedData: ParsedRFQ, detectedIndustry?: string) => {
    // Use the industry field from parsed data if available, otherwise use the detected industry
    const industryToUse = parsedData.industry || detectedIndustry;
    
    // Update the quoteData state with parsed data (will trigger save to localStorage)
    setQuoteData(parsedData);
    
    if (!industryToUse) {
      setParsingFailed(true);
      setParsingError("Could not determine industry from the parsed RFQ");
      return;
    }

    // Normalize the industry string for matching
    const normalizedIndustry = industryToUse.toLowerCase().trim();
    
    // Try to find a matching industry slug
    const industrySlug = INDUSTRY_MAP[normalizedIndustry];
    
    if (industrySlug) {
      try {
        setSubmitting(true);
        // Store the parsed data in sessionStorage for the industry page to access
        sessionStorage.setItem('lastParsedRFQ', JSON.stringify(parsedData));
        
        // Route to the appropriate industry page with the parsed data
        router.push(`/quote/${industrySlug}?prefill=true`);
      } catch (error) {
        console.error("Error storing parsed RFQ data:", error);
        // Still try to route even if storage fails
        router.push(`/quote/${industrySlug}?prefill=true`);
      } finally {
        // In a real application, this finally block would be reached
        // but due to navigation, it might not execute
        setSubmitting(false);
      }
    } else {
      // No matching industry found
      setParsingFailed(true);
      setParsingError(`Unknown industry: "${industryToUse}"`);
    }
  };

  // Handler for clearing localStorage when the quote is successfully submitted
  const handleSuccessfulSubmit = () => {
    setSubmitting(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setQuoteData(null);
      console.log("Quote submitted successfully, cleared localStorage");
      // Additional success handling would go here
    } finally {
      setSubmitting(false);
    }
  };

  // Structured data for the quote page
  const quotePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Gendra Manufacturing Quote Generator",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Upload your RFQ or specifications to get instant manufacturing quotes for metal fabrication, CNC machining, sheet metal, and more. AI-powered for accuracy and speed.",
    "operatingSystem": "Web",
    "keywords": "manufacturing quotes, metal fabrication quotes, CNC machining quotes, sheet metal quotes, injection molding quotes",
  };

  return (
    <>
      <StructuredData data={quotePageStructuredData} />
      
      <div className="min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
        {/* Breadcrumbs */}
        <div className="w-full pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Quote', href: '/quote' }
              ]}
              className="text-[#CBD5E1]"
            />
          </div>
        </div>
        
        {/* Hero Section with RFQ Upload */}
        <div className="w-full py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-[#F0F4F8] mb-4 text-center"
            >
              Request a Quote
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#0A1828]/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300 max-w-4xl mx-auto"
            >
              {submitting && (
                <div className="absolute inset-0 bg-[#0A1828]/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                  <div className="text-center">
                    <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-blue-300 text-lg font-medium">Processing your request...</p>
                  </div>
                </div>
              )}
              
              {quoteData && (
                <div className="mb-4 p-3 bg-blue-900/30 border border-blue-800 rounded-md">
                  <p className="text-blue-200 font-medium">
                    We found a saved quote draft. Would you like to continue?
                  </p>
                  <div className="mt-2 flex space-x-3">
                    <button
                      onClick={() => {
                        // Use saved data
                        setSubmitting(true);
                        const industrySlug = INDUSTRY_MAP[quoteData.industry?.toLowerCase().trim() || ""];
                        if (industrySlug) {
                          router.push(`/quote/${industrySlug}?prefill=true`);
                        }
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                      disabled={submitting}
                    >
                      Continue
                    </button>
                    <button
                      onClick={() => {
                        // Clear saved data
                        localStorage.removeItem(STORAGE_KEY);
                        setQuoteData(null);
                      }}
                      className="px-3 py-1 bg-transparent hover:bg-slate-800 text-slate-300 rounded-md text-sm"
                      disabled={submitting}
                    >
                      Start New
                    </button>
                  </div>
                </div>
              )}
              
              <h2 className="text-2xl font-semibold text-[#4A6FA6] mb-4">Upload your RFQ — we&apos;ll handle the rest.</h2>
              <p className="text-[#94A3B8] mb-4">
                Upload a file or paste your RFQ text, and our AI will extract the key details and guide you to the right quoting form for your industry.
              </p>
              <p className="text-sm text-[#94A3B8] mb-6 italic">
                <span className="font-medium">Tip:</span> Make sure your RFQ mentions the industry (e.g. <em>metal fabrication</em>, <em>sheet metal</em>, etc.) so we can route you accurately.
              </p>
              
              <RFQParserTabs onParsedRFQ={handleParsedRFQ} />
              
              {parsingFailed && (
                <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-md">
                  <p className="text-red-200 font-medium">{parsingError}</p>
                  <p className="text-red-200 mt-2">Please try again or select your industry manually below.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Divider with text */}
        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1E293B]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-[#091121] text-[#94A3B8] text-lg">or browse by industry</span>
          </div>
        </div>
        
        {/* Industry Carousel Section */}
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-[#F0F4F8] mb-8 text-center"
            >
              Choose Your Manufacturing Industry
            </motion.h2>
            
            {/* Animated Industry Carousel */}
            <IndustryCarousel industries={INDUSTRIES} />
          </div>
        </div>
      </div>
    </>
  );
}
