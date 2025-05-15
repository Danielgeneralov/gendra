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

### Quick Setup

For a simplified setup guide, see the [Installation Guide](INSTALL_GUIDE.md). This provides step-by-step instructions to get the application running quickly.

### Environment Setup

For environment variable configuration, see the [Environment Variables Setup Guide](ENV_SETUP.md). This outlines all required variables and how to obtain the necessary credentials.

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

## Documentation

Gendra includes several documentation files to help you understand and work with the system:

- [INSTALL_GUIDE.md](INSTALL_GUIDE.md) - Step-by-step installation instructions
- [ENV_SETUP.md](ENV_SETUP.md) - Environment variable configuration guide
- [ONBOARDING.md](ONBOARDING.md) - Complete system overview and architecture
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Detailed development workflow
- [backend/README.md](backend/README.md) - Backend-specific documentation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
