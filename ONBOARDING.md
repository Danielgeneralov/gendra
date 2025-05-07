# Gendra Project Onboarding Guide

This document provides a comprehensive overview of the Gendra project, its structure, dependencies, and setup instructions to help new team members get started quickly.

## Project Overview

Gendra is a web application built with Next.js 15 and TypeScript on the frontend, with a Python FastAPI backend for handling quote predictions. The application uses Supabase for data storage and authentication.

## Repository Structure

```
gendra/
├── .git/                    # Git repository data
├── .next/                   # Next.js build output (generated)
├── backend/                 # Python backend service
│   ├── __pycache__/         # Python cache files
│   ├── main.py              # Main FastAPI application
│   ├── model.pkl            # Trained ML model
│   ├── requirements.txt     # Python dependencies
│   ├── test_api.ps1         # PowerShell test script
│   ├── test_request.py      # Python test script
│   └── README.md            # Backend-specific documentation
├── examples/                # Example files and templates
├── node_modules/            # JavaScript dependencies (generated)
├── public/                  # Static public assets
├── scripts/                 # Utility scripts
├── src/                     # Source code
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   └── v1/          # API version 1 endpoints
│   │   ├── components/      # React components
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lottie/          # Lottie animations
│   │   ├── models/          # Data models
│   │   ├── quote/           # Quote-related pages
│   │   ├── schedule/        # Scheduling pages
│   │   ├── supabase/        # Supabase client setup
│   │   ├── favicon.ico      # Site favicon
│   │   ├── globals.css      # Global CSS
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Homepage component
│   ├── config.ts            # Application configuration
│   └── types/               # TypeScript type definitions
├── venv/                    # Python virtual environment (generated)
├── .gitignore               # Git ignore rules
├── create_jobs_table.sql    # SQL for creating jobs table
├── eslint.config.mjs        # ESLint configuration
├── next-env.d.ts            # Next.js TypeScript declarations
├── next.config.js           # Next.js configuration
├── next.config.ts           # TypeScript version of Next.js config
├── package-lock.json        # npm dependencies lock file
├── package.json             # Project metadata and dependencies
├── postcss.config.mjs       # PostCSS configuration
├── README.md                # Project documentation
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Technology Stack

### Frontend
- **Next.js 15**: React framework for web applications
- **React 19**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lottie**: Web animation
- **AOS**: Animate on scroll library

### Backend
- **FastAPI**: Python web framework for building APIs
- **Uvicorn**: ASGI server for FastAPI
- **Scikit-learn**: Machine learning library
- **NumPy**: Numerical computing library
- **Pydantic**: Data validation library

### Database
- **Supabase**: Open source Firebase alternative with PostgreSQL

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd gendra
   ```

2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

5. The API will be available at [http://localhost:8000](http://localhost:8000)

## Git Ignored Files

The following files and directories are excluded from version control (based on `.gitignore`):

### Frontend
- `/node_modules/` - Contains all npm packages (install with `npm install`)
- `/.next/` - Next.js build output (generated with `npm run build`)
- `/out/` - Static export output
- `/build/` - Production build files
- `.env*` - Environment variables (except those explicitly committed)
- `.vercel` - Vercel deployment configuration
- `*.tsbuildinfo` - TypeScript incremental build info
- `next-env.d.ts` - Next.js TypeScript declarations (auto-generated)

### Backend
- `/venv/` - Python virtual environment (recreate with setup instructions above)
- `__pycache__/` - Python compiled files

### Required Secret Files
You'll need to request or create the following files that aren't tracked in git:

- `.env.local` - Environment variables for Next.js frontend
  - Contains Supabase credentials and other API keys
  - Request from the team lead or create based on `.env.example` (if available)

## Code Conventions

- TypeScript is used for type safety
- React components are functional components with hooks
- API routes use the Next.js App Router pattern (`app/api/v1/[endpoint]/route.ts`)
- Dynamic route parameters are extracted from the URL in API routes
- CSS styling is done with Tailwind CSS

## Important Routes and Endpoints

### Frontend Pages
- `/` - Homepage
- `/dashboard` - User dashboard
- `/quote` - Quote creation page
- `/schedule` - Scheduling page

### API Endpoints
- `/api/v1/industries` - Get industry information
- `/api/v1/quote/[industryId]` - Get quote for specific industry
- `/api/v1/submit-quote` - Submit a new quote

### Branch Management and Collaboration

We follow a branch-based workflow to ensure code quality and protect the main branch:

1. **Never commit directly to main**: The main branch should always contain stable, production-ready code
   ```bash
   # First, make sure you're on main and it's up to date
   git checkout main
   git pull origin main
   
   # Create a new feature branch with a descriptive name
   git checkout -b feature/your-feature-name
   ```

2. **Keep your work isolated**: Work on your assigned features in dedicated branches
   ```bash
   # Make your changes
   git add .
   git commit -m "Descriptive commit message explaining what changed and why"
   
   # Push your branch to the remote repository
   git push origin feature/your-feature-name
   ```

3. **Submit changes via Pull Requests**: When your feature is complete
   - Go to the repository on GitHub
   - Click "Pull requests" > "New pull request"
   - Select your feature branch
   - Add a description of your changes
   - Request a review from the team lead

4. **Code review**: Wait for the review before merging
   - Address any feedback
   - Once approved, merge via GitHub's interface
   - Delete the feature branch after merging

5. **Sync regularly**: Keep your branches up to date with main
   ```bash
   # While on your feature branch
   git fetch origin
   git merge origin/main
   # Resolve any conflicts
   ```

### Security Best Practices

1. **Environment files**: Never commit sensitive information
   - Create your own local `.env.local` file based on instruction from team lead
   - Never share API keys or credentials via git or public channels
   - Use secure channels (encrypted messages or password managers) to share secrets

2. **Dependencies**: Be cautious when adding new packages
   - Discuss with the team before adding major dependencies
   - Use exact version numbers in package.json
   - Run `npm audit` regularly to check for vulnerabilities

3. **Code practices**:
   - Don't hardcode secrets or credentials in any file
   - Use Supabase Row Level Security for data access control
   - Follow the principle of least privilege for API endpoints

## Common Issues and Solutions

### API Route Type Errors
- For dynamic API routes, extract parameters from the URL directly:
  ```typescript
  export async function GET(request: Request) {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    return Response.json({ id });
  }
  ```

### Python Import Errors
- Ensure the virtual environment is activated
- If using the `dotenv` package, install it with `pip install python-dotenv`

### Next.js Build Errors with Python Files
- The project uses a webpack configuration to exclude Python files from Next.js processing

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 