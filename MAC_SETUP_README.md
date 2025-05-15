# Mac Setup Guide for Gendra

This guide will help you set up the Gendra project on your Mac. It includes step-by-step instructions and helper scripts to ensure a smooth transition from Windows to Mac.

## Quick Start

1. Clone the repository and navigate to the project directory
2. Make the helper scripts executable
3. Run the setup script
4. Start the application

```bash
# Clone the repository (replace with actual repository URL)
git clone https://github.com/your-org/gendra.git
cd gendra

# Make helper scripts executable
chmod +x mac_setup.sh mac_dev.sh check_mac_compatibility.sh

# Run the setup script
./mac_setup.sh

# Start the application (frontend and backend)
./mac_dev.sh start-all
```

## Available Helper Scripts

### 1. `mac_setup.sh` - Initial Setup Script

This script automates the initial setup process:

- Installs Homebrew (if not installed)
- Installs Node.js and Python
- Sets up the Python virtual environment
- Installs all dependencies
- Creates default environment files
- Fixes common permission issues

Run it with:

```bash
./mac_setup.sh
```

### 2. `mac_dev.sh` - Development Helper

This script provides commands for common development tasks:

```bash
# Start frontend server
./mac_dev.sh start-frontend

# Start backend server
./mac_dev.sh start-backend

# Start both servers at once
./mac_dev.sh start-all

# Test API connection
./mac_dev.sh test-api

# See all available commands
./mac_dev.sh help
```

### 3. `check_mac_compatibility.sh` - Compatibility Checker

This script scans the codebase for potential Mac compatibility issues:

- Windows-style paths (backslashes)
- Windows-specific commands
- Case sensitivity issues
- Absolute path references
- Windows-specific shebang lines
- Permission issues

Run it with:

```bash
./check_mac_compatibility.sh
```

Results will be saved to the `mac_compatibility_results` directory.

## Manual Setup (if scripts don't work)

If you prefer to set up manually or encounter issues with the scripts:

1. **Install Prerequisites**:
   ```bash
   # Install Homebrew
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Node.js and Python
   brew install node python@3.9
   ```

2. **Set up Virtual Environment**:
   ```bash
   # Create and activate virtual environment
   python3 -m venv venv
   source venv/bin/activate
   
   # Install Python dependencies
   pip install -r backend/requirements.txt
   ```

3. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

4. **Create Environment Files**:
   ```bash
   # Create .env.local with minimum required variables
   echo "NEXT_PUBLIC_API_URL=https://gendra-backend.onrender.com" > .env.local
   ```

5. **Start the Application**:
   ```bash
   # Start backend (in one terminal)
   cd backend
   source ../venv/bin/activate
   python -m uvicorn main:app --reload
   
   # Start frontend (in another terminal)
   npm run dev
   ```

## Troubleshooting

For detailed troubleshooting information, refer to:

1. **MAC_TROUBLESHOOTING.md** - Specific Mac troubleshooting guide
2. **ONBOARDING.md** - General project documentation with Mac-specific sections
3. **INSTALL_GUIDE.md** - Installation guide with Mac-specific sections

Common issues are also addressed in these files.

## Working with Git in a Cross-Platform Environment

1. **Line Endings**: Configure Git to handle line endings properly:
   ```bash
   git config --global core.autocrlf input
   ```

2. **File Permissions**: If you're sharing code with Windows users, be aware that Git may mark files as changed because of permission changes. To ignore permission changes:
   ```bash
   git config --global core.fileMode false
   ```

3. **Case Sensitivity**: macOS is case-insensitive by default, but Git is case-sensitive. Be careful with file renames that only change case.

## Additional Tools

1. **iTerm2** - Better terminal experience:
   ```bash
   brew install --cask iterm2
   ```

2. **Visual Studio Code** - Recommended editor:
   ```bash
   brew install --cask visual-studio-code
   ```

3. **NVM** (Node Version Manager) - For managing Node.js versions:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```

## Need Help?

If you encounter issues not covered in the documentation, please contact the project maintainers or create an issue in the GitHub repository. 