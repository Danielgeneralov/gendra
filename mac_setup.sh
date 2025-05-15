#!/bin/bash
# mac_setup.sh - Setup script for Gendra project on macOS
# Run with: bash mac_setup.sh

echo "🚀 Starting Gendra setup for macOS..."

# Install Homebrew if not already installed
if ! command -v brew &> /dev/null; then
  echo "🍺 Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  
  # Add Homebrew to PATH for this session
  eval "$(/opt/homebrew/bin/brew shellenv)"
  
  # Add Homebrew to PATH permanently
  if [[ -f ~/.zshrc ]]; then
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
  else
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.bash_profile
  fi
else
  echo "✅ Homebrew already installed"
fi

# Install Node.js
if ! command -v node &> /dev/null; then
  echo "📦 Installing Node.js..."
  brew install node
else
  echo "✅ Node.js already installed: $(node --version)"
fi

# Install Python
if ! command -v python3 &> /dev/null; then
  echo "🐍 Installing Python 3.9..."
  brew install python@3.9
else
  echo "✅ Python already installed: $(python3 --version)"
fi

# Install helpful Mac tools
echo "🔧 Installing helpful macOS development tools..."
brew install --cask iterm2
brew install git

# Configure Git line endings
echo "⚙️ Configuring Git line endings for cross-platform compatibility..."
git config --global core.autocrlf input

# Create and setup Python virtual environment
echo "🐍 Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate
echo "🔄 Installing Python dependencies..."
pip install -r backend/requirements.txt || {
  echo "⚠️ Standard pip install failed, trying with trusted hosts..."
  pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
}

# Install frontend dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local file..."
  cat > .env.local << EOL
NEXT_PUBLIC_API_URL=https://gendra-backend.onrender.com
# Add your Supabase credentials below if available
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL
  echo "✅ Created .env.local with default configuration"
fi

# Ensure proper permissions
echo "🔒 Setting correct permissions..."
sudo chown -R $(whoami) /usr/local/lib/node_modules 2>/dev/null || echo "⚠️ No permission issues with node_modules"
sudo chown -R $(whoami) $(pip3 show pip | grep Location | cut -d' ' -f2) 2>/dev/null || echo "⚠️ No permission issues with pip"

echo "
✅ Setup complete! 

To start the frontend:
  npm run dev

To start the backend:
  cd backend
  source ../venv/bin/activate
  python -m uvicorn main:app --reload

Happy coding! 🚀
" 