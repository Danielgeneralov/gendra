import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Gendra',
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-[#4A6FA6] mb-6">404</h1>
        <h2 className="text-3xl font-semibold text-[#F0F4F8] mb-4">Page Not Found</h2>
        <p className="text-lg text-[#94A3B8] mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium transition-colors hover:bg-blue-700"
          >
            Return Home
          </Link>
          
          <div className="block">
            <Link
              href="/quote"
              className="inline-block mt-4 text-[#94A3B8] hover:text-[#F0F4F8] transition-colors"
            >
              Get a Quote →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 