from fastapi import FastAPI, HTTPException, Request, Response, Header, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from dotenv import load_dotenv, find_dotenv
from pathlib import Path
from upload_routes import router as upload_router
from quote_service import get_quote
from supabase_service import supabase_service
from client_config import get_client_config
import sys

# Add this print statement to see if the script is even starting here
print("DEBUG: Script execution reached the very top of main.py")

# Load environment variables from .env file
# First, try to find using find_dotenv (searches up the directory tree)
dotenv_file_path = find_dotenv()

# If find_dotenv doesn't find it, specify the expected location relative to this file
if not dotenv_file_path:
    # Convert Path object to string before assigning to dotenv_file_path if needed
    dotenv_file_path = str(Path(__file__).parent / ".env")

# Check if the file actually exists before attempting to load
if dotenv_file_path and os.path.exists(dotenv_file_path):
    print(f"DEBUG: Attempting to load .env from: {os.path.abspath(dotenv_file_path)}")
    load_dotenv(dotenv_file_path, override=True)
else:
    print(f"DEBUG: .env file not found at expected path: {os.path.abspath(dotenv_file_path) if dotenv_file_path else 'None'}")
    # Decide how to handle this case - maybe raise an error or just log a warning

# Debug: Print current working directory
print(f"DEBUG: Current working directory: {os.getcwd()}")

# Debug: List all files in current directory
print("DEBUG: Files in current directory:")
for file in os.listdir():
    print(f"  - {file}")

# Debugging: Print environment variables after loading
print(f"DEBUG: NEXT_PUBLIC_SUPABASE_URL: {os.getenv('NEXT_PUBLIC_SUPABASE_URL')}")
print(f"DEBUG: SUPABASE_SERVICE_ROLE_KEY: {os.getenv('SUPABASE_SERVICE_ROLE_KEY')}")

# ✅ Enhanced logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("gendra-backend")

# ✅ FastAPI app init
app = FastAPI()

# ✅ CORS configuration (includes production domain)
origins = [
    "http://localhost:3000",
    "https://gendra-beryl.vercel.app",
    "https://www.gogendra.com",  # ✅ Your live frontend
    "https://gendra-backend.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600
)

# ✅ Middleware for detailed request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming {request.method} request to {request.url}")
    logger.info(f"Request headers: {request.headers}")
    if request.method == "OPTIONS":
        logger.info("Processing CORS preflight request")
    response = await call_next(request)
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response headers: {response.headers}")
    return response

# ✅ Optional: respond to unexpected OPTIONS explicitly
@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    logger.info(f"OPTIONS preflight request to /{rest_of_path}")
    return Response(status_code=200)

# ✅ Include upload routes
app.include_router(upload_router)

# ✅ Schema for quote input
class QuoteRequest(BaseModel):
    service_type: str
    material: str
    quantity: int
    complexity: Optional[float] = 1.0
    turnaround_days: Optional[int] = 7
    customer_email: Optional[EmailStr]
    customer_name: Optional[str]
    company_name: Optional[str]
    additional_notes: Optional[str]

    class Config:
        json_schema_extra = {
            "example": {
                "service_type": "cnc_machining",
                "material": "aluminum",
                "quantity": 10,
                "complexity": 1.0,
                "turnaround_days": 7
            }
        }

# ✅ Schema for quote output
class QuoteResponse(BaseModel):
    quote: float
    quote_id: str

# ✅ Schema for lead request
class LeadRequest(BaseModel):
    email: EmailStr
    name: Optional[str]
    company_name: Optional[str]
    phone: Optional[str]
    interest_type: str
    message: Optional[str]
    source: Optional[str]

# ✅ Schema for user registration
class UserRegistration(BaseModel):
    email: EmailStr
    full_name: Optional[str]
    company_name: Optional[str]
    role: Optional[str] = "user"
    subscription_status: Optional[str] = "free"

# ✅ Schema for portal config
class PortalConfig(BaseModel):
    company_id: str
    company_name: str
    logo_url: Optional[str]
    primary_color: Optional[str]
    secondary_color: Optional[str]
    custom_domain: Optional[str]
    features: Optional[Dict[str, Any]]
    settings: Optional[Dict[str, Any]]

# ✅ Health check
@app.get("/")
async def root():
    logger.info("Health check endpoint called")
    return {"message": "Gendra backend is running"}

# ✅ Quote prediction and storage
@app.post("/predict-quote", response_model=QuoteResponse)
async def predict_quote(request: QuoteRequest):
    try:
        # Calculate quote
        quote_amount = get_quote({
            "service_type": request.service_type,
            "material": request.material,
            "quantity": request.quantity,
            "complexity": request.complexity,
            "turnaround_days": request.turnaround_days
        })

        # Save to Supabase
        quote_data = {
            "service_type": request.service_type,
            "material": request.material,
            "quantity": request.quantity,
            "complexity": request.complexity,
            "turnaround_days": request.turnaround_days,
            "quote_amount": quote_amount,
            "customer_email": request.customer_email,
            "customer_name": request.customer_name,
            "company_name": request.company_name,
            "additional_notes": request.additional_notes
        }
        
        saved_quote = await supabase_service.save_quote(quote_data)
        
        return {
            "quote": quote_amount,
            "quote_id": saved_quote["id"]
        }
    except Exception as e:
        logger.error(f"Quote calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate quote")

# ✅ Lead capture
@app.post("/capture-lead")
async def capture_lead(request: LeadRequest):
    try:
        lead_data = request.dict()
        saved_lead = await supabase_service.save_lead(lead_data)
        return {"status": "success", "lead_id": saved_lead["id"]}
    except Exception as e:
        logger.error(f"Lead capture error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to capture lead")

# ✅ User registration
@app.post("/register-user")
async def register_user(request: UserRegistration):
    try:
        user_data = request.dict()
        saved_user = await supabase_service.create_user(user_data)
        return {"status": "success", "user_id": saved_user["id"]}
    except Exception as e:
        logger.error(f"User registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to register user")

# ✅ Portal configuration
@app.post("/save-portal-config")
async def save_portal_config(request: PortalConfig):
    try:
        config_data = request.dict()
        saved_config = await supabase_service.save_portal_config(config_data)
        return {"status": "success", "config_id": saved_config["id"]}
    except Exception as e:
        logger.error(f"Portal config error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save portal configuration")

# ✅ Client config route
@app.get("/client-config")
async def get_configuration(
    request: Request,
    client_id: Optional[str] = None,
    x_client_id: Optional[str] = Header(None)
):
    logger.info("Client config endpoint called")
    logger.info(f"Query param client_id: {client_id}")
    logger.info(f"Header x-client-id: {x_client_id}")
    
    # Use client_id from query param or header
    final_client_id = client_id or x_client_id
    
    if not final_client_id:
        logger.error("No client_id provided in query param or header")
        raise HTTPException(
            status_code=400,
            detail="client_id must be provided either as a query parameter or x-client-id header"
        )
    
    try:
        config = get_client_config(final_client_id)
        logger.info(f"Successfully retrieved config for client: {final_client_id}")
        return config
    except ValueError as e:
        logger.error(f"Config not found for client {final_client_id}: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Configuration not found for client: {final_client_id}")
    except Exception as e:
        logger.error(f"Error fetching client config: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching client configuration")

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Gendra backend server")
    uvicorn.run(app, host="0.0.0.0", port=8000)
