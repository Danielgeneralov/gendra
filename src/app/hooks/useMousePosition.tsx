"use client";

import { useState, useEffect } from "react";

type MousePosition = {
  x: number;
  y: number;
};

// Flag for client-side execution
const isClient = typeof window !== "undefined";

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    if (!isClient) return;
    
    // Only track mouse position on desktop to avoid mobile battery drain
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    
    // Check initially

    checkIfDesktop();
    
    // Update on resize
    window.addEventListener("resize", checkIfDesktop);
    
    return () => {
      window.removeEventListener("resize", checkIfDesktop);
    };
  }, []);
  
  useEffect(() => {
    if (!isClient || !isDesktop) return;
    
    let animationFrameId: number | null = null;
    let lastMouseX = 0;
    let lastMouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      
      // Use requestAnimationFrame for performance optimization
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(() => {
          setMousePosition({
            x: lastMouseX / window.innerWidth - 0.5, // Normalize to -0.5 to 0.5
            y: lastMouseY / window.innerHeight - 0.5, // Normalize to -0.5 to 0.5
          });
          animationFrameId = null;
        });
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDesktop]);
  
  return mousePosition;
} 