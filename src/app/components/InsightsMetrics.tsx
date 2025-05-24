"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

// Register ScrollTrigger plugin only on client side
const isClient = typeof window !== "undefined";
if (isClient) {
  gsap.registerPlugin(ScrollTrigger);
}

// Metric data
const metricData = [
  { label: "Quote Rate", value: 87, color: "bg-blue-500" },
  { label: "Conversion Rate", value: 64, color: "bg-green-500" },
  { label: "Capacity", value: 78, color: "bg-amber-500" },
];

// Chart data for quote conversion trend
const chartData = [
  { month: "Jul", value: 48 },
  { month: "Aug", value: 52 },
  { month: "Sep", value: 57 },
  { month: "Oct", value: 59 },
  { month: "Nov", value: 64 },
];

export function InsightsMetrics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const barRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [counters, setCounters] = useState<number[]>([0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Initialize GSAP animations
  useEffect(() => {
    if (!isClient) return;
    
    const metrics = metricsRef.current;
    const chart = chartRef.current;
    const section = sectionRef.current;

    if (!metrics || !chart || !section) return;

    // Create a timeline for metrics animation
    const metricsTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none none",
        onEnter: () => setHasAnimated(true),
      },
    });

    // Animate the metrics cards
    metricsTl.fromTo(
      counterRefs.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
      }
    );

    // Create a timeline for chart animation
    const chartTl = gsap.timeline({
      scrollTrigger: {
        trigger: chart,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Animate the bars in the chart
    chartTl.fromTo(
      barRefs.current,
      { 
        scaleY: 0,
        transformOrigin: "bottom",
        opacity: 0,
      },
      {
        scaleY: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );

    // Animate the percentages above bars
    chartTl.fromTo(
      ".chart-value",
      { opacity: 0, y: 10 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out" 
      },
      0.3
    );

    // Cleanup
    return () => {
      if (metricsTl.scrollTrigger) {
        metricsTl.scrollTrigger.kill();
      }
      if (chartTl.scrollTrigger) {
        chartTl.scrollTrigger.kill();
      }
    };
  }, []);

  // Handle counter animations separately from GSAP
  useEffect(() => {
    if (!hasAnimated) return;
    
    const animateCounters = () => {
      const duration = 1500; // ms
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        
        setCounters(prev => {
          const newCounters = [...prev];
          
          metricData.forEach((metric, index) => {
            // Using easeOutQuad for smoother animation
            const easedProgress = 1 - (1 - progress) * (1 - progress);
            newCounters[index] = Math.round(metric.value * Math.min(easedProgress, 1));
          });
          
          return newCounters;
        });
        
        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
      
      // Cleanup
      return () => clearInterval(counter);
    };
    
    const counterCleanup = animateCounters();
    return () => {
      if (counterCleanup) counterCleanup();
    };
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="py-24 px-8 bg-gradient-to-b from-[#1c1b2a] to-[#0f0f1a] border-t border-slate-700">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Operational Insights
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Real-time metrics to optimize your manufacturing workflow
          </p>
        </div>

        <div className="space-y-12">
          {/* Metric Cards */}
          <div ref={metricsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metricData.map((metric, index) => (
              <div
                key={metric.label}
                ref={(el) => {
                  counterRefs.current[index] = el;
                }}
                className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-800/30"
              >
                <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider mb-2">{metric.label}</h3>
                <div className="text-4xl font-bold text-white mb-3">
                  {counters[index]}%
                </div>
                <div className="h-3 w-full bg-slate-700/70 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${metric.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${counters[index]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div ref={chartRef} className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-8">Quote Conversion Trend</h3>
            
            <div className="flex items-end justify-between h-64 px-4 mb-6">
              {chartData.map((item, index) => (
                <div key={item.month} className="flex flex-col items-center">
                  <div className="relative flex-1 w-20 flex items-end justify-center">
                    <div
                      className="chart-value absolute -top-8 text-blue-300 font-medium opacity-0"
                    >
                      {item.value}%
                    </div>
                    <div
                      ref={(el) => {
                        barRefs.current[index] = el;
                      }}
                      className="w-12 bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-md mx-auto shadow-lg opacity-0"
                      style={{ 
                        height: `${(item.value / chartData[chartData.length - 1].value) * 100}%`,
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
                      }}
                    />
                  </div>
                  <div className="mt-4 text-slate-300 font-medium">{item.month}</div>
                </div>
              ))}
            </div>
            
            {/* Animated trend line overlaid on bars */}
            <div className="relative h-12 mt-8 mb-8">
              <svg className="w-full h-full">
                <motion.path
                  d={`M 0,48 C 40,20 80,40 120,25 C 160,10 200,30 240,12`}
                  fill="none"
                  strokeWidth="2"
                  stroke="#3b82f6"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                {/* Animated dots on path */}
                <motion.circle
                  cx="0"
                  cy="48"
                  r="4"
                  fill="#3b82f6"
                  animate={{
                    cx: [0, 240],
                    cy: [48, 12],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                    delay: 2
                  }}
                />
              </svg>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-300">
                  <span className="inline-block mr-4">
                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Quote to Order Conversion
                  </span>
                </div>
                <div className="text-green-400 font-medium">
                  ↑ 16% from Q2
                </div>
              </div>
            </div>
          </div>
          
          {/* New Analytics Dashboard */}
          <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6">Real-time Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Live orders graph */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-slate-300">Live Orders</h4>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1.5"></div>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                </div>
                
                <div className="relative h-32">
                  {/* Animated pulse background */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/5 to-transparent"
                      animate={{ 
                        height: ['20%', '60%', '20%'] 
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    />
                  </div>
                  
                  {/* Live data bars */}
                  <div className="absolute inset-0 flex items-end justify-between px-1">
                    {[...Array(20)].map((_, index) => {
                      const randomHeight = 15 + Math.random() * 70;
                      return (
                        <motion.div
                          key={index}
                          className="w-1 bg-blue-500/70 rounded-t"
                          style={{ height: '0%' }}
                          animate={{ 
                            height: `${randomHeight}%`,
                            opacity: 0.3 + Math.random() * 0.7
                          }}
                          transition={{ 
                            duration: 0.4,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: index * 0.1,
                            repeatDelay: Math.random() * 2
                          }}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Animated tracking line */}
                  <motion.div
                    className="absolute h-0.5 bg-blue-400/50 left-0 right-0"
                    style={{ top: '50%' }}
                    animate={{ 
                      top: ['30%', '70%', '30%'],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ 
                      duration: 5, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  />
                </div>
                
                <div className="flex justify-between mt-3 text-xs text-slate-400">
                  <span>Last 24 hours</span>
                  <span className="text-white font-medium">32 orders</span>
                </div>
              </div>
              
              {/* Machine performance heatmap */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-slate-300">Performance Heatmap</h4>
                  <span className="text-xs text-blue-400">Weekly View</span>
                </div>
                
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {["M", "T", "W", "T", "F"].map((day, i) => (
                    <div key={i} className="text-center text-xs text-slate-500">{day}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-5 gap-1">
                  {[...Array(15)].map((_, index) => {
                    // Colors based on performance level
                    const colors = [
                      "bg-blue-900/30", "bg-blue-800/40", "bg-blue-700/50", 
                      "bg-blue-600/60", "bg-blue-500/70"
                    ];
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    
                    return (
                      <motion.div
                        key={index}
                        className={`h-8 rounded ${randomColor} border border-slate-800`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3,
                          delay: index * 0.05
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)"
                        }}
                      />
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex">
                    <div className="w-3 h-3 rounded-sm bg-blue-900/30 mr-1 border border-slate-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-800/40 mr-1 border border-slate-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-700/50 mr-1 border border-slate-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-600/60 mr-1 border border-slate-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-500/70 mr-1 border border-slate-800"></div>
                  </div>
                  <div className="text-xs text-slate-400 flex">
                    <span>Low</span>
                    <div className="mx-2 border-t border-slate-500 self-center w-6"></div>
                    <span>High</span>
                  </div>
                </div>
              </div>
              
              {/* Production metrics */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-medium text-slate-300">Production Metrics</h4>
                  <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 rounded-full">Realtime</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Units", value: "14,385", change: "+12.4%", color: "text-green-400" },
                    { label: "On-time Delivery", value: "96.5%", change: "+3.2%", color: "text-green-400" },
                    { label: "Cost Efficiency", value: "83.1%", change: "-0.7%", color: "text-amber-400" }
                  ].map((metric, index) => (
                    <motion.div 
                      key={index}
                      className="border border-slate-700 bg-slate-800/50 rounded p-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    >
                      <div className="text-xs text-slate-400 mb-1">{metric.label}</div>
                      <div className="flex items-end justify-between">
                        <div className="text-xl font-bold text-white">{metric.value}</div>
                        <div className={`text-xs ${metric.color} flex items-center`}>
                          {metric.change.startsWith("+") ? (
                            <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="none">
                              <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 mr-0.5" viewBox="0 0 24 24" fill="none">
                              <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                          {metric.change}
                        </div>
                      </div>
                      
                      {/* Miniature spark line graph */}
                      <div className="h-6 mt-2 relative">
                        <svg className="w-full h-full overflow-visible">
                          <motion.path
                            d={index === 0 ? "M0,20 C10,18 20,5 30,3 C40,1 50,10 60,8 C70,5 80,15 90,12" :
                               index === 1 ? "M0,15 C10,10 20,5 30,8 C40,10 50,5 60,3 C70,1 80,5 90,2" :
                               "M0,10 C10,12 20,15 30,13 C40,10 50,15 60,17 C70,18 80,15 90,16"}
                            stroke={index === 0 ? "#3b82f6" : index === 1 ? "#22c55e" : "#f59e0b"}
                            strokeWidth="1.5"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                          />
                        </svg>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 