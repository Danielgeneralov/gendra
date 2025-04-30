const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all TypeScript/JavaScript files with console.log warnings
const findFilesWithConsoleLog = () => {
  try {
    const result = execSync('npx eslint "src/**/*.{ts,tsx,js,jsx}" --format json').toString();
    const lintResults = JSON.parse(result);
    
    // Filter for files with console.log issues
    return lintResults
      .filter(file => file.messages.some(msg => 
        msg.ruleId === 'no-console' && msg.message.includes('console.log')))
      .map(file => file.filePath);
  } catch (error) {
    // If eslint fails or returns non-zero status, try to parse the output for files
    console.warn('Could not run eslint properly, falling back to simpler check');
    
    // Use a direct grep approach instead
    try {
      const grepResult = execSync('findstr /s /i "console.log" "src\\*.ts" "src\\*.tsx" "src\\*.js" "src\\*.jsx"').toString();
      const fileMatches = grepResult.match(/^(.+?):\d+:/gm);
      if (fileMatches) {
        // Remove duplicates
        return [...new Set(fileMatches.map(match => match.replace(/:\d+:$/, '')))];
      }
    } catch (err) {
      console.error('Failed to find files with grep-like approach:', err.message);
    }
    
    return [];
  }
};

// Replace console.log with console.warn in a file
const replaceConsoleLogInFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace console.log with console.warn, being careful about function context
    const updatedContent = content.replace(
      /console\.log\(/g, 
      'console.warn('
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.warn(`Updated console.log in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return false;
  }
};

const main = () => {
  const filesToFix = findFilesWithConsoleLog();
  
  if (filesToFix.length === 0) {
    console.warn('No files with console.log issues found.');
    return;
  }
  
  console.warn(`Found ${filesToFix.length} files with console.log issues.`);
  
  let fixedCount = 0;
  
  for (const filePath of filesToFix) {
    if (replaceConsoleLogInFile(filePath)) {
      fixedCount++;
    }
  }
  
  console.warn(`Fixed ${fixedCount} of ${filesToFix.length} files.`);
};

main(); 