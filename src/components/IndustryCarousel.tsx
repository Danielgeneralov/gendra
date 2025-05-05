"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useRouter } from "next/navigation";

export type Industry = {
  id: string;
  name: string;
  description: string;
  icon: string; // Inline SVG path as string
};

interface IndustryCarouselProps {
  industries: Industry[];
}

export default function IndustryCarousel({ industries }: IndustryCarouselProps) {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [isPaused, setIsPaused] = useState(false);
  const [carouselWidth, setCarouselWidth] = useState(0);
  
  // Handle navigation when clicking on an industry
  const handleIndustryClick = (industryId: string) => {
    router.push(`/quote/${industryId}`);
  };
  
  // Calculate carousel dimensions on mount and resize
  useEffect(() => {
    const updateCarouselWidth = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };

    updateCarouselWidth();
    window.addEventListener("resize", updateCarouselWidth);
    
    return () => {
      window.removeEventListener("resize", updateCarouselWidth);
    };
  }, [industries]);
  
  // Control the animation based on pause state
  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: -carouselWidth,
        transition: {
          duration: 25,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    }
  }, [isPaused, carouselWidth, controls]);
  
  return (
    <div className="w-full overflow-hidden relative py-8">
      <div 
        className="w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          ref={carouselRef}
          className="flex gap-6"
          animate={controls}
          initial={{ x: 0 }}
        >
          {/* Duplicate items for seamless looping */}
          {[...industries, ...industries].map((industry, index) => (
            <motion.div
              key={`${industry.id}-${index}`}
              className="flex-shrink-0 w-64"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => handleIndustryClick(industry.id)}
                className="w-full h-full bg-[#0A1828] hover:bg-[#1E293B] p-6 rounded-xl border border-[#24334A] transition-all duration-300 flex flex-col items-center text-center"
                aria-label={industry.name}
              >
                <div className="w-16 h-16 bg-[#1E293B] rounded-full flex items-center justify-center mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-[#4A6FA6]" 
                    viewBox="0 0 16 16" 
                    fill="currentColor"
                    dangerouslySetInnerHTML={{ __html: `<path d="${industry.icon}" />` }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#F0F4F8] mb-2">{industry.name}</h3>
                <p className="text-sm text-[#94A3B8]">{industry.description}</p>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 