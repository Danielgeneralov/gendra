"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PricingPage() {
  return (
    <main className="bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828] min-h-screen text-white py-24 px-6">
      {/* Hero Section */}
      <motion.div 
        className="text-center max-w-3xl mx-auto mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-bold text-white mb-4">Flexible pricing built for manufacturers</h1>
        <p className="text-gray-400 text-lg">
          Whether you're quoting a few jobs a week or managing a full production line, Gendra adapts to your workflow.
        </p>
      </motion.div>

      {/* Pricing Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Tier */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="bg-[#0A1828]/50 rounded-xl p-8 border border-white/10 shadow-lg hover:shadow-blue-700/20 transition group"
        >
          <h2 className="text-2xl font-bold mb-2">Free</h2>
          <p className="text-gray-400 mb-4">Get started with the basics</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-gray-400 ml-2">/month</span>
          </div>
          
          <div className="mb-8">
            <p className="text-white/80 mb-1">Setup fee: <span className="text-white">$0</span></p>
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>10 quotes per month</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>AI quote parsing</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Basic scheduling</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>1 user account</span>
            </li>
          </ul>
          
          <Link 
            href="/signup"
            className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-center rounded-lg font-medium transition"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Standard Tier */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-[#0A1828]/50 rounded-xl p-8 border border-blue-600/50 shadow-lg shadow-blue-700/10 hover:shadow-blue-600/30 transition group relative z-10 transform hover:-translate-y-1"
        >
          {/* Most Popular Badge */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-medium py-1 px-4 rounded-full">
            Most Popular
          </div>

          <h2 className="text-2xl font-bold mb-2">Standard</h2>
          <p className="text-gray-400 mb-4">For growing manufacturing teams</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold">$99</span>
            <span className="text-gray-400 ml-2">/month</span>
          </div>
          
          <div className="mb-8">
            <p className="text-white/80 mb-1">Setup fee: <span className="text-white">$199</span></p>
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlimited quotes</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Advanced AI parsing & routing</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Visual shop floor scheduling</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Quote analytics dashboard</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Up to 5 user accounts</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Email & chat support</span>
            </li>
          </ul>
          
          <Link 
            href="/signup"
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-center rounded-lg font-medium transition"
          >
            Start Free Trial
          </Link>
        </motion.div>

        {/* Premium Tier */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="bg-[#0A1828]/50 rounded-xl p-8 border border-white/10 shadow-lg hover:shadow-blue-700/20 transition group"
        >
          <h2 className="text-2xl font-bold mb-2">Premium</h2>
          <p className="text-gray-400 mb-4">For established manufacturers</p>
          
          <div className="mb-6">
            <span className="text-4xl font-bold">$249</span>
            <span className="text-gray-400 ml-2">/month</span>
          </div>
          
          <div className="mb-8">
            <p className="text-white/80 mb-1">Setup fee: <span className="text-white">$399</span> <span className="text-green-400">(waived with annual billing)</span></p>
          </div>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Everything in Standard, plus:</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Multi-stage workflow automation</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Custom quoting form builder</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Advanced capacity planning</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Up to 15 user accounts</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Priority support with SLAs</span>
            </li>
          </ul>
          
          <Link 
            href="/signup"
            className="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-center rounded-lg font-medium transition"
          >
            Contact Sales
          </Link>
        </motion.div>
      </div>

      {/* Enterprise / High-Touch CTA */}
      <motion.div 
        className="text-center mt-32 py-16 border-t border-white/10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-semibold text-white mb-4">Need more flexibility?</h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Gendra supports multi-site operations, ERP integrations, and custom analytics workflows.  
          If you need a tailored onboarding or pricing model, let's talk.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Talk to Sales
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
            <h3 className="font-semibold text-lg mb-2">How does the free trial work?</h3>
            <p className="text-gray-400">All plans start with a 14-day free trial with full access to premium features. No credit card required to start. You can upgrade to a paid plan anytime during or after your trial.</p>
          </div>
          
          <div className="bg-[#0A1828]/80 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-lg mb-2">Can I change plans later?</h3>
            <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. When upgrading, your new features become available immediately. When downgrading, changes take effect at the end of your current billing cycle.</p>
          </div>
          
          <div className="bg-[#0A1828]/80 rounded-lg p-6 border border-white/10">
            <h3 className="font-semibold text-lg mb-2">Is there a discount for annual billing?</h3>
            <p className="text-gray-400">Yes, annual billing gives you two months free compared to monthly pricing. We also waive the setup fee on Premium plans with annual commitment.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
} 