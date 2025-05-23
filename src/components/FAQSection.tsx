'use client';

import { useState } from 'react';
import { FAQ } from '@/lib/industryFaqs';
import StructuredData from './SEO/StructuredData';

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
}

export default function FAQSection({ faqs, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Generate FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  
  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <>
      <StructuredData data={faqStructuredData} />
      
      <div className="my-12 bg-[#0A1828]/70 backdrop-blur-sm p-6 rounded-lg border border-[#050C1C]">
        <h2 className="text-2xl font-semibold text-[#4A6FA6] mb-6">{title}</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#24334A] pb-4">
              <button
                onClick={() => toggleQuestion(index)}
                className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
              >
                <h3 className="text-lg font-medium text-[#E2E8F0]">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-[#4A6FA6] transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`mt-2 transition-all duration-300 overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-[#94A3B8] text-base">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 