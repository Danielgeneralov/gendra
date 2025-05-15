# macOS Troubleshooting Guide for Gendra

This guide addresses common issues you might encounter when setting up and running the Gendra project on macOS.

## Setup Issues

### Homebrew Installation Failures

**Issue:** Homebrew installation fails or throws permissions errors.

**Solution:**
```bash
# Try with sudo
sudo /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# If issues persist, repair directory permissions
sudo chown -R $(whoami) /usr/local
```

### Python Version Conflicts

**Issue:** Multiple Python versions causing conflicts.

**Solution:**
```bash
# Install pyenv to manage Python versions
brew install pyenv

# Install desired Python version
pyenv install 3.9.13

# Set as global default
pyenv global 3.9.13

# Add to your shell profile
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
```

### Node.js Version Issues

**Issue:** Node.js version incompatibility.

**Solution:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Source nvm
source ~/.zshrc

# Install and use Node.js 18
nvm install 18
nvm use 18
```

## Running Issues

### FastAPI Server Fails to Start

**Issue:** `uvicorn` command not found or fails to start.

**Solution:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Try alternative syntax
python -m uvicorn main:app --reload

# Reinstall uvicorn
pip install --upgrade uvicorn
```

### Next.js Dev Server Issues

**Issue:** Next.js won't start or has module resolution errors.

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Try with explicit port if default port is in use
npm run dev -- -p 3001
```

### Environment Variable Problems

**Issue:** Environment variables not loading properly.

**Solution:**
- Make sure `.env.local` is in the project root
- Check format for no spaces around equal signs
- Make sure values aren't surrounded by quotes unless needed
- Try exporting variables directly in terminal:
  ```bash
  export NEXT_PUBLIC_API_URL=https://gendra-backend.onrender.com
  ```

## Permission Issues

### Node.js Global Packages

**Issue:** Permission denied when installing global npm packages.

**Solution:**
```bash
# Fix ownership of npm directories
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) ~/.npm
```

### Python Package Installation Failures

**Issue:** Permission denied when installing Python packages.

**Solution:**
```bash
# Fix ownership of site-packages
sudo chown -R $(whoami) $(pip3 show pip | grep Location | cut -d' ' -f2)

# Or use --user flag
pip install --user -r backend/requirements.txt
```

## Network Issues

### API Connection Problems

**Issue:** Can't connect to local or remote backend API.

**Solution:**
```bash
# Test local backend
curl http://localhost:8000

# Test remote backend
curl https://gendra-backend.onrender.com

# Check macOS firewall settings
# System Preferences > Security & Privacy > Firewall
# Allow incoming connections for Terminal, Python and Node
```

### SSL Certificate Errors

**Issue:** SSL certificate verification fails during pip install.

**Solution:**
```bash
# Use trusted-host flag
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt

# If needed, install certificates package
pip install certifi
```

## IDE & Development Tools

### VSCode Python Path

**Issue:** VSCode can't find the Python interpreter in the virtual environment.

**Solution:**
1. Open VSCode command palette (Cmd+Shift+P)
2. Type "Python: Select Interpreter"
3. Choose the interpreter in the `venv` folder

### Git Line Ending Issues

**Issue:** Files modified by git due to line ending differences.

**Solution:**
```bash
# Set git to handle line endings properly
git config --global core.autocrlf input

# Reset files to remove line ending changes
git checkout -- .
```

## Specific Application Issues

### macOS-Specific Path Handling

**Issue:** Path separator differences causing issues (Windows uses `\`, macOS uses `/`).

**Solution:**
- Search codebase for hardcoded Windows-style paths
- Use path utilities like `path.join()` in Node.js or `os.path.join()` in Python

### Font Rendering Issues

**Issue:** Custom fonts not loading or rendering correctly.

**Solution:**
- Clear browser cache
- Verify font files are properly included in the project
- Check for macOS-specific font rendering settings

## Helper Scripts

Remember that two helper scripts are available for macOS:

1. **mac_setup.sh** - Initial setup script
   ```bash
   bash mac_setup.sh
   ```

2. **mac_dev.sh** - Development helper script
   ```bash
   bash mac_dev.sh help
   ```

## Contact Support

If you encounter issues not covered in this guide, please contact the project maintainers or create an issue in the GitHub repository. 