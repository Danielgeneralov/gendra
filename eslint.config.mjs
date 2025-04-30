import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create compat layer to use legacy configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { extends: ["eslint:recommended"] }
});

export default [
  // Ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/out/**",
      "**/.git/**",
      "**/public/**",
      "**/venv/**",
      "**/.vercel/**"
    ]
  },
  // Use NextJS ESLint config for compatibility
  ...compat.extends("next/core-web-vitals"),
  // Base rules for all files
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@next/next/no-html-link-for-pages": "off"
    }
  }
];
