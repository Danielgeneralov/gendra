"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingPage() {
  return (
    <main className="bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828] min-h-screen text-white py-24 px-6">
      {/* Hero Section */}
      <motion.div 
        className="text-center max-w-4xl mx-auto mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-bold text-white mb-8">AI Growth Pricing</h1>
        <p className="text-gray-300 text-xl mb-12">
          Our solutions are tailored to your factory's size, data maturity, and EBITDA goals.
        </p>

        {/* Why no fixed pricing section */}
        <motion.div 
          className="bg-[#0A1828]/50 rounded-xl p-8 border border-white/10 shadow-lg mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">Why no fixed pricing?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-300">
                Manufacturers waste 8-15% in material costs → We align fees with <em className="text-blue-400">your savings</em>.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
              <p className="text-gray-300">
                Private equity firms need exit-ready ops → We build scalable AI stacks.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* How it works section */}
      <motion.div 
        className="max-w-5xl mx-auto mb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-12">How it works:</h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Free Audit */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="bg-[#0A1828]/50 rounded-xl p-8 border border-white/10 shadow-lg hover:shadow-blue-700/20 transition group"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4 text-lg">
                1
              </div>
              <h3 className="text-2xl font-bold">Free Audit</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-green-400">$0</span>
              <span className="text-gray-400 ml-3 text-lg">• 2 weeks</span>
            </div>
            
            <p className="text-gray-300 mb-8 text-lg">
              We find $100K+ in savings or you pay nothing.
            </p>

            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Comprehensive cost analysis</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Process optimization review</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>AI opportunity assessment</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Detailed savings roadmap</span>
              </li>
            </ul>

            <div className="mt-8">
              <Link 
                href="https://calendly.com/dan-generalov01"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-center rounded-lg font-medium text-lg transition transform hover:scale-105"
              >
                Start Free Audit
              </Link>
            </div>
          </motion.div>

          {/* Enterprise Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="bg-[#0A1828]/50 rounded-xl p-8 border border-blue-600/50 shadow-lg shadow-blue-700/10 hover:shadow-blue-600/30 transition group relative z-10 transform hover:-translate-y-1"
          >
            {/* Most Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-medium py-2 px-6 rounded-full">
              Custom Solutions
            </div>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 text-lg">
                2
              </div>
              <h3 className="text-2xl font-bold">Enterprise Implementation</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">Custom</span>
              <span className="text-gray-400 ml-3 text-lg">pricing</span>
            </div>
            
            <p className="text-gray-300 mb-8 text-lg">
              Tailored AI solutions aligned with your savings and growth targets.
            </p>

            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Performance-based pricing model</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Full AI stack deployment</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Dedicated growth team</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Exit-ready operations</span>
              </li>
            </ul>

            <div className="mt-8">
              <Link 
                href="https://calendly.com/dan-generalov01"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-center rounded-lg font-medium text-lg transition transform hover:scale-105"
              >
                Discuss Custom Pricing
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Process Flow */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-4 text-gray-400">
            <span className="text-lg font-medium">Free Audit</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-lg font-medium">Pilot Program</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-lg font-medium">Full Scale</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Quote and CTA Section */}
      <motion.div 
        className="text-center mt-20 py-16 border-t border-white/10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <blockquote className="text-2xl font-medium text-blue-400 mb-8 italic">
          "We only win when you do."
        </blockquote>
        <Link
          href="https://calendly.com/dan-generalov01"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition transform hover:scale-105"
        >
          Book a Call with Our M&A Team
        </Link>
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        className="max-w-3xl mx-auto mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-[#0A1828]/80 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-lg mb-2">What if you don't find $100K+ in savings?</h3>
            <p className="text-gray-400">You pay nothing. Our free audit is risk-free, and we only move forward if we can demonstrate clear, measurable value for your operations.</p>
          </div>
          
          <div className="bg-[#0A1828]/80 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-lg mb-2">How do you align fees with our savings?</h3>
            <p className="text-gray-400">Our pricing is performance-based. We take a percentage of the documented savings we generate, ensuring our success is directly tied to your bottom line results.</p>
          </div>
          
          <div className="bg-[#0A1828]/80 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-lg mb-2">What makes your AI stack "exit-ready"?</h3>
            <p className="text-gray-400">We build scalable, documented systems that increase your company's valuation. Our implementations focus on creating sustainable competitive advantages that PE firms and acquirers value.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
} 