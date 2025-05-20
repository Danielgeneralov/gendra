"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { INDUSTRIES } from "@/lib/industryData";
import type { OnboardingFormData } from "../OnboardingWizard";

type Step1Props = {
  nextStep: () => void;
};

export default function Step1IndustrySelection({ nextStep }: Step1Props) {
  const { register, setValue, watch, formState: { errors } } = useFormContext<OnboardingFormData>();
  const selectedIndustry = watch("industry");
  
  // Set a default industry if none is selected
  useEffect(() => {
    if (!selectedIndustry && INDUSTRIES.length > 0) {
      setValue("industry", INDUSTRIES[0].id);
    }
  }, [selectedIndustry, setValue]);

  const handleIndustryChange = (industryId: string) => {
    setValue("industry", industryId);
  };
  
  const handleContinue = () => {
    if (selectedIndustry) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-800/60">
        <h2 className="text-xl font-semibold text-white mb-3">Select Your Industry</h2>
        <p className="text-slate-300 text-base">
          Choose the primary manufacturing category that best represents your business.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {INDUSTRIES.map((industry) => (
          <motion.button
            key={industry.id}
            type="button"
            className={`
              flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200
              backdrop-blur-sm shadow-lg
              ${selectedIndustry === industry.id
                ? "border-blue-500 bg-blue-900/30 text-white shadow-blue-900/40"
                : "border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-800/90 hover:border-slate-600 shadow-slate-900/40"
              }
            `}
            onClick={() => handleIndustryChange(industry.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-16 h-16 flex items-center justify-center mb-4 rounded-full bg-slate-900/80 p-4">
              <svg
                className={`w-10 h-10 ${selectedIndustry === industry.id ? "text-blue-400" : "text-slate-400"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={industry.icon} />
              </svg>
            </div>
            <span className="font-medium text-lg">{industry.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="pt-6 flex justify-end">
        <motion.button
          type="button"
          onClick={handleContinue}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-200 flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selectedIndustry}
        >
          Continue
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
} 