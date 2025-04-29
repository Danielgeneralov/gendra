"use client";

import { useState } from "react";
import { ScrollAnimation } from "./components/ScrollAnimation";
import { MotionButton } from "./components/MotionButton";
import { MotionCard } from "./components/MotionCard";
import { ParallaxHero } from "./components/ParallaxHero";
import { DemoModal } from "./components/DemoModal";
import { motion } from "framer-motion";

export default function Home() {
  // State for demo modal
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  // Animation variants for feature pillars
  const pillarVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax Effects */}
      <ParallaxHero />

      {/* How Gendra Works - 3-Step Process */}
      <section className="py-36 px-8 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-white mb-4">
              How Gendra Works
            </h2>
            <p className="text-xl text-slate-300 text-center mb-20 max-w-2xl mx-auto">
              Our AI-powered platform transforms manufacturing operations in three simple steps.
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <ScrollAnimation delay={0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Step 1: Submit Your Specs</h3>
                <p className="text-slate-300 leading-relaxed">
                  Enter your part details, quantity, and material requirements in our simple, guided form.
                </p>
              </div>
            </ScrollAnimation>

            {/* Step 2 */}
            <ScrollAnimation delay={0.2}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Step 2: Receive Instant Quote</h3>
                <p className="text-slate-300 leading-relaxed">
                  Our AI analyzes your requirements and delivers an accurate quote in seconds, not days.
                </p>
              </div>
            </ScrollAnimation>

            {/* Step 3 */}
            <ScrollAnimation delay={0.3}>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Step 3: Track Production</h3>
                <p className="text-slate-300 leading-relaxed">
                  Monitor your job through production with real-time updates and intelligent insights.
                </p>
              </div>
            </ScrollAnimation>
          </div>

          <ScrollAnimation delay={0.4}>
            <div className="mt-16 text-center">
              <MotionButton href="/quote" primary={true}>
                Start Your Quote
              </MotionButton>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Gendra Feature Pillars Section */}
      <section className="py-36 px-8 bg-gradient-to-b from-slate-900 to-slate-800 text-white border-t border-slate-700">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-white mb-4">
              The Gendra Advantage
            </h2>
            <p className="text-xl text-slate-300 text-center mb-20 max-w-2xl mx-auto">
              Our comprehensive platform delivers value across your entire operation.
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Quoting Intelligence */}
            <ScrollAnimation>
              <motion.div 
                className="bg-slate-800/70 p-8 rounded-xl shadow-lg border border-slate-700 h-full"
                variants={pillarVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="mb-6 w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Quoting Intelligence</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">AI-driven estimation based on historical data</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Instant price calculation across multiple materials</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Optimized profit margins based on capacity</span>
                  </li>
                </ul>
              </motion.div>
            </ScrollAnimation>

            {/* Pillar 2: Smart Scheduling */}
            <ScrollAnimation delay={0.1}>
              <motion.div 
                className="bg-slate-800/70 p-8 rounded-xl shadow-lg border border-slate-700 h-full"
                variants={pillarVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="mb-6 w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Scheduling</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Automatically adapts to real-time shop conditions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Optimizes machine utilization and job sequencing</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Reduces lead times through intelligent prioritization</span>
                  </li>
                </ul>
              </motion.div>
            </ScrollAnimation>

            {/* Pillar 3: Operational Insights */}
            <ScrollAnimation delay={0.2}>
              <motion.div 
                className="bg-slate-800/70 p-8 rounded-xl shadow-lg border border-slate-700 h-full"
                variants={pillarVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="mb-6 w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Operational Insights</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Real-time dashboards with actionable metrics</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Predictive analytics for maintenance and bottlenecks</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">Custom reports for continuous improvement</span>
                  </li>
                </ul>
              </motion.div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-36 px-8 bg-gradient-to-b from-slate-900 to-indigo-950 border-t border-slate-700">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                Ready to Transform Your Manufacturing Workflow?
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                Start quoting smarter with Gendra today.
              </p>
            </motion.div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.2}>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <MotionButton href="/quote" primary={true} className="px-10 py-4 text-lg">
                  Get Started
                </MotionButton>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <MotionButton 
                  onClick={() => setIsDemoModalOpen(true)} 
                  primary={false} 
                  className="px-10 py-4 text-lg"
                >
                  Book a Demo
                </MotionButton>
              </motion.div>
            </div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.3}>
            <p className="text-slate-400 mt-8 text-sm">
              No credit card required. Set up your account in minutes.
            </p>
          </ScrollAnimation>
        </div>
      </section>
      
      {/* Demo Modal */}
      <DemoModal 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}















