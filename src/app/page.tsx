import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative px-8 md:px-12 py-32 bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-950 overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white mb-8 animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-300">
            Quote and schedule jobs <span className="text-blue-500">10x faster</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mx-auto mb-12 max-w-3xl leading-relaxed animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-600">
            FactoryFlow helps fabrication shops eliminate spreadsheets and streamline their workflow
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-900">
            <Link 
              href="/quote" 
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg px-8 py-4 text-lg font-medium text-white shadow-lg hover:translate-y-[-2px] hover:shadow-xl transition-all"
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
            <p className="text-sm uppercase tracking-wider text-slate-100 mb-4">Trusted by manufacturing leaders</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              <div className="h-6 w-24 bg-white/10 rounded"></div>
              <div className="h-6 w-24 bg-white/10 rounded"></div>
              <div className="h-6 w-24 bg-white/10 rounded"></div>
              <div className="h-6 w-24 bg-white/10 rounded"></div>
            </div>
          </div>
          
          {/* Hero visual */}
          <div className="mt-16 w-full flex justify-center" data-aos="fade-up">
            <img 
              src="/factoryflow_trial_img.svg" 
              alt="FactoryFlow Manufacturing Dashboard" 
              className="w-[90%] max-w-4xl h-auto transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-48 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards">
              <h2 className="text-5xl font-light tracking-tight text-slate-900 mb-6">
                How FactoryFlow Works
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-xl">
                We streamline quoting and scheduling with automation your team will actually use.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="mr-4 mt-1">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600">Streamlined quoting process that saves hours per quote</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600">Intelligent scheduling that prevents bottlenecks</p>
                </li>
                <li className="flex items-start">
                  <div className="mr-4 mt-1">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600">Real-time production tracking for on-time delivery</p>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-300">
              <div className="h-[400px] bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500 text-xl">Visual Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Tiles Section */}
      <section className="py-48 px-8 border-t border-slate-100 bg-gradient-to-b from-pink-100 via-white to-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-light tracking-tight text-slate-900 text-center mb-12 max-w-3xl mx-auto leading-relaxed animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards">
            Streamline Your Manufacturing Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:bg-white animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-300">
              <div className="flex justify-center mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 16.5m14.8-1.2c.7.669 1.2 1.535 1.2 2.5s-.5 1.831-1.2 2.5c-.7.669-1.667 1.2-2.5 1.2H6.7c-.833 0-1.8-.531-2.5-1.2-.7-.669-1.2-1.535-1.2-2.5s.5-1.831 1.2-2.5c.7-.669 1.667-1.2 2.5-1.2h9.6c.833 0 1.8.531 2.5 1.2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-slate-900 mb-4">Quote Smarter</h3>
              <p className="text-slate-600 leading-relaxed">Generate accurate quotes in seconds with our AI-powered pricing engine that accounts for materials, labor, and timeline.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:bg-white animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-600">
              <div className="flex justify-center mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-slate-900 mb-4">Schedule Efficiently</h3>
              <p className="text-slate-600 leading-relaxed">Eliminate production bottlenecks with intelligent scheduling that optimizes your factory&rsquo;s capacity and resource allocation.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:bg-white animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-900">
              <div className="flex justify-center mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              </div>
              <h3 className="text-2xl font-light tracking-tight text-slate-900 mb-4">Deliver On Time</h3>
              <p className="text-slate-600 leading-relaxed">Track production progress in real-time and anticipate delays before they happen, ensuring consistent on-time delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-4 sm:px-6 lg:px-8 border-t border-slate-100 bg-gradient-to-b from-pink-100 via-white to-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light tracking-tight text-slate-900 mb-6 max-w-3xl mx-auto animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards">
            Ready to Transform Your Factory?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-300">
            Join hundreds of manufacturers using FactoryFlow to streamline operations, reduce costs, and deliver products faster.
          </p>
          <div className="animate-[fadeIn_1.2s_ease-in-out] opacity-0 animation-fill-mode-forwards animation-delay-600">
            <Link 
              href="/quote" 
              className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-lg px-8 py-4 text-lg font-medium text-white inline-block hover:shadow-lg"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}















