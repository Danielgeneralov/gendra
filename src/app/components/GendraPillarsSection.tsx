"use client";

import { motion } from "framer-motion";
import { ScrollAnimation } from "./ScrollAnimation";

export const GendraPillarsSection = () => {
  return (
    <section className="py-36 px-8 bg-gradient-to-b from-[#0f0f1a] to-[#1c1b2a] border-t border-slate-700 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation>
          <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-white mb-4">
            The Gendra Advantage
          </h2>
          <p className="text-xl text-slate-300 text-center mb-20 max-w-2xl mx-auto">
            Our comprehensive platform delivers value across your entire
            operation.
          </p>
        </ScrollAnimation>

        {/* Feature showcase with 3D perspective */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-16">
            {/* Quoting Intelligence Feature */}
            <ScrollAnimation>
              <div className="feature-showcase">
                <div className="flex flex-col lg:flex-row items-start gap-8">
                  <div className="w-full lg:w-2/5 pt-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="inline-flex items-center bg-blue-900/20 px-4 py-2 rounded-full mb-4">
                        <div className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center mr-2">
                          <svg
                            className="w-3 h-3 text-blue-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-blue-400 text-sm font-medium">
                          Quoting Intelligence
                        </span>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                        Smart pricing that adapts to your needs
                      </h3>
                      <p className="text-slate-300 text-lg mb-6">
                        Our AI-powered quoting system analyzes material costs,
                        quantities, and manufacturing complexity to provide
                        the most competitive quotes in seconds.
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Volume-based discounts",
                          "Material-specific pricing",
                          "Complexity analysis",
                        ].map((feature, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-center text-slate-300"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2 + idx * 0.1,
                            }}
                          >
                            <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                              <svg
                                className="w-3 h-3 text-blue-400"
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
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  <div className="w-full lg:w-3/5">
                    <motion.div
                      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden"
                      style={{ perspective: "1000px" }}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-50"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.5 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                      />

                      <motion.div
                        className="p-8 relative z-10"
                        whileHover={{
                          rotateX: 2,
                          rotateY: 2,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-xl font-semibold text-white">
                              Pricing Engine
                            </h4>
                            <p className="text-slate-400 text-sm">
                              Advanced Quote System
                            </p>
                          </div>
                          <div className="inline-flex px-3 py-1 bg-blue-900/30 rounded-full text-blue-400 text-xs">
                            <motion.div
                              animate={{
                                opacity: [0.5, 1, 0.5],
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                              }}
                            >
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mr-1.5 animate-pulse"></div>
                                Live System
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        <motion.div
                          className="rounded-lg bg-slate-800/70 border border-slate-700 p-4 mb-6"
                          initial={{ rotateX: 10 }}
                          whileHover={{ rotateX: 0, scale: 1.01 }}
                          transition={{ duration: 0.4 }}
                        >
                          <p className="text-sm text-slate-300 mb-2 font-medium">
                            Smart pricing rules
                          </p>
                          <div className="font-mono text-xs bg-slate-900/70 text-slate-300 p-3 rounded border border-slate-700 mb-2">
                            <div>
                              <span className="text-purple-400">
                                function
                              </span>{" "}
                              <span className="text-blue-400">
                                calculatePrice
                              </span>
                              (material, quantity, complexity) {"{"}
                            </div>
                            <div className="pl-4">
                              <span className="text-purple-400">const</span>{" "}
                              basePrice = getMaterialCost(material);
                            </div>
                            <div className="pl-4">
                              <span className="text-purple-400">let</span>{" "}
                              discount = 1.0;
                            </div>
                            <div className="pl-4">
                              <span className="text-blue-400">if</span>{" "}
                              (quantity {">"} 50) discount -= 0.12;
                            </div>
                            <div className="pl-4">
                              <span className="text-blue-400">return</span>{" "}
                              basePrice * quantity * complexity * discount;
                            </div>
                            <div>{"}"}</div>
                          </div>
                        </motion.div>

                        <motion.div
                          className="rounded-lg bg-slate-800/70 border border-slate-700 p-4 relative"
                          initial={{ rotateX: 5, rotateY: 5 }}
                          whileHover={{ rotateX: 0, rotateY: 0, scale: 1.02 }}
                          transition={{ duration: 0.4 }}
                        >
                          <p className="text-sm text-slate-300 mb-3 font-medium">
                            Live pricing example
                          </p>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                                <span className="text-slate-300 text-sm">
                                  Aluminum Bracket (x75)
                                </span>
                              </div>
                              <motion.span
                                className="text-white text-sm font-medium"
                                animate={{
                                  opacity: [1, 0.7, 1],
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                }}
                              >
                                $2,970.00
                              </motion.span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                                <span className="text-slate-300 text-sm">
                                  Steel Flange (x120)
                                </span>
                              </div>
                              <motion.span
                                className="text-white text-sm font-medium"
                                animate={{
                                  opacity: [1, 0.7, 1],
                                }}
                                transition={{
                                  duration: 4,
                                  delay: 1,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                }}
                              >
                                $5,140.00
                              </motion.span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                                <span className="text-slate-300 text-sm">
                                  Titanium Housing (x35)
                                </span>
                              </div>
                              <motion.span
                                className="text-white text-sm font-medium"
                                animate={{
                                  opacity: [1, 0.7, 1],
                                }}
                                transition={{
                                  duration: 4,
                                  delay: 2,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                }}
                              >
                                $8,750.00
                              </motion.span>
                            </div>
                          </div>

                          <motion.div
                            className="absolute -bottom-1 left-0 right-0 h-8 bg-gradient-to-t from-green-500/20 to-transparent"
                            animate={{
                              opacity: [0, 0.5, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: "loop",
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Smart Scheduling Feature */}
            <ScrollAnimation delay={0.2}>
              <div className="feature-showcase">
                <div className="flex flex-col-reverse lg:flex-row items-start gap-8">
                  <div className="w-full lg:w-3/5">
                    <motion.div
                      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden"
                      style={{ perspective: "1000px" }}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-50"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.5 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                      />

                      <motion.div
                        className="p-8 relative z-10"
                        whileHover={{
                          rotateX: 2,
                          rotateY: 2,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h4 className="text-xl font-semibold text-white">
                              Production Scheduler
                            </h4>
                            <p className="text-slate-400 text-sm">
                              Intelligent Planning System
                            </p>
                          </div>
                          <div className="inline-flex px-3 py-1 bg-green-900/30 rounded-full text-green-400 text-xs">
                            <motion.div
                              animate={{
                                opacity: [0.5, 1, 0.5],
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                              }}
                            >
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></div>
                                Optimizing
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Calendar View */}
                        <motion.div
                          className="rounded-lg bg-slate-800/70 border border-slate-700 p-4 mb-6"
                          initial={{ rotateX: 10 }}
                          whileHover={{ rotateX: 0, scale: 1.01 }}
                          transition={{ duration: 0.4 }}
                        >
                          <p className="text-sm text-slate-300 mb-3 font-medium">
                            Production Calendar
                          </p>
                          
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                              <div key={i} className="text-xs text-slate-400 text-center py-1">
                                {day}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: 14 }).map((_, i) => {
                              // Generate different styles for calendar days
                              const styles = [
                                "bg-slate-700/50 text-slate-300", // normal day
                                "bg-blue-900/30 text-blue-300 border border-blue-700/50", // job type 1
                                "bg-green-900/30 text-green-300 border border-green-700/50", // job type 2
                                "bg-purple-900/30 text-purple-300 border border-purple-700/50" // job type 3
                              ];
                              
                              // Determine which days have scheduled jobs
                              const scheduledDays = [1, 2, 3, 4, 8, 9, 10]; 
                              const styleIndex = scheduledDays.includes(i) 
                                ? (i % 3) + 1 // Use one of the job type styles
                                : 0; // Use normal day style
                              
                              return (
                                <motion.div
                                  key={i}
                                  className={`h-10 rounded flex items-center justify-center text-xs ${styles[styleIndex]}`}
                                  whileHover={{ scale: 1.05 }}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                                >
                                  {i + 1}
                                  {scheduledDays.includes(i) && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-current absolute bottom-1"></div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>

                        {/* Optimization Stats */}
                        <motion.div
                          className="rounded-lg bg-slate-800/70 border border-slate-700 p-4 mb-4"
                          initial={{ rotateX: 5 }}
                          whileHover={{ rotateX: 0, scale: 1.01 }}
                          transition={{ duration: 0.4 }}
                        >
                          <p className="text-sm text-slate-300 mb-3 font-medium">
                            Machine Utilization
                          </p>

                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-400">CNC Mill #1</span>
                                <span className="text-xs text-green-400">92%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-green-500"
                                  initial={{ width: "0%" }}
                                  whileInView={{ width: "92%" }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.2 }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-400">CNC Mill #2</span>
                                <span className="text-xs text-blue-400">76%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-blue-500"
                                  initial={{ width: "0%" }}
                                  whileInView={{ width: "76%" }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.4 }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-400">Laser Cutter</span>
                                <span className="text-xs text-purple-400">84%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-purple-500"
                                  initial={{ width: "0%" }}
                                  whileInView={{ width: "84%" }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: 0.6 }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Optimization Metrics */}
                        <div className="grid grid-cols-2 gap-3">
                          <motion.div
                            className="bg-slate-800/40 rounded-lg border border-slate-700 p-3"
                            whileHover={{ scale: 1.03 }}
                          >
                            <div className="text-xs text-slate-400 mb-1">Lead Time Reduction</div>
                            <div className="text-green-400 font-semibold flex items-center">
                              <span className="text-lg">28%</span>
                              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </motion.div>

                          <motion.div
                            className="bg-slate-800/40 rounded-lg border border-slate-700 p-3"
                            whileHover={{ scale: 1.03 }}
                          >
                            <div className="text-xs text-slate-400 mb-1">Conflict Resolution</div>
                            <div className="text-blue-400 font-semibold flex items-center">
                              <span className="text-lg">12</span>
                              <span className="text-xs ml-1">issues fixed</span>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="w-full lg:w-2/5 pt-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="inline-flex items-center bg-green-900/20 px-4 py-2 rounded-full mb-4">
                        <div className="w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center mr-2">
                          <svg
                            className="w-3 h-3 text-green-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-green-400 text-sm font-medium">
                          Smart Scheduling
                        </span>
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                        Optimize production with intelligent planning
                      </h3>
                      <p className="text-slate-300 text-lg mb-6">
                        Our advanced scheduling system automatically optimizes
                        your production calendar, eliminating conflicts and
                        maximizing machine utilization.
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Conflict detection",
                          "Capacity optimization",
                          "Lead time reduction",
                        ].map((feature, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-center text-slate-300"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              delay: 0.2 + idx * 0.1,
                            }}
                          >
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                              <svg
                                className="w-3 h-3 text-green-400"
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
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>

          {/* Background decorative elements */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 -right-20 w-96 h-96 bg-green-500/5 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}; 