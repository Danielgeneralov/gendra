"use client";

import { motion } from "framer-motion";
import { ScrollAnimation } from "./ScrollAnimation";
import dynamic from 'next/dynamic';

// Import the PartViewer with dynamic loading and no SSR
const PartViewer = dynamic(() => import('../../components/PartViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] bg-slate-900/60 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-slate-500">Loading 3D Viewer...</div>
    </div>
  ),
});

export const PartViewerIntegration = () => {
  return (
    <section className="py-24 px-8 bg-gradient-to-b from-[#0f0f1a] to-[#1c1b2a] border-t border-slate-700">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation>
          <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight text-white mb-4">
            Interactive Part Visualization
          </h2>
          <p className="text-xl text-slate-300 text-center mb-12 max-w-2xl mx-auto">
            Explore your manufacturing parts in real-time 3D before production.
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <ScrollAnimation delay={0.2}>
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <PartViewer />
              </div>
            </ScrollAnimation>
          </div>

          <div>
            <ScrollAnimation delay={0.3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-white mb-6">
                  Visualize Before Manufacturing
                </h3>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">3D Model Previews</h4>
                      <p className="text-slate-300">
                        Interact with your CAD models in the browser before sending to production.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Error Detection</h4>
                      <p className="text-slate-300">
                        Identify potential manufacturing issues before they cause delays.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">Interactive Feedback</h4>
                      <p className="text-slate-300">
                        Provide direct feedback on models to streamline the iteration process.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}; 