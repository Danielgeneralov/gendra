"use client";
import dynamic from "next/dynamic";

const IndustryQuotePage = dynamic(() => import("./client"), { ssr: false });

export default function ClientLoader() {
  return <IndustryQuotePage />;
}
