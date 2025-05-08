# Gendra Manufacturing Quote Calculator - System Overview

## System Architecture

The Gendra Manufacturing Quote Calculator consists of:

1. **Next.js Frontend**
   - Provides user interface for quote creation across multiple manufacturing processes
   - Handles RFQ (Request For Quote) parsing via Groq API
   - Communicates with backend for accurate quote calculations
   - Includes fallback local calculation when backend is unavailable

2. **FastAPI Backend**
   - Provides quote calculation API using ML model
   - Serves as the pricing engine for more accurate quotes
   - Hosted on Render.com at https://gendra-backend.onrender.com
   - Automatically falls back to frontend calculation if unavailable

## Available Manufacturing Quote Forms

The system currently supports the following manufacturing processes:

1. **CNC Machining**
   - Materials: Aluminum, Steel, Stainless Steel, Titanium, Brass
   - Parameters: Dimensions, tolerance, surface finish, complexity
   - File: `src/components/quotes/CNCMachiningForm.tsx`

2. **Injection Molding**
   - Materials: ABS, Polypropylene, Polyethylene, Polycarbonate, Nylon, POM
   - Parameters: Part volume, part weight, surface finish, color matching
   - File: `src/components/quotes/InjectionMoldingForm.tsx`

3. **Sheet Metal**
   - Materials: Steel, Stainless Steel, Aluminum, Copper, Brass
   - Parameters: Thickness, dimensions, bends, holes, finish
   - File: `src/components/quotes/SheetMetalForm.tsx`

4. **Electronics Assembly**
   - Assembly Types: PCB Assembly, Cable/Harness Assembly, Box Build
   - Parameters: Component count, board layers, SMT/THT, testing requirements
   - File: `src/components/quotes/ElectronicsAssemblyForm.tsx`

5. **Metal Fabrication**
   - Materials: Aluminum, Steel, Stainless Steel, Copper
   - Parameters: Thickness, dimensions, complexity, finish type
   - File: `src/components/quotes/MetalFabricationForm.tsx`

## API Endpoints

### Backend Endpoints

1. **Health Check**
   - URL: `https://gendra-backend.onrender.com/`
   - Method: GET
   - Response: `{"message": "Gendra backend is running"}`

2. **Quote Prediction**
   - URL: `https://gendra-backend.onrender.com/predict-quote`
   - Method: POST
   - Payload: JSON with manufacturing parameters
   - Response: Quote amount and estimated lead time

3. **File Upload (RFQ Parsing)**
   - URL: `https://gendra-backend.onrender.com/upload`
   - Method: POST
   - Accepts: PDF, CSV, Excel files
   - Response: Extracted parameters and estimated quote

## Recent Changes and Improvements

### 1. Backend API Migration
   - Migrated from local development server to production deployment
   - Updated all forms to point to `https://gendra-backend.onrender.com` instead of localhost
   - Added comprehensive error handling and timeout protection

### 2. Next.js Build and Deployment Fixes

- **Route Conflict Resolution**: Fixed conflicts between dynamic and static routes by restructuring API routes
- **Permission Error Fix**: Resolved EPERM file permission errors in Windows during build by updating the Next.js configuration:
  - Moved `outputFileTracingExcludes` and `outputFileTracingRoot` to the root level of the Next.js config
  - This prevents trace file creation conflicts in Windows environments

### 3. RFQ Parsing Improvements

- **Dimension Conversion**: Added automatic detection and conversion from inches to millimeters
  - Values below 10 are assumed to be in inches and converted to mm (multiplied by 25.4)
  - This ensures consistent units throughout the application
- **Groq API Integration**: Updated prompt to explicitly request dimensions in millimeters
- **Fixed "ity" Field Issue**: Added handling for truncated "complexity" field in the Groq API response
  - The model sometimes returns "ity" instead of "complexity" (known issue)
  - System now handles this edge case properly

### 4. Quote Calculation Enhancements

- **ML-Based Calculation**: Replaced simple frontend calculation with backend ML model
  - More accurate quotes based on material, quantity, and complexity
  - Model trained on synthetic manufacturing data
- **Robust Fallback System**: Added automatic fallback to frontend calculation if backend is unavailable
  - Prevents system failures during backend outages
  - Notifies users about calculation method being used
- **Backend Status Indicator**: Added indicator showing whether the pricing engine is online or offline
  - Green status for online backend connection
  - Red status for offline/fallback calculation

### 5. Error Handling Improvements

- **Enhanced API Error Handling**: Improved error catch blocks in both frontend and backend
- **Timeout Protection**: Added request timeout handling to prevent hanging on backend connection issues
- **User Feedback**: Added clear error messages to inform users about calculation issues

## Project Structure

### Frontend Structure

```
src/
├── app/                    # Next.js app router
├── components/
│   ├── quotes/             # Quote form components for different manufacturing processes
│   │   ├── CNCMachiningForm.tsx
│   │   ├── ElectronicsAssemblyForm.tsx
│   │   ├── InjectionMoldingForm.tsx
│   │   ├── MetalFabricationForm.tsx
│   │   ├── SheetMetalForm.tsx
│   │   └── QuoteFormWrapper.tsx
│   └── ...                 # Other UI components
├── lib/                    # Utility functions
├── types/                  # TypeScript type definitions
└── config.ts               # Application configuration
```

### Backend Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── quote_service.py        # Quote calculation logic and ML model
├── upload_routes.py        # File upload and parsing routes
├── model.pkl               # Trained machine learning model
├── requirements.txt        # Python dependencies
└── README.md               # Backend documentation
```

## Dependencies

### Frontend Dependencies

- Next.js
- React
- TypeScript
- TailwindCSS

### Backend Dependencies

```
fastapi==0.110.0            # Web framework
uvicorn==0.28.0             # ASGI server
pydantic==2.6.3             # Data validation
python-multipart==0.0.9     # For handling file uploads
pandas==2.2.2               # For data processing
openpyxl==3.1.2             # Excel file handling
scikit-learn==1.4.0         # Machine learning
numpy==1.26.3               # Numerical computing
joblib==1.4.2               # Model serialization
pdfplumber==0.10.3          # PDF parsing
PyPDF2>=3.0.0               # PDF parsing
```

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

## Testing the Backend API

You can use the provided test script to verify the backend API is working:

```
cd /path/to/gendra/backend
python test_request.py
```

Alternatively, use PowerShell:

```
.\test_api.ps1
```

## Known Issues and Future Improvements

1. **Model Accuracy**: The ML model could be improved with real manufacturing data
2. **Backend Authentication**: Currently no authentication for the backend API
3. **Material Options**: Limited material selections - could be expanded
4. **Caching**: No quote caching mechanism implemented yet
5. **Unit Tests**: Need more comprehensive test coverage
6. **Quote Revision History**: Add ability to track and compare quote revisions
7. **User Accounts**: Implement user authentication and saved quotes

## Troubleshooting Common Issues

### Frontend Issues
- If encountering route conflicts, check for duplicate API route definitions
- For EPERM errors, verify Next.js configuration has proper `outputFileTracingExcludes`
- If backend connection fails, check network settings and ensure backend is running

### Backend Connection Issues
- Verify backend is accessible at https://gendra-backend.onrender.com
- Check CORS settings if experiencing cross-origin issues
- In Windows, use semicolons for command separation instead of `&&`

### RFQ Parsing Issues
- If dimensions aren't being properly extracted, check the Groq API prompt
- Verify the API key is correctly configured in environment variables 