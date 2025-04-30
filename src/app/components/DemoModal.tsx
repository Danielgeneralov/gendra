"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MotionButton } from "./MotionButton";

type DemoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Replace console.log with console.warn
      console.warn("Demo request submitted:", formData);
      
      // Simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus({
        success: true,
        message: "Your demo request has been submitted! We'll be in touch shortly."
      });
      
      // Reset form after successful submission
      setFormData({
        name: "",
        company: "",
        email: "",
        message: ""
      });
      
      // Close modal after 3 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting demo request:", error);
      setSubmitStatus({
        success: false,
        message: "There was an error submitting your request. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 500 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div 
            className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Book a Demo</h3>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {submitStatus ? (
              <div className={`p-4 rounded-md mb-6 ${submitStatus.success ? "bg-green-900/30 border border-green-800" : "bg-red-900/30 border border-red-800"}`}>
                <p className={`text-sm ${submitStatus.success ? "text-green-300" : "text-red-300"}`}>
                  {submitStatus.message}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                    placeholder="Tell us about your manufacturing needs"
                  />
                </div>
                
                <div className="pt-2">
                  <MotionButton
                    type="submit"
                    primary={true}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Demo"}
                  </MotionButton>
                </div>
              </form>
            )}
            
            <p className="text-xs text-slate-400 mt-4 text-center">
              We respect your privacy and will never share your information.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 