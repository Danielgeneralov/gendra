import { Suspense } from 'react';
import { QuoteFormWrapper, ElectronicsAssemblyForm } from '@/components/quotes';
import Loading from '@/components/Loading';

export default function ElectronicsAssemblyPage() {
  return (
    <QuoteFormWrapper 
      title="Electronics Assembly Quote" 
      description="Get an accurate quote for your electronics manufacturing project"
    >
      <Suspense fallback={<Loading />}>
        <ElectronicsAssemblyForm />
      </Suspense>
    </QuoteFormWrapper>
  );
} 