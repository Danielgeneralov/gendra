"use client";

import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

// Direct connection to Supabase without using the shared client
export default function SupabaseDirectTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  
  const testDirectInsert = async () => {
    setLoading(true);
    setResult('Testing direct insert...');
    
    try {
      // Create Supabase client directly in this component
      const supabaseUrl = 'https://cpnbybkgniwshqavvnlz.supabase.co';
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbmJ5Ymtnbml3c2hxYXZ2bmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDg3MDEsImV4cCI6MjA1ODQyNDcwMX0.OXARQAInCNo8IX7qF2OjqABzDws6csfr8q4JzSZL6ec';
      
      if (!supabaseUrl || !supabaseKey) {
        setResult('Error: Missing Supabase credentials');
        return;
      }
      
      // Create a new client
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Try inserting a test record
      const { data, error } = await supabase
        .from('quote_leads')
        .insert({
          email: `test-${Date.now()}@example.com`,
          quote_amount: 99.99,
          created_at: new Date().toISOString(),
          is_contacted: false,
          notes: 'Direct test'
        })
        .select();
      
      if (error) {
        console.error('Insert error:', error);
        setResult(`❌ Error: ${error.message}`);
      } else {
        console.log('Success:', data);
        setResult(`✅ Success! Inserted record with ID: ${data[0]?.id || 'unknown'}`);
      }
    } catch (err) {
      console.error('Exception:', err);
      setResult(`❌ Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Direct Supabase Test</h1>
        <p className="mb-4 text-slate-600">
          This test bypasses the shared Supabase client and connects directly.
        </p>
        
        <button
          onClick={testDirectInsert}
          disabled={loading}
          className={`w-full py-2 px-4 rounded ${
            loading ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium transition-colors`}
        >
          {loading ? "Testing..." : "Test Direct Insert"}
        </button>
        
        {result && (
          <div className={`mt-4 p-3 rounded ${
            result.includes("Success") ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
          }`}>
            <p className="text-sm">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
} 