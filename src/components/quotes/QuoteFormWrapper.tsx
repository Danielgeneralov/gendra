import { ReactNode } from 'react';
import Breadcrumbs from '../Breadcrumbs';

type QuoteFormWrapperProps = {
  title: string;
  description?: string;
  industrySlug?: string;
  children: ReactNode;
};

export default function QuoteFormWrapper({ 
  title, 
  description = "Get an accurate quote for your project", 
  industrySlug,
  children 
}: QuoteFormWrapperProps) {
  // Create breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Quote', href: '/quote' }
  ];
  
  // Add industry-specific breadcrumb if available
  if (industrySlug) {
    breadcrumbItems.push({
      label: title,
      href: `/quote/${industrySlug}`
    });
  }
  
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs 
          items={breadcrumbItems}
          className="text-[#CBD5E1] mb-6" 
        />
        
        <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">{title}</h1>
        <p className="text-lg text-[#CBD5E1] mb-8">
          {description}
        </p>
        
        {children}
      </div>
    </div>
  );
} 