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
};

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

  useEffect(() => {
    const fetchIndustryConfig = async () => {
      if (!industryId) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/v1/industries/${industryId}`);
        if (!res.ok) throw new Error(`Failed to fetch config: ${res.status}`);
        const data = await res.json();

        if (!Array.isArray(data.formFields)) {
          throw new Error("Invalid config: missing formFields array");
        }

        setConfig(data);

        const defaults: FormData = {};
        for (const field of data.formFields) {
          if (field.type === "number") {
            defaults[field.id] = field.min ?? 1;
          } else if (field.type === "select" && field.options?.length) {
            defaults[field.id] = field.options[0].value;
          } else {
            defaults[field.id] = "";
          }
        }

        setFormData(defaults);
      } catch (err) {
        console.error("Error loading config:", err);
        setError("Failed to load industry configuration. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustryConfig();
  }, [industryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    if (validationError) setValidationError(null);
  };

  const validateForm = (): boolean => {
    if (!config) return false;

    for (const field of config.formFields) {
      const value = formData[field.id];

      if (field.required && !value) {
        setValidationError(`Please complete the ${field.label} field`);
        return false;
      }

      if (
        field.type === "number" &&
        typeof field.min === "number" &&
        typeof value === "number" &&
        value < field.min
      ) {
        setValidationError(`${field.label} must be at least ${field.min}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData, industryId);
    } catch (err) {
      console.error("Form submission error:", err);
      setValidationError("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-[#050C1C] rounded w-full"></div>
        ))}
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className={`bg-red-900/30 border border-red-800/50 rounded-md p-4 text-red-200 ${className}`}>
        <p>{error || "Failed to load industry configuration."}</p>
      </div>
    );
  }

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
            <label htmlFor={field.id} className="block text-sm font-medium text-[#F0F4F8]">
              {field.label}
              {field.required && <span className="text-[#FFD700] ml-1">*</span>}
            </label>

            {field.type === "select" ? (
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id] ?? ""}
                onChange={handleChange}
                required={field.required}
                className="mt-1 block w-full rounded-md shadow-md px-4 py-2 bg-[#050C1C] text-[#F0F4F8] border border-[#0A1828] focus:ring-[#4A6FA6] focus:border-[#4A6FA6] hover:border-[#5A54A3]"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.id}
                name={field.id}
                value={formData[field.id] ?? ""}
                onChange={handleChange}
                min={field.min}
                max={field.max}
                placeholder={field.placeholder}
                required={field.required}
                className="mt-1 block w-full rounded-md shadow-md px-4 py-2 bg-[#050C1C] text-[#F0F4F8] border border-[#0A1828] focus:ring-[#4A6FA6] focus:border-[#4A6FA6] hover:border-[#5A54A3]"
              />
            )}
          </div>
        </ScrollAnimation>
      ))}

      <div className="mt-8">
        <MotionButton type="submit" primary disabled={isSubmitting} className="w-full py-3 px-5">
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" className="opacity-75" />
              </svg>
              Processing...
            </div>
          ) : (
            "Submit"
          )}
        </MotionButton>
      </div>
    </form>
  );
};
