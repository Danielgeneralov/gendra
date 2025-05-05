import { Suspense } from 'react';
import { QuoteFormWrapper, MetalFabricationForm } from '@/components/quotes';
import Loading from '@/components/Loading';

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