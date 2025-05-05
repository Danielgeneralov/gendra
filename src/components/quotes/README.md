# Quote Form Components Pattern

This directory contains client components for the various quote forms used throughout the application.

## App Router Client Components with `useSearchParams()`

When using client-side hooks like `useSearchParams()` or `usePathname()` in Next.js App Router, special care must be taken to avoid SSR bailouts and client/server rendering mismatch errors.

### ✅ The Pattern

1. **Server Component Page**: Keep the page.tsx files as Server Components
2. **Client Component with `use client`**: Create separate client components for forms/UI that need client-side hooks
3. **Suspense Boundary**: Always wrap client components that use `useSearchParams()` in a `<Suspense>` boundary

### 📁 Example Structure

```
src/
  ├── app/
  │   └── quote/
  │       ├── cnc-machining/
  │       │   └── page.tsx            // Server Component (no "use client")
  │       ├── injection-molding/
  │       │   └── page.tsx            // Server Component (no "use client") 
  │       └── sheet-metal/
  │           └── page.tsx            // Server Component (no "use client")
  └── components/
      ├── Loading.tsx                 // Suspense fallback
      └── quotes/
          ├── CNCMachiningForm.tsx    // Client Component ("use client")
          ├── InjectionMoldingForm.tsx// Client Component ("use client")
          ├── SheetMetalForm.tsx      // Client Component ("use client")
          └── QuoteFormWrapper.tsx    // Reusable wrapper with Suspense
```

### 🚨 Common Errors

- **Missing Suspense boundary**: If a component using `useSearchParams()` is not wrapped in Suspense, you'll get: `useSearchParams() should be wrapped in a suspense boundary at page "/quote/cnc-machining"`
- **Forgetting `use client`**: If you try to use client hooks without the `"use client"` directive, you'll get: `useSearchParams is not defined` error
- **Direct import in server component**: If you directly use a client component with `useSearchParams()` in a server component without Suspense, you'll get the missing Suspense boundary error

### 📚 Checklist for New Quote Routes

1. ✅ Create a separate client form component with `"use client"` directive
2. ✅ Use `useSearchParams()` only within this client component
3. ✅ Create a server-component page that uses `<QuoteFormWrapper>` to wrap the client component
4. ✅ Ensure QuoteFormWrapper has a Suspense boundary around the client component

### 🧠 Remember

Client hooks like `useSearchParams()` and `usePathname()` MUST:
- Be used only in `"use client"` components 
- Be wrapped in `<Suspense>` when rendered inside server components 