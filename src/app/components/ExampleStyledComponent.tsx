import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Example styled component using our visual language
export const ExampleStyledComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  
  // Framer motion variants for consistent animations
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <section className="py-36 px-8 bg-gradient-to-b from-[#0f0f1a] to-[#1c1b2a] text-white border-t border-slate-700">
      <div className="max-w-6xl mx-auto">
        {/* Example heading styles */}
        <motion.h2 
          className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          Component Example
        </motion.h2>
        
        <motion.p 
          className="text-xl text-slate-100 text-center mb-16 max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          transition={{ delay: 0.1 }}
        >
          This component demonstrates the unified visual language.
        </motion.p>
        
        {/* Example card element */}
        <motion.div 
          className="bg-slate-800/70 border border-slate-700 rounded-xl p-8 shadow-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          whileHover={{ 
            boxShadow: "0 0 25px rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 0.3)",
            transition: { duration: 0.3, ease: "easeInOut" }
          }}
        >
          {/* Card header with icon */}
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Card Title</h3>
          </div>
          
          {/* Inner card content */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 mb-6">
            <p className="text-base text-slate-100 mb-4">
              This inner card demonstrates proper nesting of UI elements according to our visual hierarchy.
            </p>
            
            {/* Example input field */}
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Input Example</label>
              <input 
                type="text" 
                placeholder="Enter text..."
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              />
            </div>
            
            {/* Example tabs */}
            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-2">Tab Example</label>
              <div className="inline-flex p-1 rounded-full bg-slate-800 border border-slate-700">
                <button 
                  onClick={() => setActiveTab('tab1')}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${activeTab === 'tab1' ? 'text-white bg-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Tab 1
                </button>
                <button 
                  onClick={() => setActiveTab('tab2')}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${activeTab === 'tab2' ? 'text-white bg-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Tab 2
                </button>
                <button 
                  onClick={() => setActiveTab('tab3')}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${activeTab === 'tab3' ? 'text-white bg-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Tab 3
                </button>
              </div>
              
              <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                {activeTab === 'tab1' && <p className="text-slate-100">Content for tab 1</p>}
                {activeTab === 'tab2' && <p className="text-slate-100">Content for tab 2</p>}
                {activeTab === 'tab3' && <p className="text-slate-100">Content for tab 3</p>}
              </div>
            </div>
          </div>
          
          {/* Callout component */}
          <div className="bg-blue-900/20 border border-blue-800/30 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-blue-300 font-medium">Information</span>
            </div>
            <p className="text-sm text-slate-400">This callout uses the standardized styling for information blocks.</p>
          </div>
        </motion.div>
        
        {/* Button examples */}
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Primary Button
          </motion.button>
          
          <motion.button
            className="bg-slate-800 text-slate-300 border border-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-700 transition-all duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Secondary Button
          </motion.button>
          
          <motion.button
            className="bg-transparent text-blue-400 border border-blue-500/30 px-6 py-2.5 rounded-lg hover:bg-blue-500/10 transition-all duration-300 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Outline Button
          </motion.button>
        </div>
      </div>
    </section>
  );
}; 