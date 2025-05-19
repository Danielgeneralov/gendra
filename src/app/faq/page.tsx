"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// FAQ data structure
const faqItems = [
  {
    question: "What industries is Gendra built for?",
    answer: "Gendra is optimized for metal fabrication, machining, sheet metal, plastic molding, and electronics assembly. If you quote jobs with RFQs — we can help."
  },
  {
    question: "Can I upload custom RFQs?",
    answer: "Yes. You can drag and drop your PDFs or Excel RFQs and we'll automatically parse the key details and route you to the right form."
  },
  {
    question: "How accurate are Gendra's quotes?",
    answer: "Our logic uses your custom rules, certifications, and volume breaks. You can set your pricing schema during onboarding and adjust it at any time."
  },
  {
    question: "Do I need to pay for every user?",
    answer: "No. Gendra pricing is based on usage and features, not per-seat billing. Invite your team without worrying about cost per user."
  },
  {
    question: "Can Gendra integrate with my ERP?",
    answer: "Yes. Our Premium tier supports custom integrations and Zapier-compatible exports. We also offer API access for custom workflows."
  },
  {
    question: "What happens if I go over my plan limits?",
    answer: "We won't block you — but we'll notify you and recommend upgrading if your usage consistently exceeds plan limits."
  },
  {
    question: "Can I get help setting up my quote logic?",
    answer: "Absolutely. All paid plans include setup assistance. We'll walk you through schema setup and best practices."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use Supabase (PostgreSQL + secure auth) and never share your data. You control your quote history, RFQs, and customer info."
  },
  {
    question: "What happens if I cancel?",
    answer: "Your data remains accessible in read-only mode for 30 days. You can export all quotes, schedules, and analytics before account closure."
  }
];

// FAQ Accordion Item Component
function AccordionItem({ 
  question, 
  answer, 
  isOpen, 
  onClick 
}: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void;
}) {
  return (
    <div className="border border-white/10 rounded-xl p-6 bg-[#0A1828]/50 mb-6 overflow-hidden">
      <button 
        className="w-full text-left text-lg font-semibold text-white flex justify-between items-center cursor-pointer"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className="h-5 w-5 text-blue-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-300 mt-4">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <main className="py-24 px-6 bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about Gendra. Can't find an answer? 
            <a href="/contact" className="text-blue-400 hover:text-blue-300 ml-1">
              Reach out to our team.
            </a>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => toggleAccordion(index)}
            />
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-16 border-t border-white/10 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-6">
            Our team is ready to help you get set up and running with Gendra.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </main>
  );
} 