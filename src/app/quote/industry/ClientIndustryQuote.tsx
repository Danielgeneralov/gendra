"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollAnimation } from "../../components/ScrollAnimation";
import { IndustrySelector } from "../../components/IndustrySelector";
import { IndustryForm } from "../../components/IndustryForm";
import { QuoteCalculator } from "../../components/QuoteCalculator";
import { supabase } from "../../supabase";
import { motion } from "framer-motion";

// Define FormData interface
interface FormData {
  [key: string]: string | number;
}

interface ClientIndustryQuoteProps {
  initialIndustry: string;
}

// Loading component for Suspense fallback
const Loading = () => (
  <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-slate-700 rounded w-1/2 mb-8"></div>
      <div className="space-y-6">
        <div className="h-40 bg-slate-800 rounded"></div>
        <div className="h-60 bg-slate-800 rounded"></div>
      </div>
    </div>
  </div>
);

// Main content component that uses useSearchParams
const ClientIndustryQuoteContent = ({ initialIndustry }: ClientIndustryQuoteProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialIndustry);
  const [formData, setFormData] = useState<FormData>({});
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);

  // Update selected industry when URL changes
  useEffect(() => {
    const industry = searchParams?.get("industry");
    if (industry && industry !== selectedIndustry) {
      setSelectedIndustry(industry);
      // Reset form data when industry changes
      setFormData({});
      setShowQuoteCalculator(false);
    }
  }, [searchParams, selectedIndustry]);

  // Handle industry selection
  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustry(industryId);
    // Reset form data when industry changes
    setFormData({});
    setShowQuoteCalculator(false);
    
    // Update URL with new industry
    const params = new URLSearchParams(searchParams.toString());
    params.set("industry", industryId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle form submission
  const handleFormSubmit = async (data: FormData) => {
    setFormData(data);
    setShowQuoteCalculator(true);
  };

  // Handle email capture
  const handleEmailCapture = async (email: string, quoteAmount: number) => {
    if (!supabase) {
      console.error("Supabase client is not initialized");
      return;
    }

    try {
      const { error } = await supabase
        .from("quote_leads")
        .insert({
          email,
          quote_amount: quoteAmount,
          created_at: new Date().toISOString(),
          is_contacted: false,
          notes: `Quote for ${selectedIndustry}, amount: ${quoteAmount}`
        });

      if (error) {
        console.error("Error inserting quote lead into Supabase:", error);
      } else {
        console.warn("Successfully saved quote lead");
      }
    } catch (err) {
      console.error("Exception during Supabase quote lead insert:", err);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-4xl mx-auto">
        <ScrollAnimation>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">
              Industry-Specific Quoting
            </h1>
            <p className="text-lg text-[#CBD5E1] mb-8">
              Get accurate quotes tailored to your specific manufacturing needs
            </p>
          </motion.div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.1}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">
              Select Your Industry
            </h2>
            <IndustrySelector
              displayMode="tabs"
              onIndustryChange={handleIndustryChange}
              className="bg-[#0A1828]/50 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300"
            />
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="mb-8 bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">
              Part Specifications
            </h2>
            <IndustryForm
              industryId={selectedIndustry}
              onSubmit={handleFormSubmit}
            />
          </div>
        </ScrollAnimation>

        {showQuoteCalculator && (
          <ScrollAnimation delay={0.3}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.7,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">
                Quote Results
              </h2>
              <QuoteCalculator
                formData={formData}
                industryId={selectedIndustry}
                onCaptureEmail={handleEmailCapture}
              />
            </motion.div>
          </ScrollAnimation>
        )}
      </div>
    </div>
  );
};

// Main component with Suspense boundary
export default function ClientIndustryQuote(props: ClientIndustryQuoteProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ClientIndustryQuoteContent {...props} />
    </Suspense>
  );
} 