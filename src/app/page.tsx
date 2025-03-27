"use client";

import { useState, FormEvent, useEffect } from "react";
import { supabase } from "./supabase";

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
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus({ type: null, message: "" });
    
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
          message: "Quote successfully saved to database"
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
    <div className="flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quote a Job</h1>
          <p className="mt-2 text-sm text-slate-500">Fill out the form below to get an instant quote for your job.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="partType" className="block text-sm font-medium text-slate-700">
              Part Type
            </label>
            <input
              type="text"
              id="partType"
              name="partType"
              placeholder="Enter part type"
              value={formData.partType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
              required
            />
          </div>
          
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-slate-700">
              Material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              placeholder="Enter material"
              value={formData.material}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
              required
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="1"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
              required
            />
          </div>
          
          <div>
            <label htmlFor="complexity" className="block text-sm font-medium text-slate-700">
              Complexity
            </label>
            <select
              id="complexity"
              name="complexity"
              value={formData.complexity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
              required
            >
              <option value="">Select complexity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-700">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
              required
            />
          </div>
          
          <div className="pt-6 border-t border-slate-200">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out"
            >
              Get Quote
            </button>
          </div>
        </form>
        
        {submitStatus.type && (
          <div className={`mt-4 p-3 rounded-md ${
            submitStatus.type === "success" 
              ? "bg-green-50 border border-green-100 text-green-800" 
              : "bg-red-50 border border-red-100 text-red-800"
          }`}>
            {submitStatus.message}
          </div>
        )}
        
        {quoteResult !== null && (
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-md">
            <h2 className="text-lg font-medium text-indigo-800">Your Quote</h2>
            <p className="mt-2 text-3xl font-bold text-indigo-900">{formatCurrency(quoteResult)}</p>
            <p className="mt-1 text-sm text-indigo-600">
              Based on {formData.quantity} units of {formData.complexity || "standard"} complexity
            </p>
          </div>
        )}
      </div>
      
      {/* Recent Quotes Section */}
      <div className="max-w-2xl w-full mt-8 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Quotes</h2>
        
        {isLoading ? (
          <div className="text-center py-4 text-slate-500">Loading recent quotes...</div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-4 text-slate-500">No quotes found. Create your first one!</div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Part Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quote
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {job.part_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {job.material}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {job.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {formatCurrency(job.quote_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// PART 4 — Show recent quotes from Supabase
// - Import supabase client
// - Add useEffect to fetch the latest 5 jobs from the "jobs" table, ordered by created_at DESC
// - Store them in a state variable like `jobs`
// - Below the form, add a section called "Recent Quotes"
// - Display a clean list: part_type, material, quantity, quote_amount
// - Use Tailwind to make it simple and readable
// - Stop after rendering the list. We'll add filtering or delete buttons later.



