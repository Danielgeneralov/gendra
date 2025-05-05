// src/app/quote/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import RFQUploader from "@/components/RFQUploader";
import IndustryCarousel from "@/components/IndustryCarousel";
import { INDUSTRIES } from "@/lib/industryData";
import type { ParsedRFQ } from "@/lib/groqParser";

// Industry mapping for routing from parser results to slugs
const INDUSTRY_MAP: Record<string, string> = {
  "metal fabrication": "metal-fabrication",
  "injection molding": "injection-molding",
  "cnc machining": "cnc-machining",
  "sheet metal": "sheet-metal",
  "electronics assembly": "electronics-assembly",
  "3d printing": "3d-printing"
};

export default function QuotePage() {
  const router = useRouter();
  const [parsingFailed, setParsingFailed] = useState(false);
  const [parsingError, setParsingError] = useState("");

  // Handler for when RFQ is successfully parsed
  const handleParsedRFQ = (parsedData: ParsedRFQ, detectedIndustry?: string) => {
    // Use the industry field from parsed data if available, otherwise use the detected industry
    const industryToUse = parsedData.industry || detectedIndustry;
    
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
        // Store the parsed data in sessionStorage for the industry page to access
        sessionStorage.setItem('lastParsedRFQ', JSON.stringify(parsedData));
        
        // Route to the appropriate industry page with the parsed data
        router.push(`/quote/${industrySlug}?prefill=true`);
      } catch (error) {
        console.error("Error storing parsed RFQ data:", error);
        // Still try to route even if storage fails
        router.push(`/quote/${industrySlug}?prefill=true`);
      }
    } else {
      // No matching industry found
      setParsingFailed(true);
      setParsingError(`Unknown industry: &quot;${industryToUse}&quot;`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
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
            <h2 className="text-2xl font-semibold text-[#4A6FA6] mb-4">Upload your RFQ — we&apos;ll handle the rest.</h2>
            <p className="text-[#94A3B8] mb-4">
              Paste or upload your RFQ, and our AI will extract the key details and guide you to the right quoting form for your industry.
            </p>
            <p className="text-sm text-[#94A3B8] mb-6 italic">
              <span className="font-medium">Tip:</span> Make sure your RFQ mentions the industry (e.g. <em>metal fabrication</em>, <em>sheet metal</em>, etc.) so we can route you accurately.
            </p>
            
            <RFQUploader onParsedRFQ={handleParsedRFQ} />
            
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
  );
}
