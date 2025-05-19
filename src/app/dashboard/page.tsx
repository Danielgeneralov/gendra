"use client";

import { useState, useEffect } from "react";
import { useProtectedPage } from "@/lib/hooks/useProtectedPage";

// Skeleton component for dashboard while loading
function SkeletonDashboard() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-64 bg-[#0A1828]/70 rounded-md animate-pulse mb-2"></div>
        <div className="h-6 w-96 bg-[#0A1828]/50 rounded-md animate-pulse mb-8"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
              <div className="h-6 w-36 bg-[#0A1828]/70 rounded-md animate-pulse mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-8 w-12 bg-[#0A1828]/70 rounded-md animate-pulse"></div>
                <div className="h-6 w-20 bg-[#0A1828]/70 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-36 bg-[#0A1828]/70 rounded-md animate-pulse"></div>
            <div className="h-5 w-16 bg-[#0A1828]/70 rounded-md animate-pulse"></div>
          </div>
          
          <div className="flex justify-center items-center py-16">
            <div className="h-48 w-56 bg-[#0A1828]/70 rounded-md animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
              <div className="h-6 w-48 bg-[#0A1828]/70 rounded-md animate-pulse mb-6"></div>
              <div className="flex justify-center items-center py-16">
                <div className="h-24 w-56 bg-[#0A1828]/70 rounded-md animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Actual dashboard content
function ActualDashboard() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">Manufacturing Dashboard</h1>
        <p className="text-lg text-[#CBD5E1] mb-8">
          Monitor and analyze your manufacturing operations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Active Projects</h2>
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold text-[#F0F4F8]">0</span>
              <span className="text-[#94A3B8]">Projects</span>
            </div>
          </div>
          
          <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Pending Quotes</h2>
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold text-[#F0F4F8]">0</span>
              <span className="text-[#94A3B8]">Quotes</span>
            </div>
          </div>
          
          <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Total Revenue</h2>
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold text-[#F0F4F8]">$0</span>
              <span className="text-[#94A3B8]">USD</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#4A6FA6]">Recent Projects</h2>
            <button className="text-[#94A3B8] text-sm hover:text-[#CBD5E1]">View All</button>
          </div>
          
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="text-[#4A6FA6] text-4xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#E2E8F0] mb-2">No Projects Yet</h2>
              <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto">
                Start by creating a quote and converting it to a project.
                Your manufacturing projects will appear here.
              </p>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create a Quote
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-6">Industry Breakdown</h2>
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <p className="text-[#94A3B8] mb-4">
                  No data available
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-6">Timeline</h2>
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <p className="text-[#94A3B8] mb-4">
                  No timeline data available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  useProtectedPage();
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setLoading(false), 600);
    
    // In a real application, you would fetch data here
    // const fetchData = async () => {
    //   try {
    //     // Fetch dashboard data
    //     setLoading(false);
    //   } catch (error) {
    //     console.error("Failed to load dashboard data:", error);
    //     setLoading(false);
    //   }
    // };
    // fetchData();
    
    return () => clearTimeout(timer);
  }, []);
  
  return loading ? <SkeletonDashboard /> : <ActualDashboard />;
}
