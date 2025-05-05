import { Suspense } from 'react';
import { QuoteFormWrapper } from '@/components/quotes';
import Loading from '@/components/Loading';

// Import the client component directly but use it inside a Suspense boundary
import MetalFabricationForm from '@/components/quotes/MetalFabricationForm';

export default function MetalFabricationPage() {
  return (
    <QuoteFormWrapper 
      title="Metal Fabrication Quote" 
      description="Get an accurate quote for your metal fabrication project"
    >
      <Suspense fallback={<Loading />}>
        <MetalFabricationForm />
      </Suspense>
    </QuoteFormWrapper>
  );
} 