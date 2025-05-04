"use client";

import { useState } from "react";
import { supabase } from "../supabase";
import { MotionButton } from "./MotionButton";

export const SupabaseTest = () => {
  const [testStatus, setTestStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setTestStatus("Testing Supabase connection...");

    try {
      if (!supabase?.from) {
        setTestStatus("❌ Supabase client is null or misconfigured. Check your env vars.");
        return;
      }

      // 🔍 Step 1: Simple select test
      const { error: selectError } = await supabase
        .from("quote_leads")
        .select("id")
        .limit(1);

      if (selectError) {
        setTestStatus(`❌ Error reading from 'quote_leads': ${selectError.message}`);
        return;
      }

      // ✅ Step 2: Insert test record
      const { data: insertData, error: insertError } = await supabase
        .from("quote_leads")
        .insert({
          email: `test-${Date.now()}@example.com`,
          quote_amount: 123.45,
          created_at: new Date().toISOString(),
          is_contacted: false,
          notes: "🔧 Test record from SupabaseTest",
        })
        .select();

      if (insertError) {
        setTestStatus(`⚠️ Error inserting test record: ${insertError.message}`);
      } else {
        const insertedId = insertData?.[0]?.id ?? "unknown";
        setTestStatus(`✅ Success! Test record inserted with ID: ${insertedId}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestStatus(`❌ Unexpected error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const shortEnvValue = (value: string | undefined, len = 8) =>
    value ? `${value.substring(0, len)}...` : "Not set";

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 max-w-md">
      <h2 className="text-lg font-bold mb-4">🔌 Supabase Connection Test</h2>

      <p className="text-sm text-slate-500 mb-4">
        Click the button below to verify your Supabase connection and attempt a test insert.
      </p>

      <MotionButton
        onClick={testSupabaseConnection}
        primary
        disabled={isLoading}
        className="w-full mb-4"
      >
        {isLoading ? "Testing..." : "Test Supabase Connection"}
      </MotionButton>

      {testStatus && (
        <div
          className={`p-3 rounded-md whitespace-pre-wrap text-sm ${
            testStatus.includes("Success")
              ? "bg-green-50 text-green-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {testStatus}
        </div>
      )}

      <div className="mt-4 text-xs text-slate-400 space-y-1">
        <p>
          <strong>Supabase URL:</strong> {shortEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)}
        </p>
        <p>
          <strong>Supabase Key:</strong> {shortEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}
        </p>
      </div>
    </div>
  );
};
