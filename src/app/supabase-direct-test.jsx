"use client";

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Direct connection to Supabase without using the shared client
export default function SupabaseDirectTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  
  // Get environment variables on client side
  useEffect(() => {
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
    setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
  }, []);
  
  const testDirectInsert = async () => {
    setLoading(true);
    setResult('Testing direct insert...');
    
    try {
      if (!supabaseUrl || !supabaseKey) {
        setResult('Error: Missing Supabase credentials in environment variables. Check your .env.local file.');
        setLoading(false);
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
          notes: 'Direct test using env variables'
        })
        .select();
      
      if (error) {
        console.error('Insert error:', error);
        setResult(`❌ Error: ${error.message}`);
      } else {
        console.warn('Success:', data);
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
          This test uses environment variables from .env.local to connect to Supabase.
        </p>
        
        <div className="mb-4 p-3 bg-slate-100 rounded text-xs font-mono overflow-hidden">
          <p className="truncate">
            NEXT_PUBLIC_SUPABASE_URL: {supabaseUrl ? `${supabaseUrl.substring(0, 10)}...` : 'Not set'}
          </p>
          <p className="truncate">
            NEXT_PUBLIC_SUPABASE_ANON_KEY: {supabaseKey ? '✓ Set' : 'Not set'}
          </p>
        </div>
        
        <button
          onClick={testDirectInsert}
          disabled={loading || !supabaseUrl || !supabaseKey}
          className={`w-full py-2 px-4 rounded ${
            loading || !supabaseUrl || !supabaseKey 
              ? "bg-slate-400" 
              : "bg-blue-600 hover:bg-blue-700"
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