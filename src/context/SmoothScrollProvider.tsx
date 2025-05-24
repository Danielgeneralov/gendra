"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useScroll, useTransform } from "framer-motion";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis on component mount
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Store the instance
    lenisRef.current = lenis;

    // Update scroll position on requestAnimationFrame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // Sync with Framer Motion's scroll system
    if (typeof window !== "undefined") {
      // Notify Framer Motion about scroll updates
      lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        // Dispatch a custom scroll event that framer can listen to
        window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: { scroll } }));
      });
    }

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

// Utility hook to access Lenis from any component
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  
  useEffect(() => {
    // Get the Lenis instance from window
    const getLenis = () => {
      // Find the Lenis instance on window
      const instance = (window as any).__lenis;
      if (instance) {
        lenisRef.current = instance;
      }
    };
    
    getLenis();
    
    // Listen for Lenis initialization
    window.addEventListener('lenis-initialized', getLenis);
    
    return () => {
      window.removeEventListener('lenis-initialized', getLenis);
    };
  }, []);
  
  return lenisRef.current;
}

// Custom scrollTo utility that works with Lenis
export function scrollTo(target: string | HTMLElement | number, options?: { offset?: number, immediate?: boolean, duration?: number }) {
  if (typeof window !== 'undefined') {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  }
} 