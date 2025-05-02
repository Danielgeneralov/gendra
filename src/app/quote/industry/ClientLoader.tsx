"use client";

import dynamic from "next/dynamic";

// Dynamically import the actual UI with ssr: false
const IndustryQuotePage = dynamic(() => import("./client"), {
  ssr: false,
});

export default function ClientLoader() {
  return <IndustryQuotePage />;
}
