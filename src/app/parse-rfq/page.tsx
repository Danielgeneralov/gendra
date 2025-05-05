import RFQUploader from "@/components/RFQUploader";

export const metadata = {
  title: "Gendra – RFQ Parser",
  description: "Submit raw RFQs and extract structured manufacturing data instantly using Groq."
};

export default function ParseRFQPage() {
  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Gendra RFQ Parser</h1>
          <p className="text-gray-400">
            Paste in any manufacturing RFQ and we&apos;ll structure it automatically.
          </p>
        </div>
        
        <RFQUploader />
      </div>
    </main>
  );
} 