# Gendra Installation Guide

This guide provides simplified, step-by-step instructions to get Gendra up and running quickly on a new computer.

## Prerequisites

- **Node.js** (v18+): [Download](https://nodejs.org/)
- **Python** (v3.9+): [Download](https://www.python.org/downloads/)
- **Git**: [Download](https://git-scm.com/downloads)

## Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/gendra.git
cd gendra
```

### 2. Set Up the Frontend

```bash
# Install dependencies
npm install
```

### 3. Set Up Environment Variables

Create a file named `.env.local` in the project root with the required environment variables. 

For detailed instructions and required values, refer to the [Environment Variables Setup Guide](ENV_SETUP.md).

At minimum, you need:

```
NEXT_PUBLIC_API_URL=https://gendra-backend.onrender.com
```

> **Note**: If you don't have Supabase credentials, the frontend will still work with the backend for quote calculations, but authentication features will be disabled.

### 4. Start the Frontend

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000)

### 5. (Optional) Set Up the Backend Locally

If you need to run the backend locally (instead of using the deployed version at gendra-backend.onrender.com):

```bash
# Navigate to backend directory
cd backend

# Create and activate a virtual environment
# Windows:
python -m venv venv
venv\Scripts\activate

# macOS/Linux:
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

The backend API will be available at [http://localhost:8000](http://localhost:8000)

If running the backend locally, update your `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Verify Installation

### 1. Check Frontend

- Open [http://localhost:3000](http://localhost:3000) in your browser
- You should see the Gendra homepage

### 2. Check Backend

- Open [http://localhost:8000](http://localhost:8000) in your browser (if running locally)
- Or check [https://gendra-backend.onrender.com](https://gendra-backend.onrender.com)
- You should see: `{"message":"Gendra backend is running"}`

### 3. Test Quote Generation

1. Navigate to any quote form
2. Fill in the form fields
3. Click "Calculate Quote"
4. Verify that a quote is generated

## Troubleshooting

### Common Issues

1. **Node.js Version Conflicts**
   - Use `nvm` (Node Version Manager) to switch to the required Node.js version

2. **Python Path Issues**
   - Ensure Python is in your PATH
   - Make sure to activate the virtual environment before running backend commands

3. **Port Already in Use**
   - If port 3000 or 8000 is already in use, you can specify different ports:
     - Frontend: `npm run dev -- -p 3001`
     - Backend: `uvicorn main:app --reload --port 8001`

4. **Backend Connection Errors**
   - Check if the backend is running (locally or on Render)
   - Verify that CORS settings allow connections from your frontend origin

For more detailed information, refer to the full documentation in:
- ONBOARDING.md - Complete system overview
- DEVELOPER_GUIDE.md - Detailed development workflow
- backend/README.md - Backend-specific documentation 