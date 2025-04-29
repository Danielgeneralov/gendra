"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionButton } from "./MotionButton";
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseOriginal } from "../supabase";

type QuoteEmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmit: (email: string) => void;
  quoteRange: { min: number; max: number } | null;
  formData: {
    partType: string;
    material: string;
    quantity: number;
    complexity: string;
    deadline: string;
  };
  quoteAmount: number | null;
};

const saveLeadToSupabase = async (email: string, quoteAmount: number, formData: any) => {
  try {
    const supabaseUrl = 'https://cpnbybkgniwshqavvnlz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbmJ5Ymtnbml3c2hxYXZ2bmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDg3MDEsImV4cCI6MjA1ODQyNDcwMX0.OXARQAInCNo8IX7qF2OjqABzDws6csfr8q4JzSZL6ec';
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return false;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log("Attempting to save lead to quote_leads from modal (direct client):", {
      email,
      quote_amount: quoteAmount,
      created_at: new Date().toISOString(),
      is_contacted: false,
      notes: `Quote for ${formData.partType}, ${formData.material}, qty: ${formData.quantity}`
    });
    
    const { data, error } = await supabase
      .from('quote_leads')
      .insert({
        email,
        quote_amount: quoteAmount,
        created_at: new Date().toISOString(),
        is_contacted: false,
        notes: `Quote for ${formData.partType}, ${formData.material}, qty: ${formData.quantity}`
      })
      .select();
    
    if (error) {
      console.error("Error saving lead from modal (direct client):", error);
      return false;
    } else {
      console.log("Successfully saved lead from modal (direct client):", data);
      return true;
    }
  } catch (err) {
    console.error("Exception during direct lead save from modal:", err);
    return false;
  }
};

export const QuoteEmailModal = ({
  isOpen,
  onClose,
  onEmailSubmit,
  quoteRange,
  formData,
  quoteAmount
}: QuoteEmailModalProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (quoteAmount) {
        const saveResult = await saveLeadToSupabase(email, quoteAmount, formData);
        
        if (!saveResult && supabaseOriginal) {
          try {
            console.log("Direct save failed in modal, trying original client");
            
            const { data, error } = await supabaseOriginal
              .from("quote_leads")
              .insert({
                email,
                quote_amount: quoteAmount,
                created_at: new Date().toISOString(),
                is_contacted: false,
                notes: `Quote for ${formData.partType}, ${formData.material}, qty: ${formData.quantity}`
              })
              .select();
            
            if (error) {
              console.error("Error saving lead with original client from modal:", error);
            } else {
              console.log("Successfully saved lead with original client from modal:", data);
            }
          } catch (err) {
            console.error("Exception during original client save from modal:", err);
          }
        }
      } else {
        console.warn("Quote amount is not available for modal save");
      }
      
      onEmailSubmit(email);
      
      onClose();
    } catch (err) {
      console.error("Error submitting email from modal:", err);
      setEmailError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Unlock Your Exact Quote</h2>
              <p className="text-slate-600">
                You're just one step away from accessing your exact quote and production timeline.
              </p>
            </div>
            
            {quoteRange && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-md text-center">
                <h3 className="font-medium text-indigo-800 mb-1">Your Quote Range</h3>
                <p className="text-2xl font-bold text-indigo-700">
                  {formatCurrency(quoteRange.min)} – {formatCurrency(quoteRange.max)}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    emailError ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="you@company.com"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
              
              <div className="text-xs text-slate-500">
                <p>
                  We won't spam you. We just want to help you quote smarter.
                </p>
              </div>
              
              <div className="pt-2">
                <MotionButton
                  type="submit"
                  primary
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Show Exact Quote"}
                </MotionButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}; 