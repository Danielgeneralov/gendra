import { Metadata } from 'next';

// Custom metadata for the quotes page
export const metadata: Metadata = {
  title: 'Get Manufacturing Quotes in Seconds | Gendra',
  description: 'Upload your RFQ or enter specifications to receive instant, accurate manufacturing quotes. AI-powered for speed and precision.',
  keywords: 'manufacturing quotes, RFQ automation, instant quotes, metal fabrication quotes, CNC machining quotes, sheet metal pricing, injection molding quotes',
  alternates: {
    canonical: 'https://www.gogendra.com/quote',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.gogendra.com/quote',
    siteName: 'Gendra',
    title: 'Get Manufacturing Quotes in Seconds | Gendra',
    description: 'Upload your RFQ or enter specifications to receive instant, accurate manufacturing quotes.',
    images: [
      {
        url: 'https://www.gogendra.com/og-images/quote.jpg',
        width: 1200,
        height: 630,
        alt: 'Gendra - Manufacturing Quote Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered Manufacturing Quotes | Gendra',
    description: 'Get instant quotes for your manufacturing projects',
    images: ['https://www.gogendra.com/og-images/quote.jpg'],
    creator: '@gendra_ai',
  },
}; 