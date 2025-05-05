# Gendra Industry Registry

This directory contains the Industry Registry, a centralized system for managing manufacturing industry configurations within Gendra. The registry serves as a single source of truth for both frontend and backend services, ensuring consistency across the application.

## Core Files

- `industryRegistry.ts` - The main registry file containing industry configurations and utility functions
- `industryRegistry.supabase.example.ts` - Example of how to migrate the registry to Supabase
- `industryRegistry.usage.example.tsx` - Examples of how to use the registry in components

## Key Concepts

### Industry Configuration

Each industry in Gendra is defined by a configuration object that includes:

- **Basic metadata**: ID, name, description, icon
- **Form fields**: Input fields to collect user specifications
- **Materials**: Available materials and their pricing factors
- **Complexity levels**: Different complexity tiers and their impact on pricing
- **Pricing configuration**: Base price, pricing mode, and optional model names

### Architecture Benefits

1. **Centralized Configuration**: All industry settings in one place
2. **Type Safety**: Strong TypeScript typing for developer experience
3. **Extensibility**: Easy to add new industries with minimal code changes
4. **Separation of Concerns**: Decouples configuration from implementation
5. **Future-Proof**: Designed to be easily migrated to a database later

## Usage Guide

### Accessing Industry Configurations

```typescript
import { getIndustryConfig } from '@/lib/industryRegistry';

// Get a specific industry config
const cncConfig = getIndustryConfig('cnc-machining');

// Check if an industry is supported
if (getIndustryConfig('laser-cutting')) {
  // Industry exists
}

// Get all active industries
import { getAllIndustries } from '@/lib/industryRegistry';
const allIndustries = getAllIndustries();
```

### In API Routes

```typescript
import { getIndustryConfig } from '@/lib/industryRegistry';

export async function GET(request) {
  const industryId = // extract from request
  const config = getIndustryConfig(industryId);
  
  if (!config) {
    return Response.json({ error: 'Industry not found' }, { status: 404 });
  }
  
  return Response.json(config);
}
```

### In React Components

```tsx
'use client';

import { useEffect, useState } from 'react';
import { getIndustryConfig } from '@/lib/industryRegistry';

export default function IndustryForm({ industryId }) {
  const [config, setConfig] = useState(null);
  
  useEffect(() => {
    const industryConfig = getIndustryConfig(industryId);
    setConfig(industryConfig);
  }, [industryId]);
  
  if (!config) return <div>Industry not found</div>;
  
  return (
    <div>
      <h1>{config.name}</h1>
      {/* Render form fields based on config */}
    </div>
  );
}
```

## Adding a New Industry

1. Add a new entry to the `INDUSTRY_REGISTRY` in `industryRegistry.ts`:

```typescript
'new-industry': {
  id: 'new-industry',
  name: 'New Industry',
  description: 'Description of the new industry',
  pricingMode: PricingMode.HYBRID,
  icon: 'svg-path-here',
  basePrice: 100,
  formFields: [
    // Define form fields
  ],
  materials: [
    // Define materials
  ],
  complexityLevels: STANDARD_COMPLEXITY_LEVELS,
  // Additional configuration
},
```

2. Create a form component in `src/components/quotes/NewIndustryForm.tsx`

3. Export the component in `src/components/quotes/index.ts`

4. Create a page component in `src/app/quote/new-industry/page.tsx`

## Database Migration

The registry is designed to be easily migrated to a database like Supabase in the future. See `industryRegistry.supabase.example.ts` for an example implementation.

## Frontend vs. Backend Fields

The registry supports designating fields as backend-only using the `backendOnly` property. These fields are excluded from frontend responses using the `getFrontendConfig()` utility function.

## Dynamic Form Generation

The registry can be used to dynamically generate form components based on the industry configuration. See `industryRegistry.usage.example.tsx` for an example implementation. 