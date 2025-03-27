-- SQL to create the "jobs" table in Supabase
-- Copy this SQL and run it in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_type TEXT NOT NULL,
  material TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  complexity TEXT NOT NULL,
  deadline DATE NOT NULL,
  quote_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add row level security policies (recommended)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert but only read their own data
CREATE POLICY "Anyone can insert jobs" 
  ON jobs FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can view their own jobs" 
  ON jobs FOR SELECT 
  USING (true); 