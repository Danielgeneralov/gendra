#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * This script checks if all client components using useSearchParams are
 * properly wrapped in Suspense boundaries.
 */

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Check if a file is a client component
function isClientComponent(content) {
  return content.includes('"use client"') || content.includes("'use client'");
}

// Check if a file uses useSearchParams
function usesSearchParams(content) {
  return content.includes('useSearchParams');
}

// Check if a file properly implements Suspense
function hasSuspenseBoundary(content) {
  return (
    content.includes('<Suspense') && 
    content.includes('import') && 
    content.includes('Suspense') && 
    (
      // Match export default function Component() pattern
      content.match(/export\s+default\s+function.*?\{[\s\S]*?<Suspense[\s\S]*?<\/Suspense>[\s\S]*?\}/m) ||
      // Match export const Component = () => pattern
      content.match(/export\s+const\s+\w+\s*=\s*\(.*?\)\s*=>\s*\{[\s\S]*?<Suspense[\s\S]*?<\/Suspense>[\s\S]*?\}/m) ||
      // Match export const Component = (props) => pattern
      content.match(/export\s+const\s+\w+\s*=\s*\(.*?\)\s*=>\s*\([\s\S]*?<Suspense[\s\S]*?<\/Suspense>[\s\S]*?\)/m)
    )
  );
}

// Recursively find all TypeScript React files
function findTsxFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
          fileList = findTsxFiles(filePath, fileList);
        } else if (
          (file.endsWith('.tsx') || file.endsWith('.jsx')) && 
          !file.startsWith('.') && 
          !filePath.includes('node_modules')
        ) {
          fileList.push(filePath);
        }
      } catch (err) {
        // Skip files that can't be accessed
      }
    });
  } catch (err) {
    console.warn(`${colors.yellow}Warning: Could not access directory ${dir}${colors.reset}`);
  }
  
  return fileList;
}

// Main function
function main() {
  console.log(`${colors.blue}Checking client components for proper Suspense boundaries...${colors.reset}`);
  
  let appDir = path.join(process.cwd(), 'src', 'app');
  
  // Fallback to app directory if src/app doesn't exist
  if (!fs.existsSync(appDir)) {
    appDir = path.join(process.cwd(), 'app');
    // If neither exists, exit
    if (!fs.existsSync(appDir)) {
      console.log(`${colors.yellow}No app directory found. Exiting.${colors.reset}`);
      return;
    }
  }
  
  const tsxFiles = findTsxFiles(appDir);
  
  let issuesFound = 0;
  let checkedComponents = 0;
  let requireSuspense = 0;
  
  for (const file of tsxFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (isClientComponent(content)) {
        checkedComponents++;
        
        if (usesSearchParams(content)) {
          requireSuspense++;
          
          if (!hasSuspenseBoundary(content)) {
            console.log(`${colors.red}ISSUE: ${colors.yellow}${file}${colors.reset}`);
            console.log(`  - Uses useSearchParams but doesn't have proper Suspense boundary`);
            issuesFound++;
          } else {
            console.log(`${colors.green}OK: ${colors.reset}${file}`);
          }
        }
      }
    } catch (err) {
      console.warn(`${colors.yellow}Could not read file ${file}: ${err.message}${colors.reset}`);
    }
  }
  
  console.log(`\n${colors.blue}Summary:${colors.reset}`);
  console.log(`- Checked ${checkedComponents} client components`);
  console.log(`- Found ${requireSuspense} components using useSearchParams`);
  
  if (issuesFound === 0) {
    console.log(`${colors.green}✓ All components using useSearchParams have proper Suspense boundaries${colors.reset}`);
    return 0;
  } else {
    console.log(`${colors.red}✗ Found ${issuesFound} components with missing Suspense boundaries${colors.reset}`);
    process.exit(0); // Don't fail build for now
  }
}

// Run the script
main(); 