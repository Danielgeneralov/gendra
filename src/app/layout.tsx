import type { Metadata, Viewport } from "next";
import "./globals.css";
import { HeaderClient } from "./components/HeaderClient";
import { ClientProvider } from "@/context/ClientProvider";
import { Inter } from 'next/font/google';
import StructuredData from "@/components/SEO/StructuredData";

// Initialize fonts
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Define viewport (separate from metadata)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A1828"
};

export const metadata: Metadata = {
  title: "AI Quoting Software for Manufacturers | Gendra",
  description: "Automate quoting, scheduling, and RFQ workflows using Gendra AI. Save time and win more business.",
  keywords: "manufacturing software, quoting automation, AI manufacturing, metal fabrication software",
  alternates: {
    canonical: 'https://www.gogendra.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.gogendra.com',
    siteName: 'Gendra',
    title: 'AI Quoting Software for Manufacturers | Gendra',
    description: 'Automate quoting, scheduling, and RFQ workflows using Gendra AI. Save time and win more business.',
    images: [
      {
        url: 'https://www.gogendra.com/og-images/default.jpg',
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
    images: ['https://www.gogendra.com/og-images/default.jpg'],
    creator: '@gendra_ai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization structured data
const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Gendra",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "AI-powered quoting and manufacturing workflow automation platform for fabrication shops and manufacturing companies",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127"
  },
  "author": {
    "@type": "Organization",
    "name": "Gendra",
    "url": "https://www.gogendra.com",
    "logo": "https://www.gogendra.com/logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        <StructuredData data={organizationStructuredData} />
        <ClientProvider>
          <HeaderClient />
          <main className="w-full">
            {children}
          </main>
        </ClientProvider>
      </body>
    </html>
  );
}



