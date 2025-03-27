"use client";

import { useState, FormEvent, useEffect } from "react";
import { supabase } from "./supabase";
import Link from "next/link";
import Image from "next/image";

// Define the Job type
type Job = {
  id: string;
  part_type: string;
  material: string;
  quantity: number;
  complexity: string;
  deadline: string;
  quote_amount: number;
  created_at: string;
};

export default function Home() {
  const [formData, setFormData] = useState({
    partType: "",
    material: "",
    quantity: 1,
    complexity: "",
    deadline: ""
  });
  
  const [quoteResult, setQuoteResult] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Fetch recent jobs when component mounts
  useEffect(() => {
    async function fetchRecentJobs() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (error) {
          console.error("Error fetching recent jobs:", error);
        } else {
          setRecentJobs(data || []);
        }
      } catch (err) {
        console.error("Exception during fetch:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecentJobs();
  }, [quoteResult]); // Refetch when a new quote is generated
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 1 : value
    }));
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };
  
  const validateForm = (): boolean => {
    // Check if all required fields are filled
    if (!formData.partType.trim()) {
      setValidationError("Please enter a part type");
      return false;
    }
    
    if (!formData.material.trim()) {
      setValidationError("Please enter a material");
      return false;
    }
    
    if (!formData.quantity || formData.quantity < 1) {
      setValidationError("Please enter a valid quantity (minimum 1)");
      return false;
    }
    
    if (!formData.complexity) {
      setValidationError("Please select a complexity level");
      return false;
    }
    
    if (!formData.deadline) {
      setValidationError("Please select a deadline");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus({ type: null, message: "" });
    setValidationError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Calculate the quote
    const basePrice = formData.quantity * 100;
    const complexityMultiplier = formData.complexity === "high" ? 1.5 : 1;
    const totalPrice = basePrice * complexityMultiplier;
    
    setQuoteResult(totalPrice);
    
    // Insert data into Supabase
    try {
      // Check if Supabase is properly initialized
      if (!supabase) {
        console.error("Supabase client is not initialized");
        setSubmitStatus({
          type: "error",
          message: "Database connection not available"
        });
        return;
      }
      
      console.log("Attempting to insert data:", {
        part_type: formData.partType,
        material: formData.material,
        quantity: formData.quantity,
        complexity: formData.complexity,
        deadline: formData.deadline,
        quote_amount: totalPrice
      });
      
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          part_type: formData.partType,
          material: formData.material,
          quantity: formData.quantity,
          complexity: formData.complexity,
          deadline: formData.deadline,
          quote_amount: totalPrice
        })
        .select();
      
      if (error) {
        console.error("Error inserting into Supabase:", error);
        setSubmitStatus({
          type: "error",
          message: `Failed to save quote: ${error.message || JSON.stringify(error)}`
        });
      } else {
        console.log("Successfully inserted quote into Supabase:", data);
        setSubmitStatus({
          type: "success",
          message: "Quote submitted successfully! Your job request has been saved."
        });
      }
    } catch (err) {
      console.error("Exception during Supabase insert:", err);
      setSubmitStatus({
        type: "error",
        message: `An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`
      });
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                Smart Manufacturing Starts Here
              </h1>
              <p className="mt-6 text-lg text-slate-300">
                FactoryFlow helps manufacturers streamline operations, reduce costs, and deliver products faster with our intelligent factory management platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/quote" 
                  className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-6 py-3 text-base font-medium text-white transition-colors duration-200 ease-in-out"
                >
                  Get a Quote
                </Link>
                <Link 
                  href="/dashboard" 
                  className="bg-slate-700 hover:bg-slate-600 rounded-lg px-6 py-3 text-base font-medium text-white transition-colors duration-200 ease-in-out"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
            <div className="relative w-full md:w-96 h-80 md:h-96">
              <div className="absolute inset-0 bg-indigo-500 rounded-lg opacity-20 blur-xl"></div>
              <div className="relative z-10 w-full h-full rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center">
                <svg className="w-40 h-40 text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 10H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14H13" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Streamline Your Manufacturing Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.75 12L10.58 14.83L16.25 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Instant Quotes
              </h3>
              <p className="text-slate-600">
                Get accurate manufacturing quotes in seconds, not days. Our advanced algorithms calculate costs based on materials, complexity, and timeline.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.6947 13.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.6947 16.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.9955 13.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.9955 16.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.29431 13.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Smart Scheduling
              </h3>
              <p className="text-slate-600">
                Optimize your production pipeline with AI-powered scheduling that maximizes equipment utilization and minimizes downtime.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V7.99" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Real-time Insights
              </h3>
              <p className="text-slate-600">
                Monitor your production process with live dashboards showing active jobs, resource allocation, and production efficiency metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Factory?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Join hundreds of manufacturers using FactoryFlow to streamline operations, reduce costs, and deliver products faster.
          </p>
          <Link 
            href="/quote" 
            className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-8 py-4 text-lg font-medium text-white transition-colors duration-200 ease-in-out inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}

// Move the current quote tool code from this page to a new file: /src/app/quote/page.tsx
// - Keep all state and logic intact
// - After moving, replace this file with a clean landing page (we'll build it next)





