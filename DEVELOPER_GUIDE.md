# Gendra Developer Guide

This guide provides comprehensive information for developers working on the Gendra Manufacturing Quote Calculator application. It covers the project architecture, development workflow, and key components.

## Project Overview

Gendra is a manufacturing quote calculator that provides instant quotes for various manufacturing processes:

- CNC Machining
- Injection Molding
- Sheet Metal
- Electronics Assembly
- Metal Fabrication

The application integrates with machine learning models to provide accurate quotes based on material properties, dimensions, complexity, and other manufacturing parameters.

## System Architecture

![Gendra Architecture](https://mermaid.ink/img/pako:eNp1kU1PwzAMhv9KlBOI9Q9UQkLigFSQkMYFcQlNvC6o-ZCSVEiI_07SblTdxsWx_T7PdewFlEYJxbDRC3EfC205rdzEarQRrnGFOZwjuYy8WcjQSm3iDJ_DLQiD_9Tz_OcMWF-3J7bP76DJHbqtKOgfHXEHPL1kxMc9CkPoOnBvTYvVYcOjjrlnLaXqH7vOlh3jqsahpVZh-jJ-t6Yq-RtF-ZNsmnbpLpWA7AuKSaGfWWUqjbtdkOmFVj7aZjBE4Dp5xYP0cK7KnpKxU20KXIEVLmDqBFYoJVuKSQh46h0e-xSG0aRAtDKH_GxMGmRdUhS-FrDG0DKFH4GrY8NbDHnXp-gKKXlVFlXBGzcS2cbCgduC_7t0ueJzw9-uJMBbSyaXVrFMuCv0TZfKPQpB3tAQRXKAjsI2N8ORbTxn2xvjnM-2)

### Frontend (Next.js)

- **UI Layer**: React components for quote forms and user interface
- **State Management**: React hooks for local state management
- **API Integration**: Fetch API for backend communication
- **Fallback Logic**: Local calculation when backend is unavailable

### Backend (FastAPI)

- **API Layer**: FastAPI endpoints for quote calculation
- **ML Integration**: Scikit-learn model for quote prediction
- **File Processing**: PDF and spreadsheet parsing for RFQ documents
- **Quote Service**: Business logic for quote calculation

## Development Setup

### Prerequisites

- Node.js 16+ and npm
- Python 3.9+
- Git

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/gendra.git
   cd gendra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\\Scripts\\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

6. Access the API at http://localhost:8000

## Key Components

### Quote Forms

The quote forms are the core of the application, located in `src/components/quotes/`:

- Each manufacturing process has its own form component
- All forms follow a consistent pattern with backend integration
- Forms include fallback calculation logic for offline operation

### Backend API

The backend API is built with FastAPI and provides these endpoints:

1. **Health Check** (`GET /`): 
   - Verifies the backend is operational

2. **Quote Prediction** (`POST /predict-quote`):
   - Calculates quotes based on manufacturing parameters
   - Uses ML model for prediction

3. **File Upload** (`POST /upload`):
   - Parses RFQ documents for automated quote generation

## Development Workflow

### Adding Features

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement the feature**:
   - Update frontend components
   - Add backend endpoints if needed
   - Update documentation

3. **Test thoroughly**:
   - Test with backend online and offline
   - Test on different browsers and screen sizes
   - Verify all manufacturing process forms

4. **Submit a pull request**:
   - Provide a detailed description of changes
   - Link to any related issues

### Code Style

- **Frontend**: Follow the existing React/Next.js patterns
- **Backend**: Follow PEP 8 guidelines for Python code
- **Documentation**: Keep documentation up-to-date with changes

## Deployment

### Frontend Deployment

The frontend is deployed to Vercel:

1. Connect your repository to Vercel
2. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: URL of the deployed backend

### Backend Deployment

The backend is deployed to Render.com:

1. Create a new Web Service on Render
2. Configure the build command: `pip install -r requirements.txt`
3. Configure the start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Monitoring and Troubleshooting

### Frontend Monitoring

- Check browser console for errors
- Review network requests to backend
- Monitor the backend status indicator

### Backend Monitoring

- Check application logs on Render.com
- Monitor API response times
- Review error logs for exceptions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Render.com Documentation](https://render.com/docs)

## Contact

For questions or issues, please contact the project maintainers or create an issue in the GitHub repository. 