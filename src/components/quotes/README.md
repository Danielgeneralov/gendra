# Gendra Manufacturing Quote Forms

This directory contains the quote form components for different manufacturing processes supported by Gendra.

## Available Quote Forms

1. **CNCMachiningForm.tsx** - For CNC machining services
2. **ElectronicsAssemblyForm.tsx** - For electronics assembly services
3. **InjectionMoldingForm.tsx** - For injection molding services
4. **MetalFabricationForm.tsx** - For metal fabrication services
5. **SheetMetalForm.tsx** - For sheet metal fabrication services

## Adding a New Manufacturing Process Form

To add support for a new manufacturing process, follow these steps:

### 1. Create a New Form Component

Create a new file named `[ProcessName]Form.tsx` in this directory. Use the existing forms as templates.

Basic structure:

```tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type FormData = {
  // Define your form fields here
  material: string;
  quantity: number;
  // Add other fields specific to your manufacturing process
  complexity: 'low' | 'medium' | 'high';
  deadline: string;
};

// Configure the API endpoint 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gendra-backend.onrender.com';
const QUOTE_ENDPOINT = `${API_BASE_URL}/predict-quote`;
const HEALTH_ENDPOINT = `${API_BASE_URL}/`;

export default function NewProcessForm() {
  // Initialize state variables
  
  // Form submission logic
  
  // UI rendering
}
```

### 2. Implement the Required Functions

Your form needs to implement these key functions:

1. **handleInputChange** - To update form state when user inputs change
2. **calculateFallbackQuote** - For local quote calculations when backend is offline
3. **calculateQuote** - To send API requests to the backend for quote prediction
4. **handleSubmit** - To process form submission

### 3. Update the index.ts File

Add your new form to the `index.ts` file to export it:

```typescript
export { default as NewProcessForm } from './NewProcessForm';
```

### 4. Add Backend Support

If needed, update the backend to support calculating quotes for the new process:

1. Modify the `quote_service.py` to handle the new process type
2. Add appropriate multipliers or calculations specific to the new process

### 5. Add to Navigation

Update the navigation or selection UI to include your new manufacturing process.

## Common Components

All quote forms share these common features:

1. **Backend Status Indicator** - Shows if the pricing engine is online/offline
2. **Fallback Calculation** - Local calculation when backend is unavailable
3. **Quote Summary Display** - Shows the final quote amount and lead time
4. **Form Prefilling** - Support for prefilling from RFQ parsing

## Form Structure Guidelines

For consistency, follow these guidelines:

1. **Form Field Organization**:
   - Group related fields (dimensions, material properties, etc.)
   - Use a consistent two-column layout for desktop
   - Single column for mobile views

2. **Input Types**:
   - Use select dropdowns for fields with predetermined options
   - Use number inputs with appropriate min/max/step values
   - Use checkboxes for boolean options
   - Use date picker for deadline selection

3. **UI Components**:
   - Use consistent styling classes
   - Include appropriate validation
   - Show loading indicators during calculations

## Testing Your New Form

1. Test with backend online and offline to verify fallback calculation
2. Test with various input combinations to ensure accurate quotes
3. Test the RFQ prefilling functionality
4. Test on different screen sizes to verify responsive design 