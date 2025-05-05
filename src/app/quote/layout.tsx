"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isIndustryPage = pathname.split("/").length > 2;
  
  return (
    <div>
      {/* Breadcrumbs for industry pages */}
      {isIndustryPage && (
        <div className="bg-[#050C1C] border-b border-[#1E293B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center text-sm text-[#94A3B8]">
              <Link href="/quote" className="hover:text-[#E2E8F0]">Quote</Link>
              <span className="mx-2">/</span>
              <span className="text-[#E2E8F0]">{pathname.split("/").pop()?.replace(/-/g, " ")}</span>
            </div>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
} 