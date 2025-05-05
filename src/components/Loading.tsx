export default function Loading() {
  return (
    <div className="w-full">
      <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300 mb-8">
        <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Loading Quote Form...</h2>
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A6FA6]"></div>
        </div>
      </div>
    </div>
  );
} 