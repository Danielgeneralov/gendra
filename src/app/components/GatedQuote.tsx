"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionButton } from "./MotionButton";
import { supabase } from "../supabase";

type GatedQuoteProps = {
  quoteAmount: number | null;
  isLoading: boolean;
  formData: {
    partType: string;
    material: string;
    quantity: number;
    complexity: string;
    deadline: string;
  };
};

export const GatedQuote = ({ quoteAmount, isLoading, formData }: GatedQuoteProps) => {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Calculate quote range (±10%)
  const quoteRange = quoteAmount
    ? {
        min: Math.floor(quoteAmount * 0.9),
        max: Math.ceil(quoteAmount * 1.1),
      }
    : null;

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

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email) || !quoteAmount) return;

    setIsEmailSubmitting(true);

    try {
      if (!supabase) {
        console.error("Supabase client not initialized");
        setSubmitStatus({
          type: "error",
          message: "Internal error – please try again later.",
        });
        return;
      }

      const { error } = await supabase
        .from("quote_leads")
        .insert({
          email,
          quote_amount: quoteAmount,
          created_at: new Date().toISOString(),
          is_contacted: false,
          notes: `Quote for ${formData.partType}, ${formData.material}, qty: ${formData.quantity}`,
        });

      if (error) {
        console.error("Error saving lead:", error);
        setSubmitStatus({
          type: "error",
          message: "There was an error saving your quote. Please try again.",
        });
      } else {
        setEmailSubmitted(true);
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your exact quote is now available below.",
        });
      }
    } catch (err) {
      console.error("Unexpected error during email submission:", err);
      setSubmitStatus({
        type: "error",
        message: "Unexpected error occurred. Please try again.",
      });
    } finally {
      setIsEmailSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  if (isLoading) {
    return (
      <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-md animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-slate-200 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!quoteAmount || !quoteRange) return null;

  return (
    <div className="mt-6">
      <AnimatePresence>
        {!emailSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 bg-indigo-50 border border-indigo-100 rounded-md"
          >
            <h2 className="text-lg font-medium text-indigo-800">Quote Range</h2>
            <p className="text-3xl font-bold text-indigo-700 mt-2">
              {formatCurrency(quoteRange.min)} – {formatCurrency(quoteRange.max)}
            </p>
            <p className="text-sm text-indigo-600 mt-2 mb-6">
              This estimated range is based on your specifications.
            </p>

            <div className="border-t border-indigo-200 pt-6">
              <h3 className="text-md font-medium text-indigo-800 mb-2">
                Want your exact quote and production timeline?
              </h3>
              <p className="text-sm text-indigo-600 mb-4">
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
                    className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      emailError ? "border-red-300" : "border-slate-300"
                    }`}
                    placeholder="Your email address"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    We won&apos;t spam you. We just want to help you quote smarter.
                  </p>
                </div>

                <MotionButton
                  type="submit"
                  primary
                  className="w-full"
                  disabled={isEmailSubmitting}
                >
                  {isEmailSubmitting ? "Processing..." : "Show Exact Quote"}
                </MotionButton>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-4 bg-green-50 border border-green-100 rounded-md"
          >
            {submitStatus.type === "success" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 p-3 rounded-md bg-green-100 text-green-800 text-sm"
              >
                {submitStatus.message}
              </motion.div>
            )}

            <h2 className="text-lg font-medium text-green-800">Exact Quote</h2>
            <p className="text-3xl font-bold text-green-700 mt-2">
              {formatCurrency(quoteAmount)}
            </p>
            <p className="text-sm text-green-600 mt-2">
              This quote is valid for 30 days and includes all manufacturing costs.
            </p>

            <div className="mt-4 p-3 rounded-md bg-green-100/50 border border-green-100">
              <h3 className="text-md font-medium text-green-800 mb-1">
                Production Timeline
              </h3>
              <p className="text-sm text-green-700">
                Standard production: 7-10 business days
              </p>
              <p className="text-sm text-green-700">
                Rush production available: 3-5 business days (25% premium)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
