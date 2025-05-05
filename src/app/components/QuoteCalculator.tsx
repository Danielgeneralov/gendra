"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionButton } from "./MotionButton";

type QuoteResult = {
  quote: number;
  leadTime: string;
  complexity: string;
  basePrice: number;
  materialCost: number;
  complexityFactor: number;
  quantityDiscount: number;
};

interface QuoteFormData {
  [key: string]: unknown;
}

type QuoteCalculatorProps = {
  formData: QuoteFormData;
  industryId: string;
  onCaptureEmail?: (email: string, quoteAmount: number) => Promise<void>;
  className?: string;
};

export const QuoteCalculator = ({
  formData,
  industryId,
  onCaptureEmail,
  className = "",
}: QuoteCalculatorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quoteRange = quoteResult
    ? {
        min: Math.floor(quoteResult.quote * 0.9),
        max: Math.ceil(quoteResult.quote * 1.1),
      }
    : null;

  // ✅ Memoized quote calculation to satisfy ESLint
  const calculateQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/quote/${industryId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error calculating quote: ${response.status}`);
      }

      const data = await response.json();
      setQuoteResult(data);
    } catch (err) {
      console.error("Failed to calculate quote:", err);
      setError("Failed to generate quote. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, industryId]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      calculateQuote();
    }
  }, [calculateQuote, formData]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email) || !quoteResult) return;

    setIsSubmitting(true);
    try {
      if (onCaptureEmail) {
        await onCaptureEmail(email, quoteResult.quote);
      }
      setEmailSubmitted(true);
    } catch (err) {
      console.error("Error submitting email:", err);
      setEmailError("Failed to submit email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-6 bg-[#050C1C] rounded w-1/3"></div>
        <div className="h-10 bg-[#050C1C] rounded w-2/3"></div>
        <div className="h-6 bg-[#050C1C] rounded w-1/2"></div>
        <div className="h-20 bg-[#050C1C] rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-900/30 border border-red-800/50 rounded-md p-4 text-red-200 ${className}`}>
        <p>{error}</p>
        <button
          onClick={calculateQuote}
          className="mt-2 px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!quoteResult) return null;

  return (
    <div className={`mt-6 ${className}`}>
      <AnimatePresence mode="wait">
        {!emailSubmitted ? (
          <motion.div
            key="quote-range"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="p-4 bg-[#0A1828]/20 border border-[#4A6FA6]/40 rounded-md shadow-lg"
          >
            <h2 className="text-lg font-medium text-[#4A6FA6]">Quote Range</h2>
            <p className="text-3xl font-bold text-[#E6C300] mt-2">
              {formatCurrency(quoteRange?.min || 0)} – {formatCurrency(quoteRange?.max || 0)}
            </p>
            <p className="text-sm text-[#CBD5E1] mt-2 mb-6">
              This estimated range is based on your specifications.
            </p>

            <div className="border-t border-[#4A6FA6]/40 pt-6">
              <h3 className="text-md font-medium text-[#4A6FA6] mb-2">
                Want your exact quote and production timeline?
              </h3>
              <p className="text-sm text-[#CBD5E1] mb-4">
                Enter your email to unlock it.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    className={`block w-full px-4 py-2 rounded-md shadow-md bg-[#050C1C] text-[#F0F4F8] ${
                      emailError
                        ? "border border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border border-[#0A1828] focus:ring-[#4A6FA6] focus:border-[#4A6FA6]"
                    } focus:outline-none transition-all duration-300`}
                    placeholder="Your email address"
                  />
                  {emailError && <p className="mt-1 text-sm text-red-400">{emailError}</p>}
                  <p className="mt-2 text-xs text-[#CBD5E1]">
                    We won&apos;t spam you. We just want to help you quote smarter.
                  </p>
                </div>

                <MotionButton type="submit" primary className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Show Exact Quote"}
                </MotionButton>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quote-exact"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="p-4 bg-[#0A1828]/20 border border-[#4A6FA6]/40 rounded-md shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 p-3 rounded-md bg-[#0A1828]/30 text-[#CBD5E1] text-sm"
            >
              Thank you! Your exact quote is now available below.
            </motion.div>

            <h2 className="text-lg font-medium text-[#4A6FA6]">Exact Quote</h2>
            <p className="text-3xl font-bold text-[#FFD700] mt-2">
              {formatCurrency(quoteResult.quote)}
            </p>
            <p className="text-sm text-[#CBD5E1] mt-2">
              This quote is valid for 30 days and includes all manufacturing costs.
            </p>

            <div className="mt-4 p-3 rounded-md bg-[#0A1828]/20 border border-[#4A6FA6]/40">
              <h3 className="text-md font-medium text-[#4A6FA6] mb-1">Production Timeline</h3>
              <p className="text-sm text-[#CBD5E1]">Standard production: {quoteResult.leadTime}</p>
              <p className="text-sm text-[#CBD5E1]">
                Rush production available: 50% faster (25% premium)
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-md bg-[#050C1C]/70 border border-[#0A1828]/50">
                <p className="text-sm font-medium text-[#CBD5E1]">Material</p>
                <p className="text-lg font-semibold text-[#5A54A3]">
                  {formatCurrency(quoteResult.materialCost)}
                </p>
              </div>
              <div className="p-3 rounded-md bg-[#050C1C]/70 border border-[#0A1828]/50">
                <p className="text-sm font-medium text-[#CBD5E1]">Complexity</p>
                <p className="text-lg font-semibold text-[#5A54A3]">
                  {quoteResult.complexity} ({quoteResult.complexityFactor}x)
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 px-4 py-3 bg-[#0A1828]/20 border border-[#4A6FA6]/40 rounded-md"
            >
              <h3 className="text-md font-medium text-[#4A6FA6] mb-2">Ready to move forward?</h3>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <MotionButton primary className="w-full sm:w-auto">
                  Place Order
                </MotionButton>
                <MotionButton className="w-full sm:w-auto">Download Quote</MotionButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
