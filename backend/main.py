from fastapi import FastAPI, HTTPException, Request, Response, Header
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import logging
from upload_routes import router as upload_router
from quote_service import get_quote, quote_model
from client_config import get_client_config

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
    client_branding: Optional[dict] = None

# ✅ Health check
@app.get("/")
async def root():
    logger.info("Health check endpoint called")
    return {"message": "Gendra backend is running"}

# ✅ Prediction route with schema-based logic and client configuration
@app.post("/predict-quote", response_model=QuoteResponse)
async def predict_quote(
    request: Request, 
    quote_req: QuoteRequest,
    x_client_id: Optional[str] = Header(None)
):
    try:
        logger.info(f"Processing quote request for service_type: {quote_req.service_type}")
        logger.info(f"Request body: {await request.json()}")
        logger.info(f"Client ID from header: {x_client_id}")

        # Get client configuration if client ID is provided
        client_config = None
        if x_client_id:
            try:
                client_config = get_client_config(x_client_id)
                logger.info(f"Using configuration for client: {x_client_id}")
            except ValueError as e:
                logger.warning(f"Client config not found: {str(e)}")
                # Continue with default configuration
            except Exception as e:
                logger.error(f"Error fetching client config: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Error fetching client configuration: {str(e)}")

        if not quote_req.service_type:
            raise HTTPException(status_code=400, detail="service_type is required")

        # Apply client-specific quote schema if available
        quote_schema = client_config.get("quote_schema") if client_config else None
        
        quote = get_quote({
            "service_type": quote_req.service_type,
            "material": quote_req.material,
            "quantity": quote_req.quantity,
            "complexity": quote_req.complexity,
            "turnaround_days": quote_req.turnaround_days,
            "quote_schema": quote_schema  # Pass schema to quote service
        })

        response = {
            "quote": quote,
            "client_branding": client_config.get("branding") if client_config else None
        }

        logger.info(f"Quote calculation successful: ${quote}")
        return response

    except Exception as e:
        logger.error(f"Quote calculation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate quote: {str(e)}")

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
