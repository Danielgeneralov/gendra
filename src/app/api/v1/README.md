# Gendra API v1 Documentation

This directory contains the API endpoints for the Gendra quoting platform. The API is structured to follow Next.js 15 App Router conventions and best practices.

## API Endpoints

### Quote Calculation

- **Endpoint**: `/api/v1/quote-calculate`
- **Method**: `POST`
- **Query Parameters**: 
  - `industryId`: (required) The industry identifier for the quote
- **Description**: Calculates a quote based on specifications and industry
- **Responsibilities**: 
  - Forwards calculation requests to the Python backend
  - Provides fallback calculation if the backend is unavailable
  - Returns complete quote data including pricing and lead time
- **Implementation**: Uses Python backend service for accurate calculations

### Industry Configuration 

- **Endpoint**: `/api/v1/quote-config/[industryId]`
- **Method**: `GET`
- **URL Parameters**:
  - `industryId`: The industry identifier
- **Description**: Returns static pricing configuration data for a specific industry
- **Responsibilities**:
  - Provides pricing factors, material costs, and complexity levels
  - Does NOT perform quote calculations
  - Serves configuration data to frontend components

### Quote Submission

- **Endpoint**: `/api/v1/submit-quote`
- **Method**: `POST`
- **Description**: Submits a finalized quote to be stored in the database
- **Responsibilities**:
  - Saves quote data to Supabase
  - Calculates final pricing if needed (using Python backend)
  - Returns confirmation with quote range and lead time

### Root Endpoint

- **Endpoint**: `/api/v1`
- **Method**: `GET`
- **Query Parameters**: 
  - `industryId`: (optional) If provided, redirects to industry configuration
- **Description**: Returns API documentation and available industries
- **Responsibilities**:
  - Provides API documentation and available endpoints
  - Redirects to industry configuration if industryId is provided

## Troubleshooting

### Route Conflicts

If you encounter route conflicts:

1. Ensure each route has distinct responsibilities
2. Avoid mixing dynamic and static routes with similar patterns
3. Use clear naming conventions for all endpoints
4. Don't use context parameters (`context: { params }`) in POST handlers

### Calculation Backend

The quote calculation system:

1. Primarily uses the Python backend API (`http://localhost:8000/calculate-quote`)
2. Falls back to simplified JS calculation if backend is unavailable
3. Tracks which method was used via the `calculatedBy` field

### Quote Flow

The typical quote flow is:

1. Frontend calls `/api/v1/quote-calculate` with specifications
2. Next.js API forwards the request to Python backend
3. Result is returned to frontend for display
4. When customer submits email, `/api/v1/submit-quote` is called to save the quote

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `