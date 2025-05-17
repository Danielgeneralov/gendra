from fastapi import FastAPI, HTTPException, Request, Response
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import logging
from upload_routes import router as upload_router
from quote_service import get_quote, quote_model

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
    "https://www.gogendra.com"  # ✅ Your live frontend
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

# ✅ Health check
@app.get("/")
async def root():
    logger.info("Health check endpoint called")
    return {"message": "Gendra backend is running"}

# ✅ Prediction route with schema-based logic
@app.post("/predict-quote", response_model=QuoteResponse)
async def predict_quote(request: Request, quote_req: QuoteRequest):
    try:
        logger.info(f"Processing quote request for service_type: {quote_req.service_type}")
        logger.info(f"Request body: {await request.json()}")

        if not quote_req.service_type:
            raise HTTPException(status_code=400, detail="service_type is required")

        quote = get_quote({
            "service_type": quote_req.service_type,
            "material": quote_req.material,
            "quantity": quote_req.quantity,
            "complexity": quote_req.complexity,
            "turnaround_days": quote_req.turnaround_days
        })

        logger.info(f"Quote calculation successful: ${quote}")
        return {"quote": quote}

    except Exception as e:
        logger.error(f"Quote calculation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate quote: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Gendra backend server")
    uvicorn.run(app, host="0.0.0.0", port=8000)
