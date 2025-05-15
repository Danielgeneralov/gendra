# Environment Variables Setup

This document outlines the required environment variables for the Gendra application. Create a `.env.local` file in the root directory with the following variables:

## Required Environment Variables

```
# API Configuration
NEXT_PUBLIC_API_URL=https://gendra-backend.onrender.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key_here

# Groq API for RFQ Parsing
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

## Optional Environment Variables

For local development, you may want to override the API URL to point to a local backend:

```
# Override to use local backend (optional)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Obtaining Credentials

### Supabase Credentials

1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Navigate to Project Settings > API
4. Copy the URL, anon key, and service role key

### Groq API Key

1. Sign up for [Groq](https://console.groq.com/)
2. Navigate to API Keys
3. Create a new API key
4. Copy the key value

## Notes

- The frontend will work without Supabase credentials, but authentication features will be disabled
- The backend can be used without setting up your own instance by using the hosted version at `https://gendra-backend.onrender.com`
- All environment variables prefixed with `NEXT_PUBLIC_` are accessible in the browser 