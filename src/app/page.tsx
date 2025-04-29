"use client";

import { ScrollAnimation } from "./components/ScrollAnimation";
import { MotionButton } from "./components/MotionButton";
import { MotionCard } from "./components/MotionCard";
import { ParallaxHero } from "./components/ParallaxHero";
import { motion } from "framer-motion";

export default function Home() {
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

      {/* Trust Signals Strip */}
      <section className="py-16 px-8 bg-slate-900 border-t border-slate-700">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation>
            <div className="flex flex-col items-center">
              <p className="text-lg font-medium text-slate-200 mb-8">Trusted by manufacturers worldwide</p>
              
              <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
                {/* Placeholder logos with subtle industrial styling */}
                <div className="w-32 h-10 bg-white/5 rounded-md flex items-center justify-center border border-slate-700">
                  <div className="text-slate-500 text-xs">LOGO</div>
                </div>
                <div className="w-32 h-10 bg-white/5 rounded-md flex items-center justify-center border border-slate-700">
                  <div className="text-slate-500 text-xs">LOGO</div>
                </div>
                <div className="w-32 h-10 bg-white/5 rounded-md flex items-center justify-center border border-slate-700">
                  <div className="text-slate-500 text-xs">LOGO</div>
                </div>
                <div className="w-32 h-10 bg-white/5 rounded-md flex items-center justify-center border border-slate-700">
                  <div className="text-slate-500 text-xs">LOGO</div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Feature Tiles Section */}
      <section className="py-36 px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-white mb-6">
              The Complete Factory Operating System
            </h2>
            <p className="text-xl text-slate-300 text-center mb-16 max-w-2xl mx-auto">
              One platform to transform every aspect of your manufacturing workflow.
            </p>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation delay={0.1}>
              <MotionCard
                variant="feature"
                icon={
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 16.5m14.8-1.2c.7.669 1.2 1.535 1.2 2.5s-.5 1.831-1.2 2.5c-.7.669-1.667 1.2-2.5 1.2H6.7c-.833 0-1.8-.531-2.5-1.2-.7-.669-1.2-1.535-1.2-2.5s.5-1.831 1.2-2.5c.7-.669 1.667-1.2 2.5-1.2h9.6c.833 0 1.8.531 2.5 1.2z" />
                  </svg>
                }
                title="Intelligent Quoting"
                description="Analyze custom job requirements and generate accurate quotes in minutes with AI that learns from your production data."
              />
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.2}>
              <MotionCard
                variant="feature"
                icon={
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                  </svg>
                }
                title="Dynamic Scheduling"
                description="Optimize your shop floor with scheduling that adapts to changing conditions, constraints, and priorities in real-time."
              />
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.3}>
              <MotionCard
                variant="feature"
                icon={
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                }
                title="Real-Time Intelligence"
                description="Turn your data into actions with continuous monitoring and AI decision support to optimize operations across your facility."
              />
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MotionButton href="/quote" primary={true} className="px-10 py-4 text-lg">
                Get Started
              </MotionButton>
            </motion.div>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.3}>
            <p className="text-slate-400 mt-8 text-sm">
              No credit card required. Set up your account in minutes.
            </p>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}















