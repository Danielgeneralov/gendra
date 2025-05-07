# Gendra

Gendra is a quoting OS for manufacturers that lets users upload RFQ files (PDF, Excel), parses them using the Groq API, and routes them to the appropriate quoting template based on detected industry.

## Phase 1: Upload + Parsing

This repository contains the first phase of the Gendra application, focusing on:

- File upload and text extraction from PDFs, Excel files, and CSV files
- Text parsing and metadata extraction using the Groq API
- Temporary storage of results in Supabase

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (for database)
- Groq API key (for parsing)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Config
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key

# Groq API Config
GROQ_API_KEY=your_groq_api_key
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/src
  /app                # Next.js App Router 
    /api              # API route handlers
      /parse          # Text parsing API endpoint
      /parse/upload   # File upload and parsing endpoint
    /parse-rfq        # RFQ parsing page
  /components         # React components
    FileUploader.tsx  # File upload component
    RFQUploader.tsx   # Text input component
    RFQParserTabs.tsx # Combined upload components
  /lib                # Utility functions
    fileParser.ts     # File type parsing utilities
    groqParser.ts     # Groq API integration
    /db               # Database utilities
  /types              # TypeScript type definitions
```

## Features

- **File Upload**: Drag & drop or file selection for PDF, Excel (XLSX/XLS), and CSV files
- **Text Input**: Paste RFQ text directly for processing
- **Parsing**: Extract key metadata (industry, quantity, material, etc.) using Groq API
- **Data Storage**: Save parsed results to Supabase for later use
- **Error Handling**: Comprehensive error handling and user feedback

## Database Schema

The application uses a Supabase table called `parsed_rfq_drafts` with the following structure:

```sql
CREATE TABLE parsed_rfq_drafts (
  id SERIAL PRIMARY KEY,
  material TEXT,
  quantity INTEGER,
  length NUMERIC,
  width NUMERIC,
  height NUMERIC,
  complexity TEXT,
  deadline TEXT,
  raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE
);
```

## Next Steps (Future Phases)

- Routing to appropriate quoting templates based on detected industry
- User authentication and RFQ management
- Improved parsing accuracy and handling of complex RFQs
- Integration with CAD file processing

## Backend Services

This project includes a Python FastAPI backend for advanced quote calculations:

```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## System Documentation

For a complete overview of the system architecture, recent changes, and troubleshooting information, 
please see the [ONBOARDING.md](./backend/ONBOARDING.md) file in the backend directory.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
