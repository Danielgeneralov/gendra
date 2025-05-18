-- SQL to create the "client_configs" table in Supabase
-- Copy this SQL and run it in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS client_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id TEXT UNIQUE NOT NULL,
    quote_schema JSONB NOT NULL DEFAULT '{}',
    visible_fields JSONB NOT NULL DEFAULT '[]',
    branding JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add row level security policies
ALTER TABLE client_configs ENABLE ROW LEVEL SECURITY;

-- Create policies that allow read-only access to authenticated users
CREATE POLICY "Anyone can read client configs" 
    ON client_configs FOR SELECT 
    USING (true);

-- Only allow admins to modify client configs
CREATE POLICY "Only admins can insert client configs" 
    ON client_configs FOR INSERT 
    TO authenticated
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Only admins can update client configs" 
    ON client_configs FOR UPDATE 
    TO authenticated
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Only admins can delete client configs" 
    ON client_configs FOR DELETE 
    TO authenticated
    USING (auth.role() = 'admin');

-- Create an index on client_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_configs_client_id ON client_configs(client_id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_configs_updated_at
    BEFORE UPDATE ON client_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some example client configurations
INSERT INTO client_configs (client_id, quote_schema, visible_fields, branding)
VALUES 
    (
        'speccoat',
        '{
            "base_rate": 100,
            "volume_breaks": [
                {"min": 10, "discount": 0.05},
                {"min": 50, "discount": 0.10},
                {"min": 100, "discount": 0.15}
            ],
            "premium_rules": [
                {"condition": "turnaround_days < 3", "multiplier": 1.5}
            ]
        }',
        '["material", "quantity", "complexity", "turnaround_days"]',
        '{
            "company_name": "SpecCoat Industries",
            "primary_color": "#1a5f7a",
            "logo_url": "https://speccoat.com/logo.png"
        }'
    ),
    (
        'nanotech',
        '{
            "base_rate": 150,
            "volume_breaks": [
                {"min": 5, "discount": 0.03},
                {"min": 20, "discount": 0.08},
                {"min": 50, "discount": 0.12}
            ],
            "premium_rules": [
                {"condition": "complexity > 1.5", "multiplier": 1.3}
            ]
        }',
        '["material", "quantity", "complexity"]',
        '{
            "company_name": "NanoTech Solutions",
            "primary_color": "#2c3e50",
            "logo_url": "https://nanotech.com/logo.png"
        }'
    )
ON CONFLICT (client_id) DO NOTHING; 