"use client";
import { useAuth } from "@/context/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useProtectedPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      const path = window.location.pathname;
      router.push(`/signin?redirectedFrom=${encodeURIComponent(path)}`);
    }
  }, [loading, session, router]);
} 