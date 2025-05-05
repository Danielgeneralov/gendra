import { Suspense } from 'react';
import { QuoteFormWrapper, CNCMachiningForm } from '@/components/quotes';
import Loading from '@/components/Loading';

export default function CNCMachiningPage() {
  return (
    <QuoteFormWrapper 
      title="CNC Machining Quote" 
      description="Get an accurate quote for your CNC machining project"
    >
      <Suspense fallback={<Loading />}>
        <CNCMachiningForm />
      </Suspense>
    </QuoteFormWrapper>
  );
} 