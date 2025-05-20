"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductsPage() {
  return (
    <main className="bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828] min-h-screen text-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            The Modern Quoting OS for Manufacturers
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
            Streamline your manufacturing processes with our comprehensive platform designed for quoting, scheduling, and analytics.
          </p>
        </motion.div>
      </section>

      {/* Quoting Section */}
      <section className="max-w-6xl mx-auto py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quote Smarter, Not Harder</h2>
            <p className="text-lg text-slate-300 mb-6">
              Upload your RFQ. Let Gendra parse, route, and calculate quotes with precision.
            </p>
            <div className="p-4 bg-blue-900/20 border border-blue-800/40 rounded-lg inline-block mb-6">
              <p className="text-blue-300 font-semibold">Reduce quoting time by 90%</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 opacity-30 blur rounded-lg"></div>
            <div className="relative bg-slate-900 p-6 rounded-lg border border-slate-800">
              <div className="flex flex-col space-y-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">1. Upload RFQ</h3>
                  <p className="text-sm text-slate-400">Drag & drop your files: PDF, Excel, CAD</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">2. AI Parsing</h3>
                  <p className="text-sm text-slate-400">Automatic extraction of specs, BOM, timelines</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">3. Industry-Specific Form</h3>
                  <p className="text-sm text-slate-400">Tailored inputs for your manufacturing specialty</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scheduling Section */}
      <section className="max-w-6xl mx-auto py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse"
        >
          <div className="md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Scheduling, Simplified</h2>
            <p className="text-lg text-slate-300 mb-6">
              Drag and drop jobs into our visual calendar. Get capacity views and real-time changes.
            </p>
            <div className="p-4 bg-green-900/20 border border-green-800/40 rounded-lg inline-block mb-6">
              <p className="text-green-300 font-semibold">Balance shop floor load instantly</p>
            </div>
          </div>

          <div className="relative md:order-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 opacity-30 blur rounded-lg"></div>
            <div className="relative bg-slate-900 p-6 rounded-lg border border-slate-800">
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                <div className="flex-shrink-0 w-64 bg-slate-800 p-4 rounded-lg">
                  <div className="h-6 w-full bg-slate-700 rounded mb-2"></div>
                  <div className="h-16 w-full bg-green-900/40 rounded mb-2 border border-green-800/50"></div>
                  <div className="h-16 w-full bg-blue-900/40 rounded mb-2 border border-blue-800/50"></div>
                  <div className="h-16 w-full bg-purple-900/40 rounded border border-purple-800/50"></div>
                </div>
                <div className="flex-shrink-0 w-64 bg-slate-800 p-4 rounded-lg">
                  <div className="h-6 w-full bg-slate-700 rounded mb-2"></div>
                  <div className="h-16 w-full bg-yellow-900/40 rounded mb-2 border border-yellow-800/50"></div>
                  <div className="h-16 w-full bg-blue-900/40 rounded mb-2 border border-blue-800/50"></div>
                  <div className="h-16 w-full bg-red-900/40 rounded border border-red-800/50"></div>
                </div>
                <div className="flex-shrink-0 w-64 bg-slate-800 p-4 rounded-lg">
                  <div className="h-6 w-full bg-slate-700 rounded mb-2"></div>
                  <div className="h-16 w-full bg-green-900/40 rounded mb-2 border border-green-800/50"></div>
                  <div className="h-16 w-full bg-purple-900/40 rounded border border-purple-800/50"></div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="h-2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Analytics Section */}
      <section className="max-w-6xl mx-auto py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From Jobs to Insight</h2>
            <p className="text-lg text-slate-300 mb-6">
              Track quote win rates, bottlenecks, lead time trends, and more.
            </p>
            <div className="p-4 bg-purple-900/20 border border-purple-800/40 rounded-lg inline-block mb-6">
              <p className="text-purple-300 font-semibold">Turn quoting data into competitive advantage</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 opacity-30 blur rounded-lg"></div>
            <div className="relative bg-slate-900 p-6 rounded-lg border border-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-sm">Win Rate</h3>
                  <div className="h-24 bg-slate-700 rounded-lg flex items-end p-2">
                    <div className="w-1/5 h-1/3 bg-blue-500 rounded"></div>
                    <div className="w-1/5 h-1/2 bg-blue-500 rounded ml-1"></div>
                    <div className="w-1/5 h-2/3 bg-blue-500 rounded ml-1"></div>
                    <div className="w-1/5 h-3/4 bg-blue-500 rounded ml-1"></div>
                    <div className="w-1/5 h-full bg-blue-500 rounded ml-1"></div>
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-sm">Quote Distribution</h3>
                  <div className="h-24 bg-slate-700 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-500 relative">
                      <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-transparent border-l-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg col-span-2">
                  <h3 className="font-medium mb-2 text-sm">Lead Time Trends</h3>
                  <div className="h-16 bg-slate-700 rounded-lg flex items-end p-2">
                    <div className="flex-grow h-1/4 bg-purple-500/50 rounded-t"></div>
                    <div className="flex-grow h-2/5 bg-purple-500/50 rounded-t"></div>
                    <div className="flex-grow h-3/4 bg-purple-500/50 rounded-t"></div>
                    <div className="flex-grow h-1/2 bg-purple-500/50 rounded-t"></div>
                    <div className="flex-grow h-3/5 bg-purple-500/50 rounded-t"></div>
                    <div className="flex-grow h-1/3 bg-purple-500/50 rounded-t"></div>
                    <div className="flex-grow h-2/3 bg-purple-500/50 rounded-t"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.div 
        className="text-center py-24 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to transform your quoting?</h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
          Join manufacturers who are saving time, reducing errors, and winning more business with Gendra.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-lg transition duration-300 text-lg"
        >
          Get Started Free
        </Link>
      </motion.div>
    </main>
  );
} 