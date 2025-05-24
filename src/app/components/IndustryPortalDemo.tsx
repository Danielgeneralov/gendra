"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Industry = "cnc" | "injection" | "sheet";

const IndustryPortalDemo = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>("cnc");

  // Industry tab options
  const industries = [
    { id: "cnc", label: "CNC Machining" },
    { id: "injection", label: "Injection Molding" },
    { id: "sheet", label: "Sheet Metal" },
  ];

  // Form transition variants
  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-8">
      {/* Industry Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1 rounded-full bg-slate-800 border border-slate-700 shadow-inner">
          {industries.map((industry) => (
            <button
              key={industry.id}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedIndustry === industry.id
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              onClick={() => setSelectedIndustry(industry.id as Industry)}
            >
              {selectedIndustry === industry.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-600"
                  layoutId="industryTabHighlight"
                  transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{industry.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-1 overflow-hidden shadow-lg">
        <AnimatePresence mode="wait">
          {selectedIndustry === "cnc" && (
            <motion.div
              key="cnc-form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              <CNCMachiningForm />
            </motion.div>
          )}

          {selectedIndustry === "injection" && (
            <motion.div
              key="injection-form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              <InjectionMoldingForm />
            </motion.div>
          )}

          {selectedIndustry === "sheet" && (
            <motion.div
              key="sheet-form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              <SheetMetalForm />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// CNC Machining Form Component
const CNCMachiningForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center border-b border-slate-700 pb-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4">
          <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">CNC Machining Quote</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Material Type</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Aluminum 6061</option>
            <option>Aluminum 7075</option>
            <option>Stainless Steel 304</option>
            <option>Titanium Ti-6Al-4V</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
          <input
            type="number"
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="1"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Surface Finish</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>As Machined</option>
            <option>Bead Blasted</option>
            <option>Anodized Type II</option>
            <option>Anodized Type III (Hard Anodized)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tolerance Class</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Standard (±0.005")</option>
            <option>Precision (±0.0025")</option>
            <option>Ultra-Precision (±0.001")</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">CAD Files</label>
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
          <svg className="w-8 h-8 text-slate-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-slate-400 mb-2">Drop your STEP, STP, or IGES files here</p>
          <p className="text-xs text-slate-500">Or click to browse</p>
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
          Get Instant Quote
        </button>
        <button className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
          Save for Later
        </button>
      </div>
    </div>
  );
};

// Injection Molding Form Component
const InjectionMoldingForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center border-b border-slate-700 pb-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center mr-4">
          <svg className="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Injection Molding Quote</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Resin Type</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>ABS</option>
            <option>Polycarbonate (PC)</option>
            <option>Polypropylene (PP)</option>
            <option>Nylon (PA66)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Annual Volume</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Low (1,000 - 10,000)</option>
            <option>Medium (10,001 - 100,000)</option>
            <option>High (100,001+)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Cavity Count</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Single Cavity</option>
            <option>2 Cavities</option>
            <option>4 Cavities</option>
            <option>8+ Cavities</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Surface Finish</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Standard Texture</option>
            <option>SPI-A1 (High Polish)</option>
            <option>SPI-B1 (Semi-Polish)</option>
            <option>SPI-C1 (Matte)</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tooling Type</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Prototype (Aluminum)</option>
            <option>Low Volume Production (P20 Steel)</option>
            <option>Full Production (H13 Hardened Steel)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Lead Time</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Standard (4-6 weeks)</option>
            <option>Expedited (2-3 weeks)</option>
            <option>Rush (1-2 weeks)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Part Design</label>
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
          <svg className="w-8 h-8 text-slate-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-slate-400 mb-2">Upload your 3D CAD files (STEP, STL)</p>
          <p className="text-xs text-slate-500">Or click to browse</p>
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <button className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
          Get Mold Quote
        </button>
        <button className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
          Request Design Review
        </button>
      </div>
    </div>
  );
};

// Sheet Metal Form Component
const SheetMetalForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center border-b border-slate-700 pb-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-900/30 flex items-center justify-center mr-4">
          <svg className="w-5 h-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Sheet Metal Quote</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Material</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Cold Rolled Steel</option>
            <option>Stainless Steel 304</option>
            <option>Aluminum 5052</option>
            <option>Galvanized Steel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Thickness (mm)</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>0.5 mm</option>
            <option>1.0 mm</option>
            <option>1.5 mm</option>
            <option>2.0 mm</option>
            <option>3.0 mm</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
          <input
            type="number"
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="10"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Finish</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-md p-2.5 text-slate-300 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors">
            <option>Unfinished</option>
            <option>Powder Coating</option>
            <option>Zinc Plating</option>
            <option>Brushed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Manufacturing Process</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center">
            <input id="laser-cutting" type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-700 bg-slate-800 focus:ring-0" />
            <label htmlFor="laser-cutting" className="ml-2 text-sm text-slate-300">Laser Cutting</label>
          </div>
          <div className="flex items-center">
            <input id="bending" type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-700 bg-slate-800 focus:ring-0" />
            <label htmlFor="bending" className="ml-2 text-sm text-slate-300">Bending</label>
          </div>
          <div className="flex items-center">
            <input id="welding" type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-700 bg-slate-800 focus:ring-0" />
            <label htmlFor="welding" className="ml-2 text-sm text-slate-300">Welding</label>
          </div>
          <div className="flex items-center">
            <input id="hardware" type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-700 bg-slate-800 focus:ring-0" />
            <label htmlFor="hardware" className="ml-2 text-sm text-slate-300">Hardware Insertion</label>
          </div>
          <div className="flex items-center">
            <input id="tapping" type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-700 bg-slate-800 focus:ring-0" />
            <label htmlFor="tapping" className="ml-2 text-sm text-slate-300">Tapping</label>
          </div>
          <div className="flex items-center">
            <input id="deburring" type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-700 bg-slate-800 focus:ring-0" />
            <label htmlFor="deburring" className="ml-2 text-sm text-slate-300">Deburring</label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Drawing Upload</label>
        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
          <svg className="w-8 h-8 text-slate-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-slate-400 mb-2">Upload DXF files or technical drawings</p>
          <p className="text-xs text-slate-500">Or click to browse</p>
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <button className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors">
          Calculate Price
        </button>
        <button className="px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
          Save as Template
        </button>
      </div>
    </div>
  );
};

export { IndustryPortalDemo }; 