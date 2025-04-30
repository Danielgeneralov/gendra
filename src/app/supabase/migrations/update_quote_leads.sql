-- Migration to update the quote_leads table with new fields for enhanced data capture

-- First, check if the table exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quote_leads') THEN
    -- Create the table if it doesn't exist
    CREATE TABLE public.quote_leads (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      email text NOT NULL,
      quote_amount numeric NOT NULL,
      created_at timestamp with time zone DEFAULT now() NOT NULL,
      is_contacted boolean DEFAULT false,
      notes text
    );
  END IF;
END $$;

-- Now add the new columns if they don't exist
DO $$ 
BEGIN
  -- Add industry column
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quote_leads' AND column_name = 'industry') THEN
    ALTER TABLE public.quote_leads ADD COLUMN industry text;
  END IF;

  -- Add material column
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quote_leads' AND column_name = 'material') THEN
    ALTER TABLE public.quote_leads ADD COLUMN material text;
  END IF;

  -- Add quantity column
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quote_leads' AND column_name = 'quantity') THEN
    ALTER TABLE public.quote_leads ADD COLUMN quantity integer;
  END IF;

  -- Add complexity column
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quote_leads' AND column_name = 'complexity') THEN
    ALTER TABLE public.quote_leads ADD COLUMN complexity text;
  END IF;

  -- Add surface_finish column
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quote_leads' AND column_name = 'surface_finish') THEN
    ALTER TABLE public.quote_leads ADD COLUMN surface_finish text;
  END IF;

  -- Add lead_time_preference column
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quote_leads' AND column_name = 'lead_time_preference') THEN
    ALTER TABLE public.quote_leads ADD COLUMN lead_time_preference text;
  END IF;

  -- Add custom_fields JSONB column
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quote_leads' AND column_name = 'custom_fields') THEN
    ALTER TABLE public.quote_leads ADD COLUMN custom_fields JSONB DEFAULT '{}'::jsonb;
  END IF;

  -- Add full_quote_shown column
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quote_leads' AND column_name = 'full_quote_shown') THEN
    ALTER TABLE public.quote_leads ADD COLUMN full_quote_shown boolean DEFAULT false;
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quote_leads_email ON public.quote_leads (email);
CREATE INDEX IF NOT EXISTS idx_quote_leads_industry ON public.quote_leads (industry);
CREATE INDEX IF NOT EXISTS idx_quote_leads_created_at ON public.quote_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_leads_is_contacted ON public.quote_leads (is_contacted) WHERE NOT is_contacted;

-- Update RLS policies to ensure security
ALTER TABLE public.quote_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if we need to update them
DROP POLICY IF EXISTS "admin_read_quote_leads" ON public.quote_leads;
DROP POLICY IF EXISTS "public_insert_quote_leads" ON public.quote_leads;
DROP POLICY IF EXISTS "admin_update_quote_leads" ON public.quote_leads;

-- Only authenticated users with admin role can read all quote leads
CREATE POLICY "admin_read_quote_leads" ON public.quote_leads 
FOR SELECT TO authenticated 
USING (auth.jwt() ? 'admin_access' = 'true');

-- Anyone can insert a new lead (for the public quote form)
CREATE POLICY "public_insert_quote_leads" ON public.quote_leads 
FOR INSERT TO anon, authenticated 
WITH CHECK (true);

-- Only admins can update leads
CREATE POLICY "admin_update_quote_leads" ON public.quote_leads 
FOR UPDATE TO authenticated 
USING (auth.jwt() ? 'admin_access' = 'true')
WITH CHECK (auth.jwt() ? 'admin_access' = 'true');

-- Comment explaining the migration
COMMENT ON TABLE public.quote_leads IS 'Enhanced table storing quote leads with additional structured fields and custom data'; 