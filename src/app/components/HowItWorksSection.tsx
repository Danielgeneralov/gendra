"use client";

import { useRef } from "react";
import { ScrollAnimation } from "./ScrollAnimation";
import { MotionButton } from "./MotionButton";
import { motion, useInView } from "framer-motion";

export const HowItWorksSection = ({
  fileUploadRef,
  quoteRef,
  productionRef,
  stickyCTAObserverRef,
  isFileUploadInView,
  isQuoteInView,
  isProductionInView,
}: {
  fileUploadRef: React.RefObject<HTMLDivElement>;
  quoteRef: React.RefObject<HTMLDivElement>;
  productionRef: React.RefObject<HTMLDivElement>;
  stickyCTAObserverRef: React.RefObject<HTMLDivElement>;
  isFileUploadInView: boolean;
  isQuoteInView: boolean;
  isProductionInView: boolean;
}) => {
  const walkThroughRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="how-it-works"
      ref={walkThroughRef}
      className="py-36 px-8 bg-gradient-to-b from-[#0f0f1a] to-[#1c1b2a] text-white relative"
    >
      <div
        className="sticky-cta-observer absolute top-1/2 left-0 h-px w-full"
        ref={stickyCTAObserverRef}
      ></div>

      <div className="max-w-6xl mx-auto">
        <ScrollAnimation>
          <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-white mb-4">
            How Gendra Works
          </h2>
          <p className="text-xl text-slate-300 text-center mb-20 max-w-2xl mx-auto">
            Our AI-powered platform transforms manufacturing operations in
            three simple steps.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Step 1: CAD File Analysis Visualization */}
          <ScrollAnimation delay={0.1}>
            <div ref={fileUploadRef} className="flex flex-col items-center">
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isFileUploadInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-blue-600/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Step 1: AI Analyzes CAD Files
                </h3>
              </motion.div>

              <motion.div
                className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-lg p-6 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isFileUploadInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ boxShadow: "0 0 20px rgba(37, 99, 235, 0.2)" }}
              >
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-5 rounded-lg shadow-lg">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        CAD Analysis
                      </h4>
                      <p className="text-slate-400 text-sm">
                        File: bracket_assembly.step
                      </p>
                    </div>
                    <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-xs font-medium">
                      Analyzed
                    </div>
                  </div>

                  {/* CAD Visualization */}
                  <div className="h-36 bg-slate-900/80 border border-slate-700 rounded-md mb-4 overflow-hidden relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-slate-800"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="20"
                          y="20"
                          width="60"
                          height="60"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <rect
                          x="30"
                          y="40"
                          width="20"
                          height="30"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <rect
                          x="50"
                          y="50"
                          width="20"
                          height="20"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full"
                      animate={{
                        background: [
                          "radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.3) 0%, rgba(0, 0, 0, 0) 40%)",
                          "radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.3) 0%, rgba(0, 0, 0, 0) 40%)",
                          "radial-gradient(circle at 40% 70%, rgba(59, 130, 246, 0.3) 0%, rgba(0, 0, 0, 0) 40%)",
                          "radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.3) 0%, rgba(0, 0, 0, 0) 40%)",
                        ],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "loop",
                      }}
                    />
                  </div>

                  {/* Detected Features */}
                  <div className="space-y-3 mb-4">
                    <motion.div
                      className="flex justify-between items-center text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isFileUploadInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                        <span className="text-slate-300">
                          Material Detection
                        </span>
                      </div>
                      <span className="text-blue-400">Aluminum 6061</span>
                    </motion.div>

                    <motion.div
                      className="flex justify-between items-center text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isFileUploadInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                        <span className="text-slate-300">
                          Feature Recognition
                        </span>
                      </div>
                      <span className="text-green-400">18 Features</span>
                    </motion.div>

                    <motion.div
                      className="flex justify-between items-center text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isFileUploadInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.4, delay: 1.0 }}
                    >
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                        <span className="text-slate-300">
                          Manufacturing Method
                        </span>
                      </div>
                      <span className="text-purple-400">CNC Milling</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollAnimation>

          {/* Step 2: AI-Generated Quote Card */}
          <ScrollAnimation delay={0.2}>
            <div ref={quoteRef} className="flex flex-col items-center">
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isQuoteInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-blue-600/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Step 2: Receive Instant Quote
                </h3>
              </motion.div>

              <motion.div
                className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-lg p-6 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isQuoteInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                  />

                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-5 rounded-lg shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white">
                          Your Quote
                        </h4>
                        <p className="text-slate-400 text-sm">
                          Generated by AI in seconds
                        </p>
                      </div>
                      <div className="bg-slate-700/50 px-2 py-1 rounded-md">
                        <span className="text-xs text-slate-300">
                          Quote #GQ-1834
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <motion.div
                        className="text-3xl font-bold text-white mb-1 flex items-center"
                        initial={{ opacity: 0 }}
                        animate={
                          isQuoteInView ? { opacity: 1 } : { opacity: 0 }
                        }
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        $827.32
                        <motion.span
                          className="ml-2 text-green-400 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={
                            isQuoteInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -10 }
                          }
                          transition={{ duration: 0.3, delay: 0.9 }}
                        >
                          12% below market
                        </motion.span>
                      </motion.div>
                      <motion.p
                        className="text-slate-300"
                        initial={{ opacity: 0 }}
                        animate={
                          isQuoteInView ? { opacity: 1 } : { opacity: 0 }
                        }
                        transition={{ duration: 0.6, delay: 0.6 }}
                      >
                        Ready in 4 days
                      </motion.p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <motion.div
                        className="flex justify-between text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={
                          isQuoteInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 10 }
                        }
                        transition={{ duration: 0.4, delay: 1.0 }}
                      >
                        <span className="text-slate-400">
                          Material (Aluminum 6061)
                        </span>
                        <span className="text-white">$320.00</span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={
                          isQuoteInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 10 }
                        }
                        transition={{ duration: 0.4, delay: 1.2 }}
                      >
                        <span className="text-slate-400">
                          Machining (3-axis CNC)
                        </span>
                        <span className="text-white">$450.00</span>
                      </motion.div>
                      <motion.div
                        className="flex justify-between text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={
                          isQuoteInView
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 10 }
                        }
                        transition={{ duration: 0.4, delay: 1.4 }}
                      >
                        <span className="text-slate-400">
                          Finishing (Anodizing)
                        </span>
                        <span className="text-white">$57.32</span>
                      </motion.div>
                    </div>

                    <motion.div
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-center font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0 }}
                      animate={
                        isQuoteInView ? { opacity: 1 } : { opacity: 0 }
                      }
                      transition={{ duration: 0.3, delay: 1.6 }}
                    >
                      Accept Quote
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollAnimation>

          {/* Step 3: Production Timeline */}
          <ScrollAnimation delay={0.3}>
            <div ref={productionRef} className="flex flex-col items-center">
              <motion.div
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isProductionInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-blue-600/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Step 3: Track Production
                </h3>
              </motion.div>

              <motion.div
                className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-lg p-6 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isProductionInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)" }}
              >
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-5 rounded-lg shadow-lg">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white">
                        Production Timeline
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Real-time status updates
                      </p>
                    </div>
                    <div className="bg-green-600/20 text-green-400 px-2 py-1 rounded-md text-xs font-medium">
                      In Progress
                    </div>
                  </div>

                  {/* Timeline visualization */}
                  <div className="space-y-4 mb-6">
                    <motion.div
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={isProductionInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 z-10">
                          <svg
                            className="w-3 h-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-white text-sm font-medium">Order Received</span>
                            <span className="text-slate-400 text-xs">Oct 12</span>
                          </div>
                          <p className="text-slate-400 text-xs">Order #GND-2748 processed</p>
                        </div>
                      </div>
                      <div className="absolute top-5 left-2.5 w-0.5 h-12 bg-slate-700"></div>
                    </motion.div>

                    <motion.div
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={isProductionInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3 z-10">
                          <svg
                            className="w-3 h-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-white text-sm font-medium">Material Sourced</span>
                            <span className="text-slate-400 text-xs">Oct 13</span>
                          </div>
                          <p className="text-slate-400 text-xs">Aluminum 6061 in stock</p>
                        </div>
                      </div>
                      <div className="absolute top-5 left-2.5 w-0.5 h-12 bg-slate-700"></div>
                    </motion.div>

                    <motion.div
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={isProductionInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    >
                      <div className="flex items-center mb-2">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-3 z-10">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-white text-sm font-medium">Machining</span>
                            <span className="text-slate-400 text-xs">Oct 14-15</span>
                          </div>
                          <p className="text-slate-400 text-xs">CNC milling in progress (60%)</p>
                        </div>
                      </div>
                      <div className="absolute top-5 left-2.5 w-0.5 h-12 bg-slate-700"></div>
                    </motion.div>

                    <motion.div
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={isProductionInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 1.6 }}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center mr-3 z-10">
                          <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-slate-300 text-sm font-medium">Finishing</span>
                            <span className="text-slate-400 text-xs">Oct 16</span>
                          </div>
                          <p className="text-slate-400 text-xs">Anodizing scheduled</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs text-slate-400 mb-1">Production Progress</div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                        initial={{ width: "0%" }}
                        animate={isProductionInView ? { width: "60%" } : { width: "0%" }}
                        transition={{ duration: 1.2, delay: 1.8 }}
                      ></motion.div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Started: Oct 12</span>
                    <span>Delivery: Oct 17</span>
                  </div>
                </div>
              </motion.div>
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
  );
}; 