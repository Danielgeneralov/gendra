# Gendra - Intelligent Quoting Engine

Gendra is a Next.js 14 application for intelligent manufacturing quoting, providing industry-specific quoting for various manufacturing processes.

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Deploying to Vercel

### Prerequisites
- A Vercel account
- Git repository with your codebase

### Deployment Steps

1. **Connect your Git repository to Vercel**
   - Create a new project on [Vercel](https://vercel.com)
   - Import your Git repository
   - Vercel will automatically detect Next.js configuration

2. **Configure Environment Variables**
   - Navigate to your project settings on Vercel
   - Go to the "Environment Variables" tab
   - Add the following environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. **Deploy**
   - Vercel will automatically deploy your application
   - You can trigger manual deployments from the Vercel dashboard

### Production Quality Assurance

The application includes several features to maintain high production quality:

- **TypeScript Type Checking**: Enabled in production builds for type safety
- **ESLint Code Quality**: Enabled in production builds for code quality assurance
- **Suspense Boundaries**: All client components using `useSearchParams` are wrapped in Suspense boundaries to prevent hydration errors
- **Security Headers**: HTTP security headers are configured in `vercel.json`
- **Cache Control**: API routes have proper cache control headers
- **Pre-build Checks**: The build process includes automatic checks for Suspense boundaries

### Build Process

The application includes a robust build process with the following checks:

- **Suspense Boundary Check**: Automatically verifies that all client components using `useSearchParams` have proper Suspense boundaries
- **TypeScript Type Checking**: Enabled for production builds only
- **ESLint Code Quality**: Enabled for production builds only

To run individual checks:
- Check Suspense boundaries: `npm run check:suspense`
- Lint code: `npm run lint`
- Fix linting issues: `npm run lint:fix`

### Important Notes

- Make sure your Supabase database has the required tables (`quote_leads`, etc.)
- The application uses Next.js 14 and requires Node.js 18.17 or later
- Development mode disables TypeScript and ESLint checks for faster iterations, but production builds have them enabled

## Features

- Industry-specific quoting workflows
- Real-time quote calculations
- Lead capture with Supabase integration
- Responsive design with TailwindCSS
- Animation effects with Framer Motion
