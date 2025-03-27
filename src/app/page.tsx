import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen w-full flex items-center justify-center relative px-8 md:px-12 py-16 md:py-24 bg-gradient-to-br from-indigo-900 via-blue-800 to-black overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-8 animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-300">
            Quote and schedule jobs <span className="text-blue-400">10x faster</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mx-auto mb-12 max-w-3xl animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-600">
            FactoryFlow helps fabrication shops eliminate spreadsheets and streamline their workflow
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-900">
            <Link 
              href="/quote" 
              className="bg-blue-500 hover:bg-blue-400 transition-colors duration-300 rounded-lg px-8 py-4 text-lg font-medium text-white shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all"
            >
              Try the Quoting Tool
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-transparent hover:bg-white/10 border border-white/30 transition-colors duration-300 rounded-lg px-8 py-4 text-lg font-medium text-white hover:translate-y-[-2px] hover:shadow-md transition-all"
            >
              See the Dashboard
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="mt-20 flex flex-col items-center animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-1200">
            <p className="text-sm uppercase tracking-wider text-slate-300 mb-4">Trusted by manufacturing leaders</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div className="h-6 w-24 bg-white/10 rounded"></div>
              <div className="h-6 w-24 bg-white/10 rounded"></div>
              <div className="h-6 w-24 bg-white/10 rounded"></div>
              <div className="h-6 w-24 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
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

// Redesign the hero section with a modern SaaS gradient background:
// - Use a full-screen background with a dark-to-blue ocean-like gradient
//   e.g., from-indigo-900 via-blue-800 to-black or similar
// - Add a subtle glow or fade to the background (optional Tailwind blur or backdrop)
// - Ensure text color contrasts well (white or slate-100)
// - Keep content centered (flex, min-h-screen, etc.)
// - Add Tailwind transitions or AOS to fade in headline, subheadline, and button
// - Stop after applying the background and animation — do not touch the rest of the page









