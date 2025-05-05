# Gendra Manufacturing Quote Calculator - System Overview

## System Architecture

The Gendra Manufacturing Quote Calculator consists of:

1. **Next.js Frontend**
   - Provides user interface for quote creation
   - Handles RFQ (Request For Quote) parsing via Groq API
   - Communicates with backend for accurate quote calculations

2. **FastAPI Backend**
   - Provides quote calculation API using ML model
   - Serves as the pricing engine for more accurate quotes
   - Automatically falls back to frontend calculation if unavailable

## Recent Changes and Improvements

### 1. Next.js Build and Deployment Fixes

- **Route Conflict Resolution**: Fixed conflicts between dynamic and static routes by restructuring API routes
- **Permission Error Fix**: Resolved EPERM file permission errors in Windows during build by updating the Next.js configuration:
  - Moved `outputFileTracingExcludes` and `outputFileTracingRoot` to the root level of the Next.js config
  - This prevents trace file creation conflicts in Windows environments

### 2. RFQ Parsing Improvements

- **Dimension Conversion**: Added automatic detection and conversion from inches to millimeters
  - Values below 10 are assumed to be in inches and converted to mm (multiplied by 25.4)
  - This ensures consistent units throughout the application
- **Groq API Integration**: Updated prompt to explicitly request dimensions in millimeters
- **Fixed "ity" Field Issue**: Added handling for truncated "complexity" field in the Groq API response
  - The model sometimes returns "ity" instead of "complexity" (known issue)
  - System now handles this edge case properly

### 3. Quote Calculation Enhancements

- **ML-Based Calculation**: Replaced simple frontend calculation with backend ML model
  - More accurate quotes based on material, quantity, and complexity
  - Model trained on synthetic manufacturing data
- **Robust Fallback System**: Added automatic fallback to frontend calculation if backend is unavailable
  - Prevents system failures during backend outages
  - Notifies users about calculation method being used
- **Backend Status Indicator**: Added indicator showing whether the pricing engine is online or offline
  - Green status for online backend connection
  - Red status for offline/fallback calculation

### 4. Error Handling Improvements

- **Enhanced API Error Handling**: Improved error catch blocks in both frontend and backend
- **Timeout Protection**: Added request timeout handling to prevent hanging on backend connection issues
- **User Feedback**: Added clear error messages to inform users about calculation issues

## Running the Application

### Frontend (Next.js)
```
cd /path/to/gendra
npm run dev
```

### Backend (FastAPI)
```
cd /path/to/gendra/backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## Known Issues and Future Improvements

1. **Model Accuracy**: The ML model could be improved with real manufacturing data
2. **Backend Authentication**: Currently no authentication for the backend API
3. **Material Options**: Limited material selections - could be expanded
4. **Caching**: No quote caching mechanism implemented yet
5. **Unit Tests**: Need more comprehensive test coverage

## Troubleshooting Common Issues

### Frontend Build Errors
- If encountering route conflicts, check for duplicate API route definitions
- For EPERM errors, verify Next.js configuration has proper `outputFileTracingExcludes`

### Backend Connection Issues
- Verify backend is running on the correct port (8000)
- Check CORS settings if experiencing cross-origin issues
- In Windows, use semicolons for command separation instead of `&&`

### RFQ Parsing Issues
- If dimensions aren't being properly extracted, check the Groq API prompt
- Verify the API key is correctly configured in environment variables 