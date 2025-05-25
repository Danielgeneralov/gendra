"use client";

import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { ParallaxHero } from "./components/ParallaxHero";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { GendraPillarsSection } from "./components/GendraPillarsSection";
import { InsightsMetrics } from "./components/InsightsMetrics";
import { IndustryPortalSection } from "./components/IndustryPortalSection";
import { PartViewerIntegration } from "./components/PartViewerIntegration";
import { FinalCTASection } from "./components/FinalCTASection";
import { FloatingCTAComponent } from "./components/FloatingCTAComponent";
import { DemoModal } from "./components/DemoModal";

export default function Home() {
  // State for demo modal
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [productionScheduled, setProductionScheduled] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  // Refs for scroll animations
  const fileUploadRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const productionRef = useRef<HTMLDivElement>(null);
  const stickyCTAObserverRef = useRef<HTMLDivElement>(null);

  // Animation for file upload is in view
  const isFileUploadInView = useInView(fileUploadRef, {
    once: true,
    amount: 0.7,
  });

  // Animation for quote is in view with delay after file upload
  const isQuoteInView = useInView(quoteRef, { once: true, amount: 0.7 });

  // Animation for production is in view with delay after quote
  const isProductionInView = useInView(productionRef, {
    once: true,
    amount: 0.7,
  });

  // Detect browser environment for hydration safety
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Set up intersection observer for sticky CTA
  useEffect(() => {
    // Only run in browser environment
    if (!isBrowser || !stickyCTAObserverRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA when observer is 50% through the page
        setShowStickyCTA(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(stickyCTAObserverRef.current);

    return () => {
      if (stickyCTAObserverRef.current) {
        observer.unobserve(stickyCTAObserverRef.current);
      }
    };
  }, [stickyCTAObserverRef, isBrowser]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);

      // Simulate quote generation after upload
      setTimeout(() => {
        setQuoteGenerated(true);

        // Simulate production scheduling after quote
        setTimeout(() => {
          setProductionScheduled(true);
        }, 1000);
      }, 800);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);

      // Simulate quote generation after upload
      setTimeout(() => {
        setQuoteGenerated(true);

        // Simulate production scheduling after quote
        setTimeout(() => {
          setProductionScheduled(true);
        }, 1000);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Parallax Effects */}
      <ParallaxHero />

      {/* How Gendra Works - Animated Walkthrough */}
      <HowItWorksSection 
        fileUploadRef={fileUploadRef}
        quoteRef={quoteRef}
        productionRef={productionRef}
        stickyCTAObserverRef={stickyCTAObserverRef}
        isFileUploadInView={isFileUploadInView}
        isQuoteInView={isQuoteInView}
        isProductionInView={isProductionInView}
      />

      {/* Gendra Feature Pillars Section */}
      <GendraPillarsSection />

      {/* GSAP Animated Insights Section */}
      <InsightsMetrics />

      {/* 3D Part Viewer Section */}
      <PartViewerIntegration />

      {/* Built for You Section - Custom Quote Portals */}
      <IndustryPortalSection />

      {/* Final CTA Section */}
      <FinalCTASection />

      {/* Sticky Floating CTA */}
      <div
        className="sticky-cta-observer absolute top-1/2"
        ref={stickyCTAObserverRef}
      ></div>

      {/* Only render the sticky CTA in the browser to prevent hydration errors */}
      {isBrowser && <FloatingCTAComponent showStickyCTA={showStickyCTA} />}

      {/* Demo Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
} 