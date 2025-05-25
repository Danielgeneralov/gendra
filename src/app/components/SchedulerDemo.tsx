"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface JobCard {
  id: number;
  name: string;
  duration: number;
  color: string;
  placed: boolean;
  slotId?: number;
}

const SchedulerDemo = () => {
  const [jobs, setJobs] = useState<JobCard[]>([
    { id: 1, name: "Bracket", duration: 2, color: "bg-blue-500", placed: false },
    { id: 2, name: "Flange", duration: 1, color: "bg-green-500", placed: false },
    { id: 3, name: "Housing", duration: 3, color: "bg-purple-500", placed: false },
  ]);
  
  const [draggedJob, setDraggedJob] = useState<JobCard | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [optimized, setOptimized] = useState<boolean>(false);
  
  // Days of the week for column headers
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  
  // Machine slots for rows
  const machines = ["CNC Mill 1", "CNC Mill 2", "CNC Lathe"];
  
  // Calendar grid cells (5 days x 3 machines)
  const calendarSlots = Array.from({ length: days.length * machines.length }, (_, i) => i);
  
  // Handle job card drag start
  const handleDragStart = (job: JobCard) => {
    setDraggedJob(job);
  };
  
  // Handle job drop on calendar slot
  const handleDrop = (slotId: number) => {
    if (draggedJob) {
      // Update job placement
      setJobs(jobs.map(j => 
        j.id === draggedJob.id 
          ? { ...j, placed: true, slotId: slotId } 
          : j
      ));
      
      setDraggedJob(null);
      setHoveredSlot(null);
      
      // If all jobs are placed, trigger optimization after a delay
      const updatedJobs = jobs.map(j => 
        j.id === draggedJob.id ? { ...j, placed: true } : j
      );
      
      if (updatedJobs.every(j => j.placed)) {
        setTimeout(() => {
          setOptimized(true);
        }, 1500);
      }
    }
  };
  
  // Handle job card removal from calendar
  const resetJob = (jobId: number) => {
    setJobs(jobs.map(j => 
      j.id === jobId 
        ? { ...j, placed: false, slotId: undefined } 
        : j
    ));
    
    setOptimized(false);
  };
  
  return (
    <div className="space-y-4">
      {/* Job Cards */}
      <div className="flex flex-wrap gap-2 mb-4">
        {jobs.filter(job => !job.placed).map((job) => (
          <motion.div
            key={job.id}
            className={`${job.color} rounded-md py-1 px-3 text-white font-medium text-xs shadow-md cursor-grab`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            drag={!job.placed}
            onDragStart={() => handleDragStart(job)}
            animate={{ 
              boxShadow: draggedJob?.id === job.id 
                ? "0 0 15px rgba(255, 255, 255, 0.3)" 
                : "0 1px 3px rgba(0, 0, 0, 0.1)" 
            }}
          >
            {job.name}
          </motion.div>
        ))}
        
        {jobs.length === 0 && (
          <div className="text-slate-400 text-sm">No jobs available</div>
        )}
      </div>
      
      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900/70">
        {/* Header */}
        <div className="grid grid-cols-5 bg-slate-800 border-b border-slate-700">
          {days.map((day, i) => (
            <div key={i} className="text-xs text-slate-400 p-1.5 text-center font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Machine Rows */}
        <div className="grid grid-cols-1 divide-y divide-slate-700">
          {machines.map((machine, machineIndex) => (
            <div key={machineIndex} className="py-1">
              <div className="text-xs text-slate-400 px-2 py-1 bg-slate-800/80">
                {machine}
              </div>
              
              {/* Day slots for this machine */}
              <div className="grid grid-cols-5 h-10">
                {days.map((_, dayIndex) => {
                  const slotId = machineIndex * days.length + dayIndex;
                  const jobsInSlot = jobs.filter(job => job.placed && job.slotId === slotId);
                  
                  return (
                    <motion.div 
                      key={slotId}
                      className={`border-r border-b border-slate-700 last:border-r-0 ${
                        hoveredSlot === slotId ? 'bg-slate-800/50' : ''
                      } relative`}
                      onHoverStart={() => setHoveredSlot(slotId)}
                      onHoverEnd={() => setHoveredSlot(null)}
                      onTap={() => draggedJob && handleDrop(slotId)}
                    >
                      {jobsInSlot.map(job => (
                        <motion.div
                          key={job.id}
                          className={`absolute top-1 left-0 right-0 mx-auto h-8 ${job.color} rounded px-2 py-1 text-white text-xs flex items-center justify-center`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1,
                            boxShadow: optimized ? "0 0 15px rgba(255, 255, 255, 0.3)" : "none" 
                          }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => resetJob(job.id)}
                        >
                          {job.name}
                        </motion.div>
                      ))}
                      
                      {/* Optimization indicator */}
                      {optimized && slotId === 2 && (
                        <motion.div
                          className="absolute -top-1 -right-1 bg-amber-500 rounded-full w-3 h-3"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.5, 1] }}
                          transition={{ duration: 0.5 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-slate-400 flex items-center justify-between">
        <span>Drag jobs to schedule them</span>
        
        {optimized && (
          <motion.div 
            className="text-green-400 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Schedule optimized!</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export { SchedulerDemo }; 