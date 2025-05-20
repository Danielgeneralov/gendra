"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRIES } from "@/lib/industryData";
import { CheckCircle } from "lucide-react";

// Step components
import Step1IndustrySelection from "./steps/Step1IndustrySelection";
import Step2Parameters from "./steps/Step2Parameters";
import Step3Settings from "./steps/Step3Settings";
import Step4Preview from "./steps/Step4Preview";

// Define the form data structure
export type OnboardingFormData = {
  // Step 1
  industry: string;
  
  // Step 2
  parameters: {
    defaults: Record<string, any>;
    custom: string;
  };
  
  // Step 3
  settings: {
    currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
    units: "metric" | "imperial";
    rounding?: "nearest" | "up" | "down";
    timezone?: string;
    fileFormat?: "pdf" | "xlsx" | "csv";
  };
};

// Define the steps of the wizard
const STEPS = [
  { id: 1, title: "Industry" },
  { id: 2, title: "Parameters" },
  { id: 3, title: "Settings" },
  { id: 4, title: "Preview" },
];

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Initialize react-hook-form with default values
  const methods = useForm<OnboardingFormData>({
    defaultValues: {
      industry: "",
      parameters: {
        defaults: {},
        custom: "",
      },
      settings: {
        currency: "USD",
        units: "metric",
      },
    },
  });
  
  const { handleSubmit, watch } = methods;
  
  // Get current values for dynamic rendering
  const currentIndustry = watch("industry");
  
  // Handle navigation between steps
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Form submission handler
  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);
      
      // Simulate a brief loading state (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the form data to console
      console.log("Onboarding form data:", data);
      
      // In a real app, you would save this data to a backend
      // For now, we just redirect to the quote page for the selected industry
      router.push(`/quote/${data.industry}`);
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setIsSubmitting(false);
    }
  };
  
  // Render the step indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8 backdrop-blur-sm bg-slate-900/40 py-6 px-4 rounded-xl">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center space-y-3">
              <div 
                className={`
                  relative flex items-center justify-center w-12 h-12 rounded-full 
                  border-2 transition-all duration-300 shadow-lg
                  ${currentStep === step.id 
                    ? "border-blue-500 bg-blue-600/30 text-white shadow-blue-900/50" 
                    : currentStep > step.id 
                      ? "border-green-500 bg-green-600/20 text-green-400 shadow-green-900/30" 
                      : "border-slate-700 bg-slate-800/70 text-slate-500"
                  }
                `}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
                
                {/* Connector line between circles */}
                {step.id < STEPS.length && (
                  <div className={`
                    absolute left-full w-full h-0.5 -translate-y-1/2 top-1/2
                    ${currentStep > step.id 
                      ? "bg-green-500/40" 
                      : "bg-slate-700/70"
                    }
                  `}></div>
                )}
              </div>
              <span className={`text-sm font-medium ${
                currentStep === step.id 
                  ? "text-blue-400" 
                  : currentStep > step.id 
                    ? "text-green-400" 
                    : "text-slate-500"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render the current step's content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1IndustrySelection nextStep={nextStep} />;
      case 2:
        return <Step2Parameters 
          industry={currentIndustry} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />;
      case 3:
        return <Step3Settings 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />;
      case 4:
        return <Step4Preview 
          onSubmit={handleSubmit(onSubmit)}
          prevStep={prevStep}
          isSubmitting={isSubmitting}
        />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="bg-gradient-to-b from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl shadow-purple-900/20 p-6 md:p-8">
        {renderStepIndicator()}
        
        <div className="min-h-[450px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </FormProvider>
  );
} 