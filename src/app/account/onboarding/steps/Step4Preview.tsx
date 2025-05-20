"use client";

import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { INDUSTRY_REGISTRY } from "@/lib/industryRegistry";
import type { OnboardingFormData } from "../OnboardingWizard";
import { CheckIcon, RefreshCw } from "lucide-react";

type Step4Props = {
  onSubmit: () => void;
  prevStep: () => void;
  isSubmitting: boolean;
};

export default function Step4Preview({ onSubmit, prevStep, isSubmitting }: Step4Props) {
  const { watch } = useFormContext<OnboardingFormData>();
  const formData = watch();
  
  // Get the selected industry
  const industry = formData.industry;
  const industryConfig = INDUSTRY_REGISTRY[industry];
  
  // Get the selected settings
  const { currency, units, rounding, fileFormat } = formData.settings;
  
  // Currency formatter
  const formatCurrency = (amount: number) => {
    const formatter = new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", {
      style: "currency",
      currency: currency,
    });
    return formatter.format(amount);
  };
  
  // Mock quote preview data based on the selected industry
  const sampleQuoteData = {
    customer: "Sample Customer, Inc.",
    date: new Date().toLocaleDateString(),
    quoteNumber: "Q-" + Math.floor(10000 + Math.random() * 90000),
    basePrice: industryConfig?.basePrice || 50,
    items: [
      {
        name: `${industryConfig?.name || 'Manufacturing'} Services`,
        quantity: 10,
        unitPrice: (industryConfig?.basePrice || 50) * 1.2,
      },
      {
        name: "Materials",
        quantity: 1,
        unitPrice: (industryConfig?.basePrice || 50) * 0.6, 
      },
      {
        name: "Rush Processing",
        quantity: 1,
        unitPrice: (industryConfig?.basePrice || 50) * 0.3,
      }
    ]
  };
  
  // Calculate total
  const total = sampleQuoteData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  
  return (
    <div className="space-y-8">
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-800/60">
        <h2 className="text-xl font-semibold text-white mb-3">Preview & Approve</h2>
        <p className="text-slate-300 text-base">
          Review your quoting portal configuration before finalizing the setup.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-xl border border-slate-800/60 shadow-lg shadow-slate-900/20">
          <h3 className="text-lg font-medium text-blue-400 mb-4">Your Selections</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-slate-700/80 pb-2">
              <span className="text-slate-300">Industry:</span>
              <span className="text-white font-medium">{industryConfig?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/80 pb-2">
              <span className="text-slate-300">Currency:</span>
              <span className="text-white font-medium">{currency}</span>
            </div>
            <div className="flex justify-between border-b border-slate-700/80 pb-2">
              <span className="text-slate-300">Units:</span>
              <span className="text-white font-medium">{units === "metric" ? "Metric" : "Imperial"}</span>
            </div>
            {rounding && (
              <div className="flex justify-between border-b border-slate-700/80 pb-2">
                <span className="text-slate-300">Rounding:</span>
                <span className="text-white font-medium">{rounding}</span>
              </div>
            )}
            {fileFormat && (
              <div className="flex justify-between border-b border-slate-700/80 pb-2">
                <span className="text-slate-300">Export Format:</span>
                <span className="text-white font-medium">{fileFormat.toUpperCase()}</span>
              </div>
            )}
            {formData.parameters.custom && (
              <div className="mt-4 pt-2 border-t border-slate-700/80">
                <span className="text-slate-300 block mb-2">Custom Logic:</span>
                <span className="text-white text-sm italic block bg-slate-800/60 p-3 rounded-lg">"{formData.parameters.custom}"</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Quote Preview */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg shadow-slate-900/20">
          <div className="bg-slate-900 border-b border-slate-700/60 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">Quote Preview</h3>
                <p className="text-sm text-slate-400">How your quotes will look</p>
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold py-1 px-2 rounded">
                SAMPLE
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6 text-white space-y-2">
              <p className="text-sm"><span className="text-slate-400">Customer:</span> {sampleQuoteData.customer}</p>
              <p className="text-sm"><span className="text-slate-400">Date:</span> {sampleQuoteData.date}</p>
              <p className="text-sm"><span className="text-slate-400">Quote #:</span> {sampleQuoteData.quoteNumber}</p>
            </div>
            
            <table className="w-full text-sm mb-6 border-collapse">
              <thead>
                <tr className="border-b border-slate-700/60">
                  <th className="text-left py-3 text-slate-300">Description</th>
                  <th className="text-center py-3 text-slate-300">Qty</th>
                  <th className="text-right py-3 text-slate-300">Unit Price</th>
                  <th className="text-right py-3 text-slate-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sampleQuoteData.items.map((item, index) => (
                  <tr key={index} className="border-b border-slate-800">
                    <td className="py-3 text-white">{item.name}</td>
                    <td className="text-center py-3 text-white">{item.quantity}</td>
                    <td className="text-right py-3 text-white">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-3 text-white">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-800/50">
                  <td colSpan={3} className="text-right py-3 font-bold text-white">Total:</td>
                  <td className="text-right py-3 font-bold text-blue-400">{formatCurrency(total)}</td>
                </tr>
              </tfoot>
            </table>
            
            <div className="text-sm text-slate-400 italic">
              <p>All quotes are valid for 30 days.</p>
              <p>Contact us for more information.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6 flex justify-between">
        <motion.button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl shadow-lg shadow-slate-900/40 transition-all duration-200 flex items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
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
          onClick={onSubmit}
          className={`
            px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600
            text-white font-medium rounded-xl shadow-lg shadow-blue-900/40 
            transition-all duration-200 flex items-center
            ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
          `}
          whileHover={isSubmitting ? {} : { scale: 1.02 }}
          whileTap={isSubmitting ? {} : { scale: 0.98 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Loading your quoting portal...
            </>
          ) : (
            <>
              <CheckIcon className="h-5 w-5 mr-2" />
              Finalize & Setup
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
} 