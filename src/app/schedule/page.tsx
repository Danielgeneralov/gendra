"use client";

export default function SchedulePage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">Production Schedule</h1>
        <p className="text-lg text-[#CBD5E1] mb-8">
          Track and manage your manufacturing projects
        </p>
        
        <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="text-[#4A6FA6] text-4xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-[#E2E8F0] mb-2">Schedule Management Coming Soon</h2>
              <p className="text-[#94A3B8] mb-8 max-w-lg mx-auto">
                We're building a powerful scheduling tool to help you track production timelines, 
                manage manufacturing capacity, and optimize your workflow.
              </p>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up for Early Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
