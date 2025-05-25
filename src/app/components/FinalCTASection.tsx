"use client";

import { motion } from "framer-motion";
import { ScrollAnimation } from "./ScrollAnimation";
import { MotionButton } from "./MotionButton";

export const FinalCTASection = () => {
  return (
    <section className="py-36 px-8 bg-gradient-to-b from-[#0f0f1a] to-[#1c1b2a] border-t border-slate-700">
      <div className="max-w-6xl mx-auto text-center">
        <ScrollAnimation>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Ready to Transform Your Manufacturing Workflow?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Start quoting smarter with Gendra today.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <MotionButton
                  href="/quote"
                  primary={true}
                  className="px-10 py-4 text-lg"
                >
                  Get Started
                </MotionButton>
              </motion.div>
            </div>
          </motion.div>
        </ScrollAnimation>

        {/* Logo Cloud */}
        <ScrollAnimation delay={0.2}>
          <div className="mt-24 mb-8">
            <p className="text-sm uppercase text-slate-400 font-medium tracking-wider mb-8">
              Trusted by industry leaders
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
              {/* Logo 1 */}
              <motion.div
                className="grayscale opacity-70 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-8 w-28 bg-slate-700/50 rounded-md flex items-center justify-center">
                  <svg
                    className="w-18 h-5 text-slate-400"
                    viewBox="0 0 100 30"
                    fill="currentColor"
                  >
                    <rect x="10" y="10" width="80" height="10" rx="2" />
                  </svg>
                </div>
              </motion.div>

              {/* Logo 2 */}
              <motion.div
                className="grayscale opacity-70 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-8 w-28 bg-slate-700/50 rounded-md flex items-center justify-center">
                  <svg
                    className="w-18 h-5 text-slate-400"
                    viewBox="0 0 100 30"
                    fill="currentColor"
                  >
                    <circle cx="20" cy="15" r="8" />
                    <rect x="35" y="7" width="50" height="16" rx="2" />
                  </svg>
                </div>
              </motion.div>

              {/* Logo 3 */}
              <motion.div
                className="grayscale opacity-70 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-8 w-28 bg-slate-700/50 rounded-md flex items-center justify-center">
                  <svg
                    className="w-18 h-5 text-slate-400"
                    viewBox="0 0 100 30"
                    fill="currentColor"
                  >
                    <polygon points="15,25 35,5 55,25" />
                    <rect x="60" y="5" width="20" height="20" rx="2" />
                  </svg>
                </div>
              </motion.div>

              {/* Logo 4 */}
              <motion.div
                className="grayscale opacity-70 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-8 w-28 bg-slate-700/50 rounded-md flex items-center justify-center">
                  <svg
                    className="w-18 h-5 text-slate-400"
                    viewBox="0 0 100 30"
                    fill="currentColor"
                  >
                    <circle cx="50" cy="15" r="12" />
                    <rect x="70" y="10" width="20" height="10" rx="2" />
                    <rect x="10" y="10" width="20" height="10" rx="2" />
                  </svg>
                </div>
              </motion.div>

              {/* Logo 5 */}
              <motion.div
                className="grayscale opacity-70 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-8 w-28 bg-slate-700/50 rounded-md flex items-center justify-center">
                  <svg
                    className="w-18 h-5 text-slate-400"
                    viewBox="0 0 100 30"
                    fill="currentColor"
                  >
                    <path d="M10,15 Q50,5 90,15 Q50,25 10,15" />
                  </svg>
                </div>
              </motion.div>

              {/* Logo 6 */}
              <motion.div
                className="grayscale opacity-70 hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="h-8 w-28 bg-slate-700/50 rounded-md flex items-center justify-center">
                  <svg
                    className="w-18 h-5 text-slate-400"
                    viewBox="0 0 100 30"
                    fill="currentColor"
                  >
                    <path d="M10,15 Q50,5 90,15 Q50,25 10,15" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.3}>
          <p className="text-slate-400 mt-8 text-sm">
            No credit card required. Set up your account in minutes.
          </p>
        </ScrollAnimation>
      </div>
    </section>
  );
}; 