"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { INDUSTRY_REGISTRY } from "@/lib/industryRegistry";
import type { OnboardingFormData } from "../OnboardingWizard";
import { FormFieldType } from "@/lib/industryRegistry";

type Step2Props = {
  industry: string;
  nextStep: () => void;
  prevStep: () => void;
};

export default function Step2Parameters({ industry, nextStep, prevStep }: Step2Props) {
  const { setValue, watch, register, formState: { errors } } = useFormContext<OnboardingFormData>();
  const parameters = watch("parameters");
  
  // Get the industry configuration based on the selected industry
  const industryConfig = INDUSTRY_REGISTRY[industry];
  
  // Update default parameters when industry changes
  useEffect(() => {
    if (industry && industryConfig) {
      // Create a defaults object with all the default parameters
      const defaults: Record<string, any> = {};
      
      // Extract default values from the industry configuration
      industryConfig.formFields.forEach(field => {
        if ('defaultValue' in field) {
          defaults[field.id] = field.defaultValue;
        }
      });
      
      // Set the defaults in the form data
      setValue("parameters.defaults", defaults);
    } else if (industry) {
      // If we have an industry but no config, set some basic defaults
      setValue("parameters.defaults", {
        quantity: 1,
        material: "standard",
        complexity: "medium"
      });
    }
  }, [industry, industryConfig, setValue]);
  
  // Handle continue button click
  const handleContinue = () => {
    nextStep();
  };
  
  // Handle back button click
  const handleBack = () => {
    prevStep();
  };
  
  // Generate a preview of the default parameters
  const renderDefaultParameters = () => {
    if (!industryConfig) {
      return (
        <div className="p-4 bg-slate-800/70 rounded-md">
          <p className="text-amber-400">
            Custom industry configuration. You can add specific parameters via the custom logic section below.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {industryConfig.formFields.map(field => {
          // Skip quantity field (common to all industries)
          if (field.id === 'quantity') return null;
          
          let displayValue = '';
          
          if (field.type === FormFieldType.SELECT && 'options' in field) {
            const option = field.options.find(opt => opt.id === field.defaultValue);
            displayValue = option ? option.label : String(field.defaultValue || '');
          } else if (field.type === FormFieldType.NUMBER && 'unit' in field) {
            displayValue = `${field.defaultValue || 0} ${field.unit}`;
          } else if (field.type === FormFieldType.CHECKBOX) {
            displayValue = field.defaultValue ? 'Yes' : 'No';
          } else {
            displayValue = String(field.defaultValue || '');
          }
          
          return (
            <div key={field.id} className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-300">{field.label}:</span>
              <span className="text-white font-medium">{displayValue}</span>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Parameter Customization</h2>
        <p className="text-slate-300 text-sm">
          These are the default parameters for {industryConfig?.name || 'your industry'}. 
          You can customize how quoting works by adding your own logic below.
        </p>
      </div>
      
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-3">Default Parameters</h3>
        {renderDefaultParameters()}
      </div>
      
      <div>
        <label htmlFor="custom-parameters" className="block text-sm font-medium text-slate-300 mb-2">
          Custom Quoting Logic
        </label>
        <textarea
          id="custom-parameters"
          {...register("parameters.custom")}
          placeholder="Describe any custom quoting logic, pricing adjustments, or conditions you frequently use..."
          className="w-full min-h-[120px] bg-slate-800/70 border border-slate-700 rounded-md text-white p-3 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-slate-400 mt-1">
          Examples: "Add 20% markup for rush orders", "Discount 5% for orders over $10k", etc.
        </p>
      </div>
      
      <div className="pt-6 flex justify-between">
        <motion.button
          type="button"
          onClick={handleBack}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-md shadow-md transition-colors duration-200 flex items-center"
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
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-colors duration-200 flex items-center"
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