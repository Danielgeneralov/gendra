#!/bin/bash
# check_mac_compatibility.sh - Scans the codebase for potential Mac compatibility issues
# Run with: bash check_mac_compatibility.sh

# Set colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking for Mac compatibility issues in the codebase...${NC}\n"

# Create results directory if it doesn't exist
RESULTS_DIR="mac_compatibility_results"
mkdir -p $RESULTS_DIR

# File to store all results
RESULTS_FILE="$RESULTS_DIR/compatibility_issues.md"

# Initialize results file
cat > $RESULTS_FILE << EOL
# Mac Compatibility Issues Report

Generated on $(date)

This report lists potential compatibility issues that might affect running the project on macOS.

## Summary

EOL

# Counter for issues found
ISSUES_FOUND=0

# Function to check for Windows-style paths
check_windows_paths() {
  echo -e "${YELLOW}Checking for Windows-style paths (backslashes)...${NC}"
  
  # Find backslashes in code files, excluding binary files and the current results
  WINDOWS_PATHS=$(grep -r --include="*.{js,jsx,ts,tsx,py,json,md}" -l '\\\\' --exclude-dir={node_modules,.git,venv,$RESULTS_DIR} . 2>/dev/null)
  
  if [ -n "$WINDOWS_PATHS" ]; then
    echo -e "${RED}Found Windows-style paths (backslashes) in:${NC}"
    echo "$WINDOWS_PATHS" | while read file; do
      echo -e "  - ${RED}$file${NC}"
    done
    
    # Add to results file
    cat >> $RESULTS_FILE << EOL
- ⚠️ **Windows-style paths**: Found backslashes in $(echo "$WINDOWS_PATHS" | wc -l | xargs) files
EOL
    
    # Save detailed results
    echo -e "# Windows-style Paths\n\nThese files contain backslashes which may cause issues on macOS:\n" > "$RESULTS_DIR/windows_paths.md"
    echo "$WINDOWS_PATHS" | while read file; do
      echo -e "## $file\n" >> "$RESULTS_DIR/windows_paths.md"
      grep -n '\\\\' "$file" | head -10 >> "$RESULTS_DIR/windows_paths.md"
      echo -e "\n" >> "$RESULTS_DIR/windows_paths.md"
    done
    
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  else
    echo -e "${GREEN}No Windows-style paths found.${NC}"
    echo -e "- ✅ No Windows-style paths found" >> $RESULTS_FILE
  fi
  echo ""
}

# Function to check for Windows-specific commands
check_windows_commands() {
  echo -e "${YELLOW}Checking for Windows-specific commands...${NC}"
  
  # List of Windows-specific commands to search for
  COMMANDS=("powershell" "cmd.exe" "cmd /c" "cmd.exe /c" ".ps1" ".bat" ".cmd" "System32" "C:\\\\Windows")
  
  WINDOWS_COMMANDS_FILES=""
  
  for cmd in "${COMMANDS[@]}"; do
    CMD_FILES=$(grep -r --include="*.{js,jsx,ts,tsx,py,json,md,sh}" -l "$cmd" --exclude-dir={node_modules,.git,venv,$RESULTS_DIR} . 2>/dev/null)
    
    if [ -n "$CMD_FILES" ]; then
      echo -e "${RED}Found Windows command '$cmd' in:${NC}"
      echo "$CMD_FILES" | while read file; do
        echo -e "  - ${RED}$file${NC}"
      done
      
      WINDOWS_COMMANDS_FILES="$WINDOWS_COMMANDS_FILES $CMD_FILES"
    fi
  done
  
  if [ -n "$WINDOWS_COMMANDS_FILES" ]; then
    # Remove duplicates
    WINDOWS_COMMANDS_FILES=$(echo "$WINDOWS_COMMANDS_FILES" | tr ' ' '\n' | sort -u)
    
    # Add to results file
    cat >> $RESULTS_FILE << EOL
- ⚠️ **Windows-specific commands**: Found Windows commands in $(echo "$WINDOWS_COMMANDS_FILES" | wc -l | xargs) files
EOL
    
    # Save detailed results
    echo -e "# Windows-specific Commands\n\nThese files contain Windows-specific commands which won't work on macOS:\n" > "$RESULTS_DIR/windows_commands.md"
    echo "$WINDOWS_COMMANDS_FILES" | while read file; do
      echo -e "## $file\n" >> "$RESULTS_DIR/windows_commands.md"
      
      for cmd in "${COMMANDS[@]}"; do
        MATCHES=$(grep -n "$cmd" "$file" 2>/dev/null)
        if [ -n "$MATCHES" ]; then
          echo -e "### Command: $cmd\n" >> "$RESULTS_DIR/windows_commands.md"
          echo "$MATCHES" | head -5 >> "$RESULTS_DIR/windows_commands.md"
          echo -e "\n" >> "$RESULTS_DIR/windows_commands.md"
        fi
      done
    done
    
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  else
    echo -e "${GREEN}No Windows-specific commands found.${NC}"
    echo -e "- ✅ No Windows-specific commands found" >> $RESULTS_FILE
  fi
  echo ""
}

