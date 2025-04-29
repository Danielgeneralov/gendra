"use client";

import { useState } from "react";
import { supabase } from "../supabase";
import { MotionButton } from "./MotionButton";

export const SupabaseTest = () => {
  const [testStatus, setTestStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setTestStatus("Testing Supabase connection...");
    
    try {
      // Check if Supabase client exists
      if (!supabase) {
        setTestStatus("Error: Supabase client is null - check your environment variables");
        return;
      }
      
      // First, check if we can connect to Supabase
      try {
        const { data, error } = await supabase.from('quote_leads').select('count').limit(1);
        
        if (error) {
          setTestStatus(`Error accessing quote_leads table: ${error.message}`);
          return;
        }
        
        setTestStatus("Successfully connected to quote_leads table!");
        
        // Try to insert a test record
        const { data: insertData, error: insertError } = await supabase
          .from('quote_leads')
          .insert({
            email: `test-${Date.now()}@example.com`,
            quote_amount: 123.45,
            created_at: new Date().toISOString(),
            is_contacted: false,
            notes: "Test record"
          })
          .select();
        
        if (insertError) {
          setTestStatus(`Error inserting test record: ${insertError.message}`);
        } else {
          setTestStatus(`Success! Test record inserted with ID: ${insertData?.[0]?.id || 'unknown'}`);
        }
      } catch (err) {
        setTestStatus(`Exception during Supabase test: ${err instanceof Error ? err.message : String(err)}`);
      }
    } catch (err) {
      setTestStatus(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200 max-w-md">
      <h2 className="text-lg font-bold mb-4">Supabase Connection Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-slate-500">
          Click the button below to test your Supabase connection and try to insert a test record.
        </p>
      </div>
      
      <MotionButton
        onClick={testSupabaseConnection}
        primary
        disabled={isLoading}
        className="w-full mb-4"
      >
        {isLoading ? "Testing..." : "Test Supabase Connection"}
      </MotionButton>
      
      {testStatus && (
        <div className={`p-3 rounded-md ${
          testStatus.includes("Success") ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
        }`}>
          <p className="text-sm whitespace-pre-wrap">{testStatus}</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-slate-400">
        <p>
          <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 
            `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10)}...` : 
            'Not set'
          }
        </p>
        <p>
          <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
            `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : 
            'Not set'
          }
        </p>
      </div>
    </div>
  );
}; 