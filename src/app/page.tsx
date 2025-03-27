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

      {/* Feature Tiles Section */}
      <section className="py-16 px-8 bg-gradient-to-br from-indigo-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Streamline Your Manufacturing Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 p-8 rounded-xl shadow-md border border-slate-700 transition-all duration-300 hover:shadow-lg hover:bg-slate-800/70">
              <div className="flex justify-center mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 16.5m14.8-1.2c.7.669 1.2 1.535 1.2 2.5s-.5 1.831-1.2 2.5c-.7.669-1.667 1.2-2.5 1.2H6.7c-.833 0-1.8-.531-2.5-1.2-.7-.669-1.2-1.535-1.2-2.5s.5-1.831 1.2-2.5c.7-.669 1.667-1.2 2.5-1.2h9.6c.833 0 1.8.531 2.5 1.2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quote Smarter</h3>
              <p className="text-slate-300">Generate accurate quotes in seconds with our AI-powered pricing engine that accounts for materials, labor, and timeline.</p>
            </div>
            
            <div className="bg-slate-800/50 p-8 rounded-xl shadow-md border border-slate-700 transition-all duration-300 hover:shadow-lg hover:bg-slate-800/70">
              <div className="flex justify-center mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Schedule Efficiently</h3>
              <p className="text-slate-300">Eliminate production bottlenecks with intelligent scheduling that optimizes your factory's capacity and resource allocation.</p>
            </div>
            
            <div className="bg-slate-800/50 p-8 rounded-xl shadow-md border border-slate-700 transition-all duration-300 hover:shadow-lg hover:bg-slate-800/70">
              <div className="flex justify-center mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Deliver On Time</h3>
              <p className="text-slate-300">Track production progress in real-time and anticipate delays before they happen, ensuring consistent on-time delivery.</p>
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