# Function to check for file case sensitivity issues
check_case_sensitivity() {
  echo -e "${YELLOW}Checking for file case sensitivity issues...${NC}"
  
  # List all files
  find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/venv/*" -not -path "*/$RESULTS_DIR/*" > /tmp/all_files.txt
  
  # Create a sorted list with lowercase filenames
  cat /tmp/all_files.txt | while read file; do
    echo "$(basename "$file" | tr '[:upper:]' '[:lower:]') $file" >> /tmp/lowercase_files.txt
  done
  
  # Sort and find duplicates
  sort /tmp/lowercase_files.txt > /tmp/sorted_files.txt
  CASE_ISSUES=$(cat /tmp/sorted_files.txt | cut -d' ' -f1 | uniq -d)
  
  CASE_ISSUE_FILES=""
  
  if [ -n "$CASE_ISSUES" ]; then
    echo -e "${RED}Found potential case sensitivity issues:${NC}"
    
    for issue in $CASE_ISSUES; do
      MATCHING_FILES=$(grep "^$issue " /tmp/sorted_files.txt | cut -d' ' -f2-)
      echo -e "${RED}Files with name '$issue' (case-insensitive):${NC}"
      echo "$MATCHING_FILES" | while read file; do
        echo -e "  - ${RED}$file${NC}"
      done
      
      CASE_ISSUE_FILES="$CASE_ISSUE_FILES $MATCHING_FILES"
    done
    
    # Add to results file
    cat >> $RESULTS_FILE << EOL
- ⚠️ **Case sensitivity issues**: Found $(echo "$CASE_ISSUES" | wc -w | xargs) cases where files differ only by case
EOL
    
    # Save detailed results
    echo -e "# Case Sensitivity Issues\n\nThese files differ only by case, which may cause issues on macOS (case-insensitive by default):\n" > "$RESULTS_DIR/case_sensitivity.md"
    for issue in $CASE_ISSUES; do
      echo -e "## Files matching '$issue' (case-insensitive)\n" >> "$RESULTS_DIR/case_sensitivity.md"
      grep "^$issue " /tmp/sorted_files.txt | cut -d' ' -f2- >> "$RESULTS_DIR/case_sensitivity.md"
      echo -e "\n" >> "$RESULTS_DIR/case_sensitivity.md"
    done
    
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  else
    echo -e "${GREEN}No case sensitivity issues found.${NC}"
    echo -e "- ✅ No case sensitivity issues found" >> $RESULTS_FILE
  fi
  
  # Clean up temp files
  rm -f /tmp/all_files.txt /tmp/lowercase_files.txt /tmp/sorted_files.txt
  echo ""
}

# Function to check for absolute path references
check_absolute_paths() {
  echo -e "${YELLOW}Checking for absolute path references...${NC}"
  
  # Find C: drive references
  C_DRIVE_PATHS=$(grep -r --include="*.{js,jsx,ts,tsx,py,json,md,env,config}" -l 'C:/' --exclude-dir={node_modules,.git,venv,$RESULTS_DIR} . 2>/dev/null)
  
  if [ -n "$C_DRIVE_PATHS" ]; then
    echo -e "${RED}Found C: drive references in:${NC}"
    echo "$C_DRIVE_PATHS" | while read file; do
      echo -e "  - ${RED}$file${NC}"
    done
    
    # Add to results file
    cat >> $RESULTS_FILE << EOL
- ⚠️ **Absolute Windows paths**: Found C: drive references in $(echo "$C_DRIVE_PATHS" | wc -l | xargs) files
EOL
    
    # Save detailed results
    echo -e "# Absolute Windows Paths\n\nThese files contain C: drive references which won't work on macOS:\n" > "$RESULTS_DIR/absolute_paths.md"
    echo "$C_DRIVE_PATHS" | while read file; do
      echo -e "## $file\n" >> "$RESULTS_DIR/absolute_paths.md"
      grep -n 'C:/' "$file" | head -10 >> "$RESULTS_DIR/absolute_paths.md"
      echo -e "\n" >> "$RESULTS_DIR/absolute_paths.md"
    done
    
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  else
    echo -e "${GREEN}No C: drive references found.${NC}"
    echo -e "- ✅ No absolute Windows paths found" >> $RESULTS_FILE
  fi
  echo ""
}

# Function to check for shebang lines in scripts
check_shebangs() {
  echo -e "${YELLOW}Checking for Windows-specific shebang lines...${NC}"
  
  # Find scripts with Windows-specific shebangs
  WINDOWS_SHEBANGS=$(grep -r --include="*.{sh,py}" -l '^#!.*\\' --exclude-dir={node_modules,.git,venv,$RESULTS_DIR} . 2>/dev/null)
  
  if [ -n "$WINDOWS_SHEBANGS" ]; then
    echo -e "${RED}Found Windows-specific shebang lines in:${NC}"
    echo "$WINDOWS_SHEBANGS" | while read file; do
      echo -e "  - ${RED}$file${NC}"
    done
    
    # Add to results file
    cat >> $RESULTS_FILE << EOL
- ⚠️ **Windows-specific shebangs**: Found Windows-style shebang lines in $(echo "$WINDOWS_SHEBANGS" | wc -l | xargs) files
EOL
    
    # Save detailed results
    echo -e "# Windows-specific Shebangs\n\nThese files contain Windows-style shebang lines which won't work on macOS:\n" > "$RESULTS_DIR/windows_shebangs.md"
    echo "$WINDOWS_SHEBANGS" | while read file; do
      echo -e "## $file\n" >> "$RESULTS_DIR/windows_shebangs.md"
      head -1 "$file" >> "$RESULTS_DIR/windows_shebangs.md"
      echo -e "\n" >> "$RESULTS_DIR/windows_shebangs.md"
    done
    
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  else
    echo -e "${GREEN}No Windows-specific shebang lines found.${NC}"
    echo -e "- ✅ No Windows-specific shebang lines found" >> $RESULTS_FILE
  fi
  echo ""
}

# Function to check for file permissions issues
check_file_permissions() {
  echo -e "${YELLOW}Checking for executable scripts without executable permissions...${NC}"
  
  # Find script files without executable permissions
  PERMISSION_ISSUES=$(find . -name "*.sh" -o -name "*.py" -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/venv/*" -not -path "*/$RESULTS_DIR/*" -not -executable 2>/dev/null)
  
  if [ -n "$PERMISSION_ISSUES" ]; then
    echo -e "${RED}Found scripts without executable permissions:${NC}"
    echo "$PERMISSION_ISSUES" | while read file; do
      echo -e "  - ${RED}$file${NC}"
    done
    
    # Add to results file
    cat >> $RESULTS_FILE << EOL
- ⚠️ **Permission issues**: Found $(echo "$PERMISSION_ISSUES" | wc -l | xargs) scripts without executable permissions
EOL
    
    # Save detailed results
    echo -e "# Permission Issues\n\nThese script files don't have executable permissions:\n" > "$RESULTS_DIR/permission_issues.md"
    echo "$PERMISSION_ISSUES" | while read file; do
      echo "- $file" >> "$RESULTS_DIR/permission_issues.md"
    done
    
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  else
    echo -e "${GREEN}No permission issues found.${NC}"
    echo -e "- ✅ No permission issues found" >> $RESULTS_FILE
  fi
  echo ""
}

# Run all checks
check_windows_paths
check_windows_commands
check_case_sensitivity
check_absolute_paths
check_shebangs
check_file_permissions

# Update summary in results file
if [ $ISSUES_FOUND -eq 0 ]; then
  sed -i '' 's/## Summary/## Summary\n\n✅ No compatibility issues found! The codebase appears to be compatible with macOS./' $RESULTS_FILE
else
  sed -i '' "s/## Summary/## Summary\n\n⚠️ Found $ISSUES_FOUND potential compatibility issues that may affect running on macOS./" $RESULTS_FILE
fi

# Add recommendations
cat >> $RESULTS_FILE << EOL

## Recommendations

1. **Use cross-platform path handling**:
   - In JavaScript/TypeScript: Use \`path.join()\` from the Node.js path module
   - In Python: Use \`os.path.join()\` for constructing paths

2. **Use relative paths** whenever possible instead of absolute paths

3. **Windows vs macOS Commands**:
   - Replace PowerShell scripts (.ps1) with Bash scripts (.sh)
   - Use cross-platform Node.js scripts when possible

4. **File Naming**:
   - Be consistent with file casing (prefer lowercase for all filenames)
   - Don't rely on case differences to distinguish files

5. **Fix permissions**:
   - Make scripts executable with \`chmod +x script.sh\`

## Detailed Reports

Detailed findings are available in separate files in the \`$RESULTS_DIR\` directory.
EOL

echo -e "${BLUE}Compatibility check complete!${NC}"
if [ $ISSUES_FOUND -eq 0 ]; then
  echo -e "${GREEN}No compatibility issues found! The codebase appears to be compatible with macOS.${NC}"
else
  echo -e "${YELLOW}Found $ISSUES_FOUND potential compatibility issues.${NC}"
fi

echo -e "${BLUE}Results saved to ${RESULTS_DIR}/compatibility_issues.md${NC}"
echo -e "${BLUE}Run 'open ${RESULTS_DIR}/compatibility_issues.md' to view the report.${NC}" 