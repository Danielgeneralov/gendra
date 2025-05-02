"use client";

import { useState, useEffect } from "react";
import { ScrollAnimation } from "./ScrollAnimation";
import { MotionButton } from "./MotionButton";
import { motion } from "framer-motion";

type FormField = {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "date";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required: boolean;
  min?: number;
  max?: number;
};

type IndustryConfig = {
  id: string;
  name: string;
  formFields: FormField[];
  materials?: { value: string; label: string }[];
  complexityLevels?: { value: string; label: string; factor: number }[];
};

// Define FormData interface with more specific field handling
interface FormData {
  [key: string]: string | number;
}

type IndustryFormProps = {
  industryId: string;
  onSubmit: (formData: FormData, industry: string) => Promise<void>;
  className?: string;
};

export const IndustryForm = ({
  industryId,
  onSubmit,
  className = "",
}: IndustryFormProps) => {
  const [config, setConfig] = useState<IndustryConfig | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch industry configuration when industryId changes
  useEffect(() => {
    const fetchIndustryConfig = async () => {
      if (!industryId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/v1/industries/${industryId}`);
        if (!response.ok) {
          throw new Error(`Error fetching industry config: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate that data has required properties
        if (!data || !data.formFields || !Array.isArray(data.formFields)) {
          throw new Error('Invalid industry configuration: missing formFields array');
        }
        
        setConfig(data);
        
        // Initialize form data with defaults
        const initialData: FormData = {};
        data.formFields.forEach((field: FormField) => {
          if (field.type === 'number') {
            initialData[field.id] = field.min || 1;
          } else if (field.type === 'select' && field.options && field.options.length > 0) {
            initialData[field.id] = field.options[0].value;
          } else {
            initialData[field.id] = '';
          }
        });
        
        setFormData(initialData);
      } catch (err) {
        console.error(`Failed to fetch industry config for ${industryId}:`, err);
        setError("Failed to load industry configuration. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIndustryConfig();
  }, [industryId]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    if (!config) return false;
    
    for (const field of config.formFields) {
      if (field.required && !formData[field.id]) {
        setValidationError(`Please complete the ${field.label} field`);
        return false;
      }
      
      if (
        field.type === "number" &&
        typeof field.min === "number" &&
        typeof formData[field.id] === "number" &&
        (formData[field.id] as number) < field.min
      ) {
        setValidationError(`${field.label} must be at least ${field.min}`);
        return false;
      }
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData, industryId);
    } catch (err) {
      console.error("Error submitting form:", err);
      setValidationError("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        <div className="h-6 bg-[#050C1C] rounded w-1/3"></div>
        <div className="h-10 bg-[#050C1C] rounded w-full"></div>
        <div className="h-10 bg-[#050C1C] rounded w-full"></div>
        <div className="h-10 bg-[#050C1C] rounded w-full"></div>
        <div className="h-10 bg-[#050C1C] rounded w-2/3"></div>
      </div>
    );
  }

  // Render error state
  if (error || !config) {
    return (
      <div className={`bg-red-900/30 border border-red-800/50 rounded-md p-4 text-red-200 ${className}`}>
        <p>{error || "Failed to load industry configuration."}</p>
      </div>
    );
  }

  // Render form
  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {validationError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-md bg-red-900/30 border border-red-800/50 text-red-200"
        >
          <p className="text-sm font-medium">{validationError}</p>
        </motion.div>
      )}
      
      {config.formFields.map((field, index) => (
        <ScrollAnimation key={field.id} delay={index * 0.1}>
          <div>
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-[#F0F4F8]"
            >
              {field.label}
              {field.required && <span className="text-[#FFD700] ml-1">*</span>}
            </label>
            
            {field.type === "select" ? (
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id] || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-md px-4 py-2 bg-[#050C1C] text-[#F0F4F8] focus:ring-2 focus:ring-[#4A6FA6] focus:outline-none transition duration-300 ease-in-out border border-[#0A1828] focus:border-[#4A6FA6] hover:border-[#5A54A3]"
                required={field.required}
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "number" ? (
              <input
                type="number"
                id={field.id}
                name={field.id}
                value={formData[field.id] || ""}
                onChange={handleChange}
                min={field.min}
                max={field.max}
                placeholder={field.placeholder}
                className="mt-1 block w-full rounded-md shadow-md px-4 py-2 bg-[#050C1C] text-[#F0F4F8] focus:ring-2 focus:ring-[#4A6FA6] focus:outline-none transition duration-300 ease-in-out border border-[#0A1828] focus:border-[#4A6FA6] hover:border-[#5A54A3]"
                required={field.required}
              />
            ) : field.type === "date" ? (
              <input
                type="date"
                id={field.id}
                name={field.id}
                value={formData[field.id] || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md shadow-md px-4 py-2 bg-[#050C1C] text-[#F0F4F8] focus:ring-2 focus:ring-[#4A6FA6] focus:outline-none transition duration-300 ease-in-out border border-[#0A1828] focus:border-[#4A6FA6] hover:border-[#5A54A3]"
                required={field.required}
              />
            ) : (
              <input
                type="text"
                id={field.id}
                name={field.id}
                value={formData[field.id] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="mt-1 block w-full rounded-md shadow-md px-4 py-2 bg-[#050C1C] text-[#F0F4F8] focus:ring-2 focus:ring-[#4A6FA6] focus:outline-none transition duration-300 ease-in-out border border-[#0A1828] focus:border-[#4A6FA6] hover:border-[#5A54A3]"
                required={field.required}
              />
            )}
          </div>
        </ScrollAnimation>
      ))}
      
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-5 bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#2563EB] hover:to-[#4F46E5] text-white font-medium rounded-md shadow-lg transform transition duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
}; 