-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    service_type TEXT NOT NULL,
    material TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    complexity FLOAT,
    turnaround_days INTEGER,
    quote_amount DECIMAL(10,2) NOT NULL,
    customer_email TEXT,
    customer_name TEXT,
    company_name TEXT,
    additional_notes TEXT,
    status TEXT DEFAULT 'pending',
    metadata JSONB
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    company_name TEXT,
    phone TEXT,
    interest_type TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'new',
    source TEXT,
    metadata JSONB
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    role TEXT DEFAULT 'user',
    subscription_status TEXT DEFAULT 'free',
    subscription_tier TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Create portal_configs table
CREATE TABLE IF NOT EXISTS portal_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    company_id UUID REFERENCES users(id),
    company_name TEXT NOT NULL,
    logo_url TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    custom_domain TEXT,
    features JSONB,
    settings JSONB,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB
);

-- Add RLS policies
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_configs ENABLE ROW LEVEL SECURITY;

-- Quotes policies
CREATE POLICY "Users can view their own quotes"
    ON quotes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create quotes"
    ON quotes FOR INSERT
    WITH CHECK (true);

-- Leads policies
CREATE POLICY "Admins can view all leads"
    ON leads FOR SELECT
    USING (auth.role() = 'admin');

CREATE POLICY "Anyone can create leads"
    ON leads FOR INSERT
    WITH CHECK (true);

-- Users policies
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Portal configs policies
CREATE POLICY "Company admins can manage their portal"
    ON portal_configs FOR ALL
    USING (auth.uid() = company_id); 