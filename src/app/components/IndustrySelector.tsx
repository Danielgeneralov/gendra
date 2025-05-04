"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type Industry = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

type IndustrySelectorProps = {
  displayMode?: "dropdown" | "tabs";
  onIndustryChange?: (industry: string) => void;
  className?: string;
};

export const IndustrySelector = ({
  displayMode = "tabs",
  onIndustryChange,
  className = "",
}: IndustrySelectorProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [industries, setIndustries] = useState<Industry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // ✅ Memoized helper to update URL params
  const updateURLParams = useCallback((industryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("industry", industryId);
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Fetch industries from API
  useEffect(() => {
    const fetchIndustries = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/v1/industries");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();

        setIndustries(data.industries);

        const industryParam = searchParams.get("industry");
        if (industryParam && data.industries.some((ind: Industry) => ind.id === industryParam)) {
          setSelectedIndustry(industryParam);
        } else if (data.industries.length > 0) {
          const defaultId = data.industries[0].id;
          setSelectedIndustry(defaultId);
          updateURLParams(defaultId);
        }
      } catch (err) {
        console.error("Failed to fetch industries:", err);
        setError("Failed to load industries. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndustries();
  }, [searchParams, updateURLParams]);

  const handleIndustryChange = (industryId: string) => {
    setSelectedIndustry(industryId);
    updateURLParams(industryId);
    onIndustryChange?.(industryId);
  };

  const selectedIndustryObj = industries.find(ind => ind.id === selectedIndustry);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-[#0A1828]/50 rounded-md p-4 ${className}`}>
        <div className="h-8 bg-[#050C1C] rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-[#050C1C] rounded w-2/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-900/30 border border-red-800/50 rounded-md p-4 text-red-200 ${className}`}>
        <p>{error}</p>
      </div>
    );
  }

  if (displayMode === "dropdown") {
    return (
      <div className={`space-y-2 ${className}`}>
        <label htmlFor="industry-select" className="block text-sm font-medium text-[#F0F4F8]">
          Select Industry
        </label>
        <select
          id="industry-select"
          value={selectedIndustry}
          onChange={(e) => handleIndustryChange(e.target.value)}
          className="w-full rounded-md border-[#0A1828] bg-[#050C1C]/80 text-[#F0F4F8] shadow-md focus:border-[#FFD700] focus:ring-[#FFD700] py-2 px-3"
        >
          {industries.map((industry) => (
            <option key={industry.id} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>

        {selectedIndustryObj && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndustry}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-2 p-3 bg-[#0A1828]/50 border border-[#050C1C] rounded-md text-sm text-[#CBD5E1]"
            >
              <p>{selectedIndustryObj.description}</p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="border-b border-[#050C1C]/80">
        <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Industry Selection">
          {industries.map((industry) => {
            const isActive = selectedIndustry === industry.id;
            return (
              <button
                key={industry.id}
                onClick={() => handleIndustryChange(industry.id)}
                className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm flex items-center transition-all duration-300 ${
                  isActive
                    ? "border-[#FFD700] text-[#E6C300]"
                    : "border-transparent text-[#CBD5E1] hover:text-[#F0F4F8] hover:border-[#4A6FA6]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`mr-2 ${isActive ? "text-[#E6C300]" : "text-[#4A6FA6]"}`}
                  dangerouslySetInnerHTML={{ __html: industry.icon }}
                />
                {industry.name}
              </button>
            );
          })}
        </nav>
      </div>

      {selectedIndustryObj && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndustry}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="py-4 text-sm text-[#CBD5E1]"
          >
            <p>{selectedIndustryObj.description}</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
