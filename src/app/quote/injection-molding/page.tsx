import { Suspense } from 'react';
import { QuoteFormWrapper, InjectionMoldingForm } from '@/components/quotes';
import Loading from '@/components/Loading';

export default function InjectionMoldingPage() {
  return (
    <QuoteFormWrapper 
      title="Injection Molding Quote" 
      description="Get an accurate quote for your injection molding project"
    >
      <Suspense fallback={<Loading />}>
        <InjectionMoldingForm />
      </Suspense>
    </QuoteFormWrapper>
  );
} 