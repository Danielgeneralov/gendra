import { Suspense } from 'react';
import { QuoteFormWrapper, SheetMetalForm } from '@/components/quotes';
import Loading from '@/components/Loading';

export default function SheetMetalPage() {
  return (
    <QuoteFormWrapper 
      title="Sheet Metal Quote" 
      description="Get an accurate quote for your sheet metal fabrication project"
    >
      <Suspense fallback={<Loading />}>
        <SheetMetalForm />
      </Suspense>
    </QuoteFormWrapper>
  );
} 