import RFQParserTabs from "@/components/RFQParserTabs";

export const metadata = {
  title: "Gendra – RFQ Parser",
  description: "Submit RFQs and extract structured manufacturing data using Groq."
};

/**
 * Parse RFQ Page
 * Provides interfaces for uploading and parsing RFQs with Groq
 */
export default function ParseRFQPage() {
  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Gendra RFQ Parser</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload or paste any manufacturing RFQ and we&apos;ll extract key data like material,
            dimensions, and industry with cutting-edge AI.
          </p>
        </div>
        
        <RFQParserTabs />
        
        <div className="mt-12 border-t border-gray-800 pt-8">
          <h2 className="text-xl font-semibold text-white mb-4">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-5 rounded-lg">
              <div className="text-blue-400 font-bold text-lg mb-2">1. Upload or paste</div>
              <p className="text-gray-400 text-sm">
                Upload a PDF/Excel file or paste text directly from your RFQ document.
              </p>
            </div>
            <div className="bg-gray-800/50 p-5 rounded-lg">
              <div className="text-blue-400 font-bold text-lg mb-2">2. Review & edit</div>
              <p className="text-gray-400 text-sm">
                Check and edit the extracted text before submitting for parsing.
              </p>
            </div>
            <div className="bg-gray-800/50 p-5 rounded-lg">
              <div className="text-blue-400 font-bold text-lg mb-2">3. Get structured data</div>
              <p className="text-gray-400 text-sm">
                Our AI extracts key details and sends you to the right quoting template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 