"use client";

import { ScrollAnimation } from "./components/ScrollAnimation";
import { MotionButton } from "./components/MotionButton";
import { MotionCard } from "./components/MotionCard";
import { ParallaxHero } from "./components/ParallaxHero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax Effects */}
      <ParallaxHero />

      {/* How It Works Section */}
      <section className="py-48 px-8 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <ScrollAnimation delay={0.1}>
              <div className="w-full">
                <h2 className="text-5xl font-light tracking-tight text-white mb-6">
                  How Gendra Works
                </h2>
                <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
                  We combine AI and real-time data to transform job shops into intelligent, responsive operations.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-300">AI-powered quoting that analyzes materials, labor, and capacity</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-300">Dynamic scheduling that adapts to real-time production changes</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-4 mt-1">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-300">Decision intelligence that optimizes factory performance</p>
                  </li>
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Feature Tiles Section */}
      <section className="py-48 px-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimation>
            <h2 className="text-5xl font-light tracking-tight text-white text-center mb-12 max-w-3xl mx-auto leading-relaxed">
              The Complete Factory Operating System
            </h2>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation delay={0.1}>
              <MotionCard
                variant="feature"
                icon={
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 16.5m14.8-1.2c.7.669 1.2 1.535 1.2 2.5s-.5 1.831-1.2 2.5c-.7.669-1.667 1.2-2.5 1.2H6.7c-.833 0-1.8-.531-2.5-1.2-.7-.669-1.2-1.535-1.2-2.5s.5-1.831 1.2-2.5c.7-.669 1.667-1.2 2.5-1.2h9.6c.833 0 1.8.531 2.5 1.2z" />
                  </svg>
                }
                title="Intelligent Quoting"
                description="Analyze custom job requirements and generate accurate quotes in minutes with AI that learns from your production data."
              />
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.2}>
              <MotionCard
                variant="feature"
                icon={
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                  </svg>
                }
                title="Dynamic Scheduling"
                description="Optimize your shop floor with scheduling that adapts to changing conditions, constraints, and priorities in real-time."
              />
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.3}>
              <MotionCard
                variant="feature"
                icon={
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                  </svg>
                }
                title="Real-Time Intelligence"
                description="Turn your data into actions with continuous monitoring and AI decision support to optimize operations across your facility."
              />
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-indigo-950 border-t border-slate-700">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimation>
            <h2 className="text-5xl font-light tracking-tight text-white mb-6 max-w-3xl mx-auto">
              Ready for the Future of Manufacturing?
            </h2>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.15}>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join forward-thinking manufacturers using Gendra to make smarter decisions, optimize operations, and build resilient production systems.
            </p>
          </ScrollAnimation>
          
          <ScrollAnimation delay={0.25}>
            <MotionButton href="/quote" primary={true}>
              Start with Gendra
            </MotionButton>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
}















