import { Suspense } from 'react';
import { QuoteFormWrapper } from '@/components/quotes';
import Loading from '@/components/Loading';

// Import the client component directly but use it inside a Suspense boundary
import ElectronicsAssemblyForm from '@/components/quotes/ElectronicsAssemblyForm';

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