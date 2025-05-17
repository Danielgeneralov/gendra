from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import logging
from upload_routes import router as upload_router
from quote_service import get_quote, quote_model  # 🔁 use the modularized logic

# ✅ Enhanced logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("gendra-backend")

# ✅ FastAPI app init
app = FastAPI()

# ✅ CORS configuration with detailed logging
origins = [
    "http://localhost:3000",
    "https://gendra-beryl.vercel.app",
]

# CORS middleware with logging wrapper
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

app.include_router(upload_router)

# ✅ Schema for quote input with validation logging
class QuoteRequest(BaseModel):
    service_type: str
    material: str
    quantity: int
    complexity: Optional[float] = 1.0
    turnaround_days: Optional[int] = 7
    
    class Config:
        schema_extra = {
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

# ✅ Health check with logging
@app.get("/")
async def root():
    logger.info("Health check endpoint called")
    return {"message": "Gendra backend is running"}

# ✅ Prediction route with detailed logging
@app.post("/predict-quote", response_model=QuoteResponse)
async def predict_quote(request: Request, quote_req: QuoteRequest):
    try:
        # Log incoming request data
        logger.info(f"Processing quote request for service_type: {quote_req.service_type}")
        logger.info(f"Request body: {await request.json()}")
        
        # Validate service type
        logger.info(f"Validating service type: {quote_req.service_type}")
        if not quote_req.service_type:
            raise HTTPException(status_code=400, detail="service_type is required")
        
        # Get quote calculation
        logger.info("Calculating quote using schema-based engine")
        quote = get_quote(
            fields={
                "service_type": quote_req.service_type,
                "material": quote_req.material,
                "quantity": quote_req.quantity,
                "complexity": quote_req.complexity,
                "turnaround_days": quote_req.turnaround_days
            }
        )
        logger.info(f"Quote calculation successful: ${quote}")
        
        return {"quote": quote}
        
    except Exception as e:
        logger.error(f"Quote calculation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate quote: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Gendra backend server")
    uvicorn.run(app, host="0.0.0.0", port=8000)
