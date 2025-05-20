"use client";

import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import type { OnboardingFormData } from "../OnboardingWizard";

type Step3Props = {
  nextStep: () => void;
  prevStep: () => void;
};

const CURRENCIES = [
  { id: "USD", label: "USD - US Dollar", symbol: "$" },
  { id: "EUR", label: "EUR - Euro", symbol: "€" },
  { id: "GBP", label: "GBP - British Pound", symbol: "£" },
  { id: "CAD", label: "CAD - Canadian Dollar", symbol: "C$" },
  { id: "AUD", label: "AUD - Australian Dollar", symbol: "A$" },
];

const UNITS = [
  { id: "metric", label: "Metric (mm, kg, etc.)" },
  { id: "imperial", label: "Imperial (in, lb, etc.)" },
];

const ROUNDING_OPTIONS = [
  { id: "nearest", label: "Round to nearest whole number" },
  { id: "up", label: "Always round up" },
  { id: "down", label: "Always round down" },
];

const FILE_FORMATS = [
  { id: "pdf", label: "PDF" },
  { id: "xlsx", label: "Excel (XLSX)" },
  { id: "csv", label: "CSV" },
];

export default function Step3Settings({ nextStep, prevStep }: Step3Props) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<OnboardingFormData>();
  const settings = watch("settings");

  // Handle continue button click
  const handleContinue = () => {
    nextStep();
  };

  // Handle back button click
  const handleBack = () => {
    prevStep();
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-800/60">
        <h2 className="text-xl font-semibold text-white mb-3">System Settings</h2>
        <p className="text-slate-300 text-base">
          Configure global settings for your quoting portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency Selection */}
        <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-xl border border-slate-800/60 shadow-lg shadow-slate-900/20">
          <label htmlFor="currency" className="block text-base font-medium text-slate-200 mb-3">
            Currency
          </label>
          <select
            id="currency"
            {...register("settings.currency")}
            className="w-full bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-lg p-3 shadow-inner shadow-slate-900/70 focus:ring-blue-500 focus:border-blue-500"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.label} ({currency.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Units Selection */}
        <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-xl border border-slate-800/60 shadow-lg shadow-slate-900/20">
          <label htmlFor="units" className="block text-base font-medium text-slate-200 mb-3">
            Measurement Units
          </label>
          <select
            id="units"
            {...register("settings.units")}
            className="w-full bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-lg p-3 shadow-inner shadow-slate-900/70 focus:ring-blue-500 focus:border-blue-500"
          >
            {UNITS.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rounding Rules */}
        <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-xl border border-slate-800/60 shadow-lg shadow-slate-900/20">
          <label htmlFor="rounding" className="block text-base font-medium text-slate-200 mb-3">
            Price Rounding <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <select
            id="rounding"
            {...register("settings.rounding")}
            className="w-full bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-lg p-3 shadow-inner shadow-slate-900/70 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No preference</option>
            {ROUNDING_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* File Format */}
        <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-xl border border-slate-800/60 shadow-lg shadow-slate-900/20">
          <label htmlFor="fileFormat" className="block text-base font-medium text-slate-200 mb-3">
            Quote Export Format <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <select
            id="fileFormat"
            {...register("settings.fileFormat")}
            className="w-full bg-slate-900 text-white placeholder-slate-400 border border-slate-700 rounded-lg p-3 shadow-inner shadow-slate-900/70 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Default (PDF)</option>
            {FILE_FORMATS.map((format) => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="pt-6 flex justify-between">
        <motion.button
          type="button"
          onClick={handleBack}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl shadow-lg shadow-slate-900/40 transition-all duration-200 flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>
        
        <motion.button
          type="button"
          onClick={handleContinue}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-900/40 transition-all duration-200 flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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