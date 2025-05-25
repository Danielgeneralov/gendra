# Gendra Deployment Guide

This document outlines the deployment configuration for the Gendra project, specifically focusing on Vercel deployment requirements.

## Configuration Files

### package.json

- All CSS-related packages (tailwindcss, postcss, autoprefixer) are listed as dependencies (not devDependencies)
- next-sitemap is included as a dependency for sitemap generation during build
- A custom `vercel-build` script is defined to ensure all dependencies are installed

### vercel.json

- Defines top-level configuration properties rather than using the `builds` array
- Specifies `buildCommand` and `installCommand` directly
- Sets `framework` to "nextjs" for proper detection
- Note: This allows Vercel Project Settings to apply properly while still customizing the build process

### next.config.js

- Configures webpack with explicit path aliases
- Sets up proper fallbacks for browser-only modules
- Configures content security policy headers

### postcss.config.js

- Sets up PostCSS with Tailwind CSS and Autoprefixer

## Dynamic Imports

Several components use dynamic imports for client-side only libraries:

- GSAP and ScrollTrigger in InsightsMetrics.tsx
- Lenis smooth scrolling in SmoothScrollProvider.tsx
- Industry registry in Step4Preview.tsx

## Build Process

The build process follows these steps:

1. Install all dependencies (including dev dependencies) with `--production=false` flag
2. Build the Next.js application
3. Generate the sitemap

## Troubleshooting

If you encounter build errors:

1. Check that all required dependencies are in the dependencies section (not devDependencies)
2. Ensure dynamic imports are used for browser-only libraries
3. Verify that your Vercel project settings are aligned with vercel.json
4. Make sure the installCommand includes the `--production=false` flag

## Notes on Client-Side Libraries

- GSAP, Lenis, and other client-side libraries should always be dynamically imported
- Use the isClient flag to prevent execution in server-side contexts
- Wrap browser-only code in useEffect hooks

## Vercel Configuration Notes

- Using the top-level `buildCommand` and `installCommand` properties rather than the `builds` array allows project settings in the Vercel dashboard to apply properly
- This avoids the warning: "Due to `builds` existing in your configuration file, the Build and Development Settings defined in your Project Settings will not apply" 