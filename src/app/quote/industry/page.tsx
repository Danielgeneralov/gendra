"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load the client UI component
const IndustryQuotePage = dynamic(() => import("./client"), {
  ssr: false,
  loading: () => <div className="text-white text-center mt-10">Loading...</div>,
});

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <IndustryQuotePage />
    </Suspense>
  );
}
