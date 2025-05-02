import dynamic from "next/dynamic";
import { Suspense } from "react";

const IndustryQuotePage = dynamic(() => import("./client"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <IndustryQuotePage />
    </Suspense>
  );
}
