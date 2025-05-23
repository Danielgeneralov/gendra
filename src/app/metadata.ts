import { Metadata } from 'next';

// Custom metadata for the homepage
export const metadata: Metadata = {
  title: 'AI Quoting Software for Manufacturers | Gendra',
  description: 'Automate quoting, scheduling, and RFQ workflows using Gendra AI. Save time and win more business.',
  keywords: 'AI quoting software, manufacturing automation, metal fabrication software, CNC quoting, sheet metal automation, RFQ processing, manufacturing OS',
  alternates: {
    canonical: 'https://www.gogendra.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.gogendra.com',
    siteName: 'Gendra',
    title: 'AI Quoting Software for Manufacturers | Gendra',
    description: 'Automate quoting, scheduling, and RFQ workflows using Gendra AI.',
    images: [
      {
        url: 'https://www.gogendra.com/og-images/homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'Gendra - AI Quoting Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gendra – AI Quoting Platform',
    description: 'Quote faster. Grow smarter.',
    images: ['https://www.gogendra.com/og-images/homepage.jpg'],
    creator: '@gendra_ai',
  },
}; 