"use client";

import { useProtectedPage } from "@/lib/hooks/useProtectedPage";
import OnboardingWizard from "./OnboardingWizard";

export default function OnboardingPage() {
  // Protect this route - only authenticated users can access
  useProtectedPage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#161625] to-[#1c1b2a] overflow-hidden relative">
      {/* Subtle glow effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-800/10 rounded-full filter blur-3xl pointer-events-none"></div>
      
      {/* Content container */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          Customize Your Quoting Portal
        </h1>
        <p className="text-slate-300 mb-10 max-w-2xl">
          Set up your preferences to tailor the quoting experience to your industry and requirements.
        </p>
        
        {/* The actual wizard component with enhanced styling */}
        <OnboardingWizard />
      </div>
    </div>
  );
} 