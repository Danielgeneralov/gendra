import { Suspense } from 'react';
import { QuoteFormWrapper } from '@/components/quotes';
import Loading from '@/components/Loading';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { industryFaqs } from '@/lib/industryFaqs';
import StructuredData from '@/components/SEO/StructuredData';
import FAQSection from '@/components/FAQSection';

// Import the client components directly but use them inside a Suspense boundary
import MetalFabricationForm from '@/components/quotes/MetalFabricationForm';
import SheetMetalForm from '@/components/quotes/SheetMetalForm';
import CNCMachiningForm from '@/components/quotes/CNCMachiningForm';
import ElectronicsAssemblyForm from '@/components/quotes/ElectronicsAssemblyForm';
import InjectionMoldingForm from '@/components/quotes/InjectionMoldingForm';

// Define the industry metadata map
interface IndustryData {
  title: string;
  pageTitle: string;
  description: string;
  component: React.ReactNode;
  keywords?: string;
}

const industryMap: Record<string, IndustryData> = {
  'metal-fabrication': {
    title: 'AI Quoting for Metal Fabrication | Gendra',
    pageTitle: 'Metal Fabrication Quote',
    description: 'Automate quotes for metal shops with Gendra\'s precision AI. Get instant pricing for your metal fabrication projects with our intelligent quoting system.',
    keywords: 'metal fabrication quotes, metal fabrication pricing, metal fabrication automation, metal shop quoting, metal coating pricing',
    component: <MetalFabricationForm />,
  },
  'sheet-metal': {
    title: 'Sheet Metal Fabrication Quoting | Gendra',
    pageTitle: 'Sheet Metal Quote',
    description: 'Generate accurate quotes for sheet metal parts with AI precision and speed. Our automated platform helps sheet metal fabricators quote faster and win more business.',
    keywords: 'sheet metal quotes, sheet metal pricing, sheet metal fabrication, automated sheet metal quoting',
    component: <SheetMetalForm />,
  },
  'cnc-machining': {
    title: 'CNC Machining Quote Generator | Gendra',
    pageTitle: 'CNC Machining Quote',
    description: 'Get instant quotes for CNC machined parts. Accurate pricing in seconds for your precision machining projects with our AI-powered quoting system.',
    keywords: 'CNC machining quotes, CNC pricing, machining cost estimation, automated CNC quotes',
    component: <CNCMachiningForm />,
  },
  'electronics-assembly': {
    title: 'AI Quoting for PCB & Electronics Assembly | Gendra',
    pageTitle: 'Electronics Assembly Quote',
    description: 'Custom quoting engine for EMS and PCB manufacturers. Streamline your RFQ process with automated quotes for electronics assembly projects.',
    keywords: 'electronics assembly quotes, PCB assembly pricing, PCBA quoting, electronics manufacturing quotes',
    component: <ElectronicsAssemblyForm />,
  },
  'injection-molding': {
    title: 'RFQ Automation for Injection Molding | Gendra',
    pageTitle: 'Injection Molding Quote',
    description: 'Streamline plastic mold quoting with AI-driven forms. Instant pricing for your injection molded parts with accurate tooling and production costs.',
    keywords: 'injection molding quotes, plastic molding pricing, mold cost calculator, injection molding automation',
    component: <InjectionMoldingForm />,
  },
};

// Generate metadata for the dynamic route
export async function generateMetadata(
  { params }: { params: { industry: string } }
): Promise<Metadata> {
  const industry = params.industry;
  
  // Check if this is a valid industry
  if (!industryMap[industry]) {
    return {
      title: 'AI Quoting Software | Gendra',
      description: 'Quote smarter with Gendra\'s AI-powered manufacturing OS.',
      alternates: {
        canonical: 'https://www.gogendra.com/quote',
      }
    };
  }
  
  const data = industryMap[industry];
  
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: {
      canonical: `https://www.gogendra.com/quote/${industry}`,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `https://www.gogendra.com/quote/${industry}`,
      siteName: 'Gendra',
      title: data.title,
      description: data.description,
      images: [
        {
          url: `https://www.gogendra.com/og-images/${industry}.jpg`,
          width: 1200,
          height: 630,
          alt: `${data.pageTitle} - Gendra`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [`https://www.gogendra.com/og-images/${industry}.jpg`],
      creator: '@gendra_ai',
    },
  };
}

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const industry = params.industry;
  
  if (!industryMap[industry]) {
    notFound();
  }
  
  const data = industryMap[industry];
  const industryFaqList = industryFaqs[industry] || [];
  
  // Generate service structured data
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.pageTitle,
    "description": data.description,
    "provider": {
      "@type": "Organization",
      "name": "Gendra",
      "url": "https://www.gogendra.com"
    },
    "serviceType": industry.replace("-", " "),
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    }
  };
  
  return (
    <>
      <StructuredData data={serviceData} />
      
      <QuoteFormWrapper 
        title={data.pageTitle} 
        description={data.description}
        industrySlug={industry}
      >
        <Suspense fallback={<Loading />}>
          {data.component}
        </Suspense>
        
        {/* Add FAQ section */}
        {industryFaqList.length > 0 && (
          <FAQSection 
            faqs={industryFaqList} 
            title={`Frequently Asked Questions About ${data.pageTitle}`} 
          />
        )}
      </QuoteFormWrapper>
    </>
  );
} 