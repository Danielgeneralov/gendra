"use client";

import { motion } from "framer-motion";
import { ScrollAnimation } from "./ScrollAnimation";

export const IndustryPortalSection = () => {
  return (
    <section className="py-36 px-8 bg-gradient-to-b from-[#0f0f1a] to-[#1c1b2a] border-t border-slate-700">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation>
          <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-white mb-4">
            Built for You
          </h2>
          <p className="text-xl text-slate-300 text-center mb-12 max-w-2xl mx-auto">
            Gendra adapts to your specific manufacturing needs with customized
            portals.
          </p>
        </ScrollAnimation>

        <div className="space-y-8">
          {/* Industry Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 rounded-full bg-slate-800 border border-slate-700 shadow-inner">
              {["CNC Machining", "Injection Molding", "Sheet Metal"].map(
                (industry, index) => (
                  <div
                    key={index}
                    className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      index === 0
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {index === 0 && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-blue-600"
                        layoutId="industryTabHighlight"
                        transition={{
                          duration: 0.3,
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{industry}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Static Industry Portal Mock */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-8 overflow-hidden shadow-lg">
            <div className="flex items-center border-b border-slate-700 pb-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4">
                <svg
                  className="w-5 h-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">
                CNC Machining Portal
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Material Type Card */}
              <motion.div
                className="bg-slate-800/80 border border-slate-700 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="text-sm font-medium text-slate-300 mb-2">
                  Material Options
                </h4>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md">
                    Aluminum 6061
                  </div>
                  <div className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                    Aluminum 7075
                  </div>
                  <div className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                    Steel 304
                  </div>
                  <div className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                    Titanium
                  </div>
                </div>
              </motion.div>

              {/* Surface Finish Card */}
              <motion.div
                className="bg-slate-800/80 border border-slate-700 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="text-sm font-medium text-slate-300 mb-2">
                  Surface Finishes
                </h4>
                <div className="flex flex-wrap gap-2">
                  <div className="px-2 py-1 bg-green-600 text-white text-xs rounded-md">
                    Anodized Type II
                  </div>
                  <div className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                    As Machined
                  </div>
                  <div className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                    Bead Blasted
                  </div>
                  <div className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                    Hard Anodized
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Machine Preview */}
            <div className="relative rounded-lg bg-slate-800/40 border border-slate-700 h-48 mb-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/10"></div>

              <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>

              <div className="absolute top-3 right-3 px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded">
                Preview
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-slate-600 uppercase tracking-wider text-xs font-medium">
                  CAD Visualization
                </div>
              </div>

              <motion.div
                className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-slate-400"
                animate={{ opacity: [0, 1] }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                AI Processing
              </motion.div>

              <motion.div
                className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent"
                animate={{ opacity: [0, 0.4, 0], x: [0, 100, 200] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </div>

            {/* Manufacturing Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-800/40 border border-slate-700 rounded-md p-3">
                <h5 className="text-xs text-slate-400 mb-1">
                  Manufacturing Time
                </h5>
                <p className="text-white font-medium">4-6 Days</p>
              </div>
              <div className="bg-slate-800/40 border border-slate-700 rounded-md p-3">
                <h5 className="text-xs text-slate-400 mb-1">Technology</h5>
                <p className="text-white font-medium">3-Axis Milling</p>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Quote
              </motion.button>
              <motion.button
                className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Design Support
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 