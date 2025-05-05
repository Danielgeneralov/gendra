from fastapi import FastAPI, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr, Field
from typing import Dict, Any, Optional
import os
import json
import logging
from datetime import datetime
import supabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s'
)
logger = logging.getLogger("gendra_api")

# Setup JSON formatter for logs
class StructuredLogRecord(logging.LogRecord):
    def getMessage(self):
        msg = self.msg
        if self.args:
            if isinstance(self.args, dict):
                msg = msg.format(**self.args)
            else:
                msg = msg.format(*self.args)
        return msg

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "level": record.levelname.lower(),
            "timestamp": datetime.now().isoformat(),
            "message": record.getMessage(),
            "route": getattr(record, "route", None),
            "event": getattr(record, "event", None),
            "meta": getattr(record, "meta", {})
        }
        return json.dumps(log_record)

# Apply formatter to logger
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.handlers = [handler]

# FastAPI app
app = FastAPI(title="Gendra AI Quote API")

# Middleware to capture request information
@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Get client IP
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    else:
        client_ip = request.client.host if request.client else "unknown"
    
    # Log request
    log_extra = {
        "route": request.url.path,
        "event": "incoming_request",
        "meta": {
            "ip": client_ip,
            "method": request.method,
            "user_agent": request.headers.get("user-agent", "unknown")
        }
    }
    logger.info("Incoming request", extra=log_extra)
    
    # Process request
    response = await call_next(request)
    return response

# Supabase connection
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Initialize Supabase client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# Quote request model
class QuoteRequest(BaseModel):
    email: EmailStr
    industry: str
    material: str
    quantity: int = Field(..., gt=0)  # Must be positive
    complexity: str
    surface_finish: str
    lead_time_preference: str
    custom_fields: Optional[Dict[str, Any]] = Field(default_factory=dict)
    full_quote_shown: bool = False

# Quote response model
class QuoteResponse(BaseModel):
    success: bool
    message: str
    quote_range: Dict[str, int]
    lead_time_estimate: str

# Calculate quote based on material, quantity, and complexity
def calculate_quote(material: str, quantity: int, complexity: str) -> Dict[str, int]:
    # Base rates by material (very simplified)
    material_rates = {
        "Aluminum": 15,
        "Steel": 10,
        "Stainless Steel": 25,
        "Titanium": 50,
        "Plastic": 5,
        "default": 20
    }

    # Complexity multipliers
    complexity_multipliers = {
        "Low": 0.8,
        "Medium": 1.0,
        "High": 1.5,
        "default": 1.0
    }

    # Get base rate for material or use default
    base_rate = material_rates.get(material, material_rates["default"])
    
    # Get complexity multiplier or use default
    multiplier = complexity_multipliers.get(complexity, complexity_multipliers["default"])
    
    # Calculate base quote
    base_quote = base_rate * quantity * multiplier
    
    # Add random variation for quote range (±10%)
    min_amount = round(base_quote * 0.9)
    max_amount = round(base_quote * 1.1)
    
    return {"min_amount": min_amount, "max_amount": max_amount}

@app.post("/submit-quote", response_model=QuoteResponse)
async def submit_quote(quote_request: QuoteRequest, request: Request):
    route_path = "/submit-quote"
    try:
        # Get client IP
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"
            
        # Log quote request details (sanitized)
        logger.info("Processing quote request", extra={
            "route": route_path,
            "event": "processing_quote",
            "meta": {
                "ip": client_ip,
                "industry": quote_request.industry,
                "material": quote_request.material,
                "quantity": quote_request.quantity,
                "email_domain": quote_request.email.split("@")[1] if "@" in quote_request.email else "unknown"
            }
        })
        
        # Calculate quote range
        quote_range = calculate_quote(
            quote_request.material,
            quote_request.quantity,
            quote_request.complexity
        )
        
        # Average for quote amount to store
        quote_amount = round((quote_range["min_amount"] + quote_range["max_amount"]) / 2)
        
        # Prepare data for Supabase insert
        quote_data = {
            "email": quote_request.email,
            "industry": quote_request.industry,
            "material": quote_request.material,
            "quantity": quote_request.quantity,
            "complexity": quote_request.complexity,
            "surface_finish": quote_request.surface_finish,
            "lead_time_preference": quote_request.lead_time_preference,
            "custom_fields": quote_request.custom_fields,
            "full_quote_shown": quote_request.full_quote_shown,
            "quote_amount": quote_amount,
            "created_at": datetime.now().isoformat(),
            "is_contacted": False,
            "notes": f"Quote for {quote_request.industry}, {quote_request.material}, qty: {quote_request.quantity}"
        }
        
        logger.info("Saving quote to database", extra={
            "route": route_path,
            "event": "saving_quote",
            "meta": {
                "ip": client_ip,
                "industry": quote_request.industry,
                "quote_amount": quote_amount
            }
        })
        
        # Insert data into Supabase
        result = supabase_client.table("quote_leads").insert(quote_data).execute()
        
        # Check for errors
        if hasattr(result, 'error') and result.error:
            logger.error("Database error", extra={
                "route": route_path,
                "event": "database_error",
                "meta": {
                    "error": str(result.error)
                }
            })
            raise HTTPException(status_code=500, detail=f"Failed to save quote: {result.error}")
        
        # Return success response with quote range
        lead_time_estimate = "5-7 business days" if quote_request.lead_time_preference == "Rush" else "10-14 business days"
        
        logger.info("Quote submitted successfully", extra={
            "route": route_path,
            "event": "quote_success",
            "meta": {
                "ip": client_ip,
                "industry": quote_request.industry,
                "quote_min": quote_range["min_amount"],
                "quote_max": quote_range["max_amount"]
            }
        })
        
        return {
            "success": True,
            "message": "Quote submitted successfully",
            "quote_range": quote_range,
            "lead_time_estimate": lead_time_estimate
        }
        
    except Exception as e:
        # Log the error with structured format
        logger.error("Quote submission error", extra={
            "route": route_path,
            "event": "quote_error",
            "meta": {
                "error_type": type(e).__name__,
                "error_message": str(e)
            }
        })
        raise HTTPException(status_code=500, detail="Internal server error")

# Optional: Add additional routes for quote history, etc.
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    logger.info("Health check", extra={
        "route": "/health",
        "event": "health_check",
        "meta": {
            "status": "healthy"
        }
    })
    return {"status": "healthy", "api_version": "1.0.0"}

# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting API server", extra={
        "event": "server_start",
        "meta": {
            "host": "0.0.0.0",
            "port": 8000
        }
    })
    uvicorn.run("submit_quote:app", host="0.0.0.0", port=8000, reload=True) 