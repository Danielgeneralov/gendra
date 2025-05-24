"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const FloatingCTAComponent = ({ showStickyCTA }: { showStickyCTA: boolean }) => {
  if (!showStickyCTA) return null;
  
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 left-4 sm:left-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-stretch gap-4"
        whileHover={{
          boxShadow: "0 0 25px rgba(59, 130, 246, 0.2)",
          borderColor: "rgba(59, 130, 246, 0.3)",
        }}
      >
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-white font-bold sm:text-lg">
            Start Your Quote Today
          </h3>
          <p className="text-slate-300 text-sm">Free Until Launch</p>
        </div>
        <div className="w-full sm:w-auto">
          <Link
            href="/quote"
            className="block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors duration-200 text-center"
          >
            Get Started
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}; 