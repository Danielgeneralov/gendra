"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const InsightsDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const [showMetrics, setShowMetrics] = useState(false);
  const [progressValues, setProgressValues] = useState({
    quoteRate: 0,
    conversionRate: 0,
    capacity: 0
  });
  
  // Metric target values
  const targetValues = {
    quoteRate: 87,
    conversionRate: 64,
    capacity: 78
  };
  
  // Simulate metrics loading in when component comes into view
  useEffect(() => {
    if (isInView) {
      // Small initial delay to stagger animations
      setTimeout(() => {
        setShowMetrics(true);
        
        // Animate metric values from 0 to target
        const duration = 1500;
        const startTime = Date.now();
        
        const animateMetrics = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          setProgressValues({
            quoteRate: Math.round(targetValues.quoteRate * progress),
            conversionRate: Math.round(targetValues.conversionRate * progress),
            capacity: Math.round(targetValues.capacity * progress)
          });
          
          if (progress < 1) {
            requestAnimationFrame(animateMetrics);
          }
        };
        
        requestAnimationFrame(animateMetrics);
      }, 300);
    }
  }, [isInView]);
  
  // Bar chart data for quote conversion
  const barChartData = [
    { month: "Jul", value: 48 },
    { month: "Aug", value: 52 },
    { month: "Sep", value: 57 },
    { month: "Oct", value: 59 },
    { month: "Nov", value: 64 },
  ];
  
  const barMaxValue = Math.max(...barChartData.map(d => d.value));
  
  return (
    <div ref={ref} className="space-y-5">
      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* Quote Acceptance Rate */}
        <motion.div
          className="bg-slate-800/90 rounded-lg p-3 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={showMetrics ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="text-xs text-slate-400 mb-1">Quote Rate</div>
          <div className="text-xl font-bold text-white mb-1">{progressValues.quoteRate}%</div>
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={showMetrics ? { width: `${progressValues.quoteRate}%` } : { width: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </motion.div>
        
        {/* Conversion Rate */}
        <motion.div
          className="bg-slate-800/90 rounded-lg p-3 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={showMetrics ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="text-xs text-slate-400 mb-1">Conversion Rate</div>
          <div className="text-xl font-bold text-white mb-1">{progressValues.conversionRate}%</div>
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={showMetrics ? { width: `${progressValues.conversionRate}%` } : { width: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>
        
        {/* Capacity Utilization */}
        <motion.div
          className="bg-slate-800/90 rounded-lg p-3 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          animate={showMetrics ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="text-xs text-slate-400 mb-1">Capacity</div>
          <div className="text-xl font-bold text-white mb-1">{progressValues.capacity}%</div>
          <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={showMetrics ? { width: `${progressValues.capacity}%` } : { width: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Quote Conversion Chart */}
      <motion.div
        className="bg-slate-800/90 rounded-lg p-4 border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={showMetrics ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="text-sm text-white mb-3 font-medium">Quote Conversion Trend</div>
        
        <div className="h-28 flex items-end justify-between">
          {barChartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <motion.div
                className="relative w-8 bg-blue-900/50 rounded-t-sm"
                style={{ height: `${(item.value / barMaxValue) * 100}%` }}
                initial={{ height: 0 }}
                animate={showMetrics ? { height: `${(item.value / barMaxValue) * 100}%` } : { height: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-blue-500/70 rounded-t-sm"
                  initial={{ opacity: 0 }}
                  animate={showMetrics ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                />
                <motion.div
                  className="absolute -top-6 left-0 right-0 text-center text-xs font-medium text-blue-300"
                  initial={{ opacity: 0 }}
                  animate={showMetrics ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                >
                  {item.value}%
                </motion.div>
              </motion.div>
              <div className="text-xs text-slate-400 mt-2">{item.month}</div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Capacity Dial */}
      <motion.div
        className="bg-slate-800/90 rounded-lg p-4 border border-slate-700 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={showMetrics ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="text-sm text-white mb-2 font-medium">Current Shop Capacity</div>
        
        <div className="relative w-32 h-16 overflow-hidden">
          <motion.div
            className="absolute bottom-0 left-0 right-0 w-32 h-32 rounded-full border-8 border-slate-700"
            style={{ borderRadius: "50%" }}
          />
          
          <motion.div
            className="absolute bottom-0 left-0 right-0 w-32 h-32 rounded-full border-8 border-transparent"
            style={{ 
              borderRadius: "50%",
              borderTopColor: "rgb(234 88 12)",
              borderRightColor: "rgb(234 88 12)",
              transform: "rotate(-45deg)"
            }}
            initial={{ rotate: -135 }}
            animate={showMetrics ? { rotate: -135 + (progressValues.capacity * 1.8) } : { rotate: -135 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          
          <motion.div
            className="absolute left-1/2 bottom-0 w-1 h-1 bg-white rounded-full"
            style={{ transform: "translateX(-50%)" }}
          />
          
          <motion.div
            className="absolute top-3 left-0 right-0 text-center text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={showMetrics ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            {progressValues.capacity}%
          </motion.div>
        </div>
        
        <div className="w-full grid grid-cols-3 text-center mt-2">
          <div className="text-xs text-slate-400">Low</div>
          <div className="text-xs text-slate-400">Target</div>
          <div className="text-xs text-slate-400">High</div>
        </div>
      </motion.div>
    </div>
  );
};

export { InsightsDemo }; 