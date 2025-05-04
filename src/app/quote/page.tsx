// src/app/quote/page.tsx
"use client";

import { Suspense } from "react";
import Client from "./client";

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <Client />
    </Suspense>
  );
}
