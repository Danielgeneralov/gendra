"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMousePosition } from "../hooks/useMousePosition";
import { ScrollAnimation } from "./ScrollAnimation";
import { MotionButton } from "./MotionButton";
import { DemoModal } from "./DemoModal";

export function ParallaxHero() {
  // State for modal
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  // Mouse-based parallax
  const mousePosition = useMousePosition();
  
  // Scroll-based parallax
  const { scrollY } = useScroll();
  const headingY = useTransform(scrollY, [0, 300], [0, -20]);  
  const headingScale = useTransform(scrollY, [0, 300], [1, 0.98]);
  
  // Calculate background parallax position (± 10px max)
  const backgroundX = mousePosition.x * 10;
  const backgroundY = mousePosition.y * 10;
  
  return (
    <>
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative px-8 md:px-12 py-32 bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-950 overflow-hidden">
        {/* Parallax background elements */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          style={{ 
            x: backgroundX,
            y: backgroundY,
            transition: "transform 0.2s ease-out" 
          }}
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
          
          {/* Additional parallax elements with varying depths */}
          <motion.div 
            className="absolute top-1/4 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
            style={{ 
              x: backgroundX * 1.5, 
              y: backgroundY * 1.5,
              transition: "transform 0.2s ease-out" 
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-2/3 left-2/3 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"
            style={{ 
              x: backgroundX * 2, 
              y: backgroundY * 2,
              transition: "transform 0.2s ease-out" 
            }}
          ></motion.div>
        </motion.div>
        
        <div className="w-full text-center relative z-10">
          <motion.div style={{ y: headingY, scale: headingScale }}>
            <ScrollAnimation delay={0.1}>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                Smarter Quotes. Faster Manufacturing. <span className="text-blue-400">Powered by Gendra AI.</span>
              </h1>
            </ScrollAnimation>
          </motion.div>
          
          <ScrollAnimation delay={0.2}>
            <p className="text-xl md:text-2xl text-slate-100 mx-auto mb-12 max-w-3xl leading-relaxed">
              Instant quoting, intelligent scheduling, and actionable insights — all in one AI-driven platform.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.3}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <MotionButton 
                href="/quote" 
                primary={true}
              >
                Get a Quote
              </MotionButton>
              <MotionButton 
                onClick={() => setIsDemoModalOpen(true)} 
                primary={false}
              >
                Book a Demo
              </MotionButton>
            </div>
          </ScrollAnimation>
          
          {/* Trust badges */}
          <ScrollAnimation delay={0.4}>
            <div className="mt-20 flex flex-col items-center">
              <p className="text-sm uppercase tracking-wider text-slate-100 mb-4">Trusted by forward-thinking manufacturers</p>
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                <div className="h-6 w-24 bg-white/10 rounded"></div>
                <div className="h-6 w-24 bg-white/10 rounded"></div>
                <div className="h-6 w-24 bg-white/10 rounded"></div>
                <div className="h-6 w-24 bg-white/10 rounded"></div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      
      {/* Demo Modal */}
      <DemoModal 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </>
  );
} 