#!/bin/bash
# mac_dev.sh - Development helper script for Gendra on macOS
# Run with: bash mac_dev.sh [command]

# Set colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Show help message
show_help() {
  echo -e "${BLUE}Gendra Development Helper for macOS${NC}"
  echo ""
  echo "Usage: bash mac_dev.sh [command]"
  echo ""
  echo "Available commands:"
  echo -e "  ${GREEN}start-frontend${NC}     - Start the Next.js frontend server"
  echo -e "  ${GREEN}start-backend${NC}      - Start the FastAPI backend server"
  echo -e "  ${GREEN}start-all${NC}          - Start both frontend and backend servers"
  echo -e "  ${GREEN}test-backend${NC}       - Test the backend connection"
  echo -e "  ${GREEN}test-api${NC}           - Run API tests"
  echo -e "  ${GREEN}activate-venv${NC}      - Activate Python virtual environment"
  echo -e "  ${GREEN}install-deps${NC}       - Reinstall dependencies"
  echo -e "  ${GREEN}update-deps${NC}        - Update all dependencies"
  echo -e "  ${GREEN}fix-permissions${NC}    - Fix common permission issues"
  echo -e "  ${GREEN}reset-venv${NC}         - Reset Python virtual environment"
  echo -e "  ${GREEN}help${NC}               - Show this help message"
  echo ""
}

# Start frontend server
start_frontend() {
  echo -e "${BLUE}Starting Next.js frontend server...${NC}"
  npm run dev
}

# Start backend server
start_backend() {
  echo -e "${BLUE}Starting FastAPI backend server...${NC}"
  cd backend || { echo -e "${RED}Error: backend directory not found${NC}"; exit 1; }
  source ../venv/bin/activate || { echo -e "${RED}Error: virtual environment not found${NC}"; exit 1; }
  python -m uvicorn main:app --reload
}

# Start both frontend and backend
start_all() {
  echo -e "${BLUE}Starting both frontend and backend servers...${NC}"
  echo -e "${YELLOW}Backend will start in a new Terminal window${NC}"
  
  # Start backend in a new terminal window
  osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"' && source venv/bin/activate && cd backend && python -m uvicorn main:app --reload"'
  
  # Start frontend in the current terminal
  npm run dev
}

# Test backend connection
test_backend() {
  echo -e "${BLUE}Testing backend connection...${NC}"
  
  # Test local backend
  echo -e "${YELLOW}Testing local backend at http://localhost:8000${NC}"
  curl -s http://localhost:8000 || echo -e "${RED}Local backend not running${NC}"
  
  # Test deployed backend
  echo -e "\n${YELLOW}Testing deployed backend at https://gendra-backend.onrender.com${NC}"
  curl -s https://gendra-backend.onrender.com || echo -e "${RED}Deployed backend not responding${NC}"
}

# Run API tests
test_api() {
  echo -e "${BLUE}Running API tests...${NC}"
  cd backend || { echo -e "${RED}Error: backend directory not found${NC}"; exit 1; }
  source ../venv/bin/activate || { echo -e "${RED}Error: virtual environment not found${NC}"; exit 1; }
  python test_request.py
}

# Activate virtual environment
activate_venv() {
  echo -e "${BLUE}Activating Python virtual environment...${NC}"
  source venv/bin/activate || { echo -e "${RED}Error: virtual environment not found${NC}"; exit 1; }
  echo -e "${GREEN}Virtual environment activated. Python version: $(python --version)${NC}"
  echo -e "${YELLOW}Run 'deactivate' to exit the virtual environment${NC}"
}

# Reinstall dependencies
install_deps() {
  echo -e "${BLUE}Reinstalling dependencies...${NC}"
  
  # Frontend dependencies
  echo -e "${YELLOW}Installing frontend dependencies...${NC}"
  npm install
  
  # Backend dependencies
  echo -e "${YELLOW}Installing backend dependencies...${NC}"
  source venv/bin/activate || { echo -e "${RED}Error: virtual environment not found${NC}"; exit 1; }
  pip install -r backend/requirements.txt || {
    echo -e "${YELLOW}Standard pip install failed, trying with trusted hosts...${NC}"
    pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
  }
}

# Update dependencies
update_deps() {
  echo -e "${BLUE}Updating dependencies...${NC}"
  
  # Update frontend dependencies
  echo -e "${YELLOW}Updating frontend dependencies...${NC}"
  npm update
  
  # Update backend dependencies
  echo -e "${YELLOW}Updating backend dependencies...${NC}"
  source venv/bin/activate || { echo -e "${RED}Error: virtual environment not found${NC}"; exit 1; }
  pip install --upgrade -r backend/requirements.txt
}

# Fix permissions
fix_permissions() {
  echo -e "${BLUE}Fixing common permission issues...${NC}"
  sudo chown -R $(whoami) /usr/local/lib/node_modules 2>/dev/null || echo -e "${YELLOW}No permission issues with node_modules${NC}"
  sudo chown -R $(whoami) $(pip3 show pip | grep Location | cut -d' ' -f2) 2>/dev/null || echo -e "${YELLOW}No permission issues with pip${NC}"
}

# Reset virtual environment
reset_venv() {
  echo -e "${BLUE}Resetting Python virtual environment...${NC}"
  rm -rf venv
  python3 -m venv venv
  source venv/bin/activate
  pip install -r backend/requirements.txt || {
    echo -e "${YELLOW}Standard pip install failed, trying with trusted hosts...${NC}"
    pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r backend/requirements.txt
  }
  echo -e "${GREEN}Virtual environment reset complete${NC}"
}

# Main function to handle command line arguments
main() {
  case "$1" in
    start-frontend)
      start_frontend
      ;;
    start-backend)
      start_backend
      ;;
    start-all)
      start_all
      ;;
    test-backend)
      test_backend
      ;;
    test-api)
      test_api
      ;;
    activate-venv)
      activate_venv
      ;;
    install-deps)
      install_deps
      ;;
    update-deps)
      update_deps
      ;;
    fix-permissions)
      fix_permissions
      ;;
    reset-venv)
      reset_venv
      ;;
    help|*)
      show_help
      ;;
  esac
}

# Execute main function with all arguments
main "$@" 