-- Create quote_leads table for capturing leads from the quote form
CREATE TABLE IF NOT EXISTS "quote_leads" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" text NOT NULL,
  "part_type" text NOT NULL,
  "material" text NOT NULL,
  "quantity" integer NOT NULL,
  "complexity" text NOT NULL,
  "quote_amount" numeric NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "is_contacted" boolean DEFAULT false,
  "notes" text
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS "quote_leads_email_idx" ON "quote_leads" ("email");

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS "quote_leads_created_at_idx" ON "quote_leads" ("created_at" DESC);

-- Add RLS policies
ALTER TABLE "quote_leads" ENABLE ROW LEVEL SECURITY;

-- Only authenticated users with admin role can read all quote leads
CREATE POLICY "admin_read_quote_leads" ON "quote_leads" 
FOR SELECT TO authenticated 
USING (auth.jwt() ? 'admin_access' = 'true');

-- Anyone can insert a new lead (for the public quote form)
CREATE POLICY "public_insert_quote_leads" ON "quote_leads" 
FOR INSERT TO anon, authenticated 
WITH CHECK (true);

-- Only admins can update leads
CREATE POLICY "admin_update_quote_leads" ON "quote_leads" 
FOR UPDATE TO authenticated 
USING (auth.jwt() ? 'admin_access' = 'true')
WITH CHECK (auth.jwt() ? 'admin_access' = 'true'); 