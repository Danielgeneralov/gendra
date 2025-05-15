"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ScrollAnimation } from "../components/ScrollAnimation";
import { IndustrySelector } from "../components/IndustrySelector";
import { IndustryForm } from "../components/IndustryForm";
import { QuoteCalculator } from "../components/QuoteCalculator";
import { Toast } from "../components/Toast";
import { supabase } from "../supabase";
import { DEFAULT_INDUSTRY, FEATURES } from "../config";
import { motion } from "framer-motion";

// Define types for analytics properties
interface AnalyticsProperties {
  [key: string]: string | number | boolean;
}


// Define form data type
interface FormData {
  [key: string]: string | number | boolean;
}

// Track events (stubbed with console logs)
const trackEvent = (eventName: string, properties?: AnalyticsProperties) => {
  if (FEATURES.SHOW_DEBUG_INFO) {
    console.log(`[Analytics] ${eventName}`, properties);
  }
};

export default function QuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    searchParams?.get("industry") || DEFAULT_INDUSTRY
  );
  const [formData, setFormData] = useState<FormData>({});
  const [showQuoteCalculator, setShowQuoteCalculator] = useState(false);
  const [isRedirected, setIsRedirected] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Handle URL param logic + legacy redirects
  useEffect(() => {
    const industry = searchParams?.get("industry");
    const hasVisitedBefore = localStorage.getItem("has_visited_new_quote");
    const oldParams = new URLSearchParams(window.location.search);

    if (oldParams.has("partType") || oldParams.has("material") || oldParams.has("quantity")) {
      const newParams = new URLSearchParams(oldParams);
      if (!newParams.has("industry")) {
        newParams.set("industry", DEFAULT_INDUSTRY);
      }

      if (!isRedirected) {
        setIsRedirected(true);

        if (!hasVisitedBefore) {
          setShowToast(true);
          localStorage.setItem("has_visited_new_quote", "true");
        }

        router.replace(`/quote?${newParams.toString()}`);
      }
    } else if (industry) {
      setSelectedIndustry(industry);
      trackEvent("industry_selected", { industry });

      if (!hasVisitedBefore && !isRedirected) {
        setShowToast(true);
        localStorage.setItem("has_visited_new_quote", "true");
      }
    } else if (!isRedirected) {
      setIsRedirected(true);
      setSelectedIndustry(DEFAULT_INDUSTRY);

      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("industry", DEFAULT_INDUSTRY);
      router.replace(`/quote?${params.toString()}`);

      trackEvent("industry_selected", {
        industry: DEFAULT_INDUSTRY,
        source: "default",
      });

      if (!hasVisitedBefore) {
        setShowToast(true);
        localStorage.setItem("has_visited_new_quote", "true");
      }
    }

    setFormData({});
    setShowQuoteCalculator(false);
  }, [searchParams, router, isRedirected]);

  // Change industry
  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustry(industryId);
    setFormData({});
    setShowQuoteCalculator(false);
    trackEvent("industry_changed", {
      industry: industryId,
      previous_industry: selectedIndustry,
    });
  };

  // Submit part data
  const handleFormSubmit = async (data: FormData, industry: string) => {
    setFormData(data);
    setShowQuoteCalculator(true);
    trackEvent("quote_form_submitted", {
      industry,
      fields_completed: Object.keys(data).length,
    });
  };

  // Capture email + quote
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
          notes: `Quote for ${selectedIndustry}, amount: ${quoteAmount}`,
        });

      if (error) {
        console.error("Error inserting quote lead:", error);
        trackEvent("quote_lead_error", {
          error: error.message,
          industry: selectedIndustry,
        });
      } else {
        console.log("Successfully saved quote lead");
        trackEvent("quote_lead_captured", {
          industry: selectedIndustry,
          quote_amount: quoteAmount,
        });
      }
    } catch (err) {
      console.error("Exception during Supabase quote lead insert:", err);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-4xl mx-auto">
        <Toast
          isVisible={showToast}
          message="Welcome to our new industry-specific quoting experience!"
          type="info"
          duration={7000}
          onClose={() => setShowToast(false)}
        />

        <ScrollAnimation>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">Industry-Specific Quoting</h1>
            <p className="text-lg text-[#CBD5E1] mb-8">
              Get accurate quotes tailored to your specific manufacturing needs
            </p>
          </motion.div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.1}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Select Your Industry</h2>
            <IndustrySelector
              displayMode="tabs"
              onIndustryChange={handleIndustryChange}
              className="bg-[#0A1828]/50 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300"
            />
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="mb-8 bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Part Specifications</h2>
            <IndustryForm industryId={selectedIndustry} onSubmit={handleFormSubmit} />
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
                damping: 15,
              }}
              className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Quote Results</h2>
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
}
