"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

// Ensure Lenis is only imported in client environment
const isClient = typeof window !== 'undefined';

// Dynamic import for Lenis
let Lenis: any = null;

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<any>(null);
  const [isLenisLoaded, setIsLenisLoaded] = useState(false);

  // Load Lenis dynamically only on client side
  useEffect(() => {
    if (!isClient) return;
    
    async function loadLenis() {
      try {
        const lenisModule = await import('lenis');
        Lenis = lenisModule.default;
        setIsLenisLoaded(true);
      } catch (error) {
        console.error("Failed to load Lenis:", error);
      }
    }
    
    loadLenis();
  }, []);

  // Initialize Lenis on component mount
  useEffect(() => {
    if (!isClient || !isLenisLoaded || !Lenis) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Store the instance
    lenisRef.current = lenis;
    // Make it available globally
    (window as any).__lenis = lenis;

    // Update scroll position on requestAnimationFrame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    // Sync with Framer Motion's scroll system
    if (isClient) {
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
      (window as any).__lenis = null;
    };
  }, [isLenisLoaded]);

  return <>{children}</>;
}

// Utility hook to access Lenis from any component
export function useLenis() {
  const lenisRef = useRef<any>(null);
  
  useEffect(() => {
    if (!isClient) return;
    
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
  if (isClient) {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(target, options);
    }
  }
} 