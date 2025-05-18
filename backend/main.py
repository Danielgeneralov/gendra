from fastapi import FastAPI, HTTPException, Request, Response, Header
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
import logging
import uuid
from upload_routes import router as upload_router
from quote_service import get_quote, quote_model
from client_config import get_client_config, supabase
from quote_logger import log_quote_to_supabase

# ✅ Enhanced logging configuration
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("gendra-backend")

# ✅ FastAPI app init
app = FastAPI()

# ✅ CORS configuration (includes production domain)
origins = [
    "http://localhost:3000",
    "https://gendra-beryl.vercel.app",
    "https://www.gogendra.com",  # ✅ Your live frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
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
                "turnaround_days": 7,
            }
        }


# ✅ Schema for quote output
class QuoteResponse(BaseModel):
    quote: float
    client_branding: Optional[dict] = None


# ✅ Schema for client setup request
class BrandingConfig(BaseModel):
    theme_name: str
    logo_url: Optional[str] = None
    colors: Dict[str, str]


class ClientSetupRequest(BaseModel):
    client_id: str
    branding: BrandingConfig
    visible_fields: List[str]
    quote_schema: Dict[str, Any]

    class Config:
        json_schema_extra = {
            "example": {
                "client_id": "acme-corp",
                "branding": {
                    "theme_name": "modern",
                    "logo_url": "https://example.com/logo.png",
                    "colors": {"primary": "#FF0000", "secondary": "#00FF00"},
                },
                "visible_fields": ["service_type", "material", "quantity"],
                "quote_schema": {
                    "volume_breaks": [10, 50, 100],
                    "certification_needs": ["ISO9001"],
                    "complexity_multiplier": 1.2,
                },
            }
        }


# ✅ Client setup endpoint
@app.post("/setup-client", status_code=201)
async def setup_client(request: Request, setup_req: ClientSetupRequest):
    try:
        logger.info(
            f"Processing client setup request for client_id: {setup_req.client_id}"
        )
        logger.info(f"Request body: {await request.json()}")

        # Prepare data for insertion
        client_data = {
            "client_id": setup_req.client_id,
            "branding": setup_req.branding.dict(),
            "visible_fields": setup_req.visible_fields,
            "quote_schema": setup_req.quote_schema,
        }

        # Insert into Supabase
        try:
            response = supabase.table("client_configs").upsert(client_data).execute()
            if not response.data:
                logger.error("Failed to insert client config into Supabase")
                raise HTTPException(
                    status_code=500, detail="Failed to store client configuration"
                )

            logger.info(
                f"Successfully stored configuration for client: {setup_req.client_id}"
            )
            return {
                "message": "Client configuration created successfully",
                "client_id": setup_req.client_id,
            }

        except Exception as e:
            logger.error(f"Supabase error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error during client setup: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to setup client: {str(e)}")


# ✅ Health check
@app.get("/")
async def root():
    logger.info("Health check endpoint called")
    return {"message": "Gendra backend is running"}


# ✅ Prediction route with schema-based logic and client configuration
@app.post("/predict-quote", response_model=QuoteResponse)
async def predict_quote(
    request: Request, quote_req: QuoteRequest, x_client_id: Optional[str] = Header(None)
):
    try:
        logger.info(
            f"Processing quote request for service_type: {quote_req.service_type}"
        )
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
                raise HTTPException(
                    status_code=500,
                    detail=f"Error fetching client configuration: {str(e)}",
                )

        if not quote_req.service_type:
            raise HTTPException(status_code=400, detail="service_type is required")

        # Apply client-specific quote schema if available
        quote_schema = client_config.get("quote_schema") if client_config else None

        quote = get_quote(
            {
                "service_type": quote_req.service_type,
                "material": quote_req.material,
                "quantity": quote_req.quantity,
                "complexity": quote_req.complexity,
                "turnaround_days": quote_req.turnaround_days,
                "quote_schema": quote_schema,  # Pass schema to quote service
            }
        )

        # Generate quote ID for logging
        quote_id = str(uuid.uuid4())

        # Prepare response
        response = {
            "quote": quote,
            "client_branding": client_config.get("branding") if client_config else None,
        }

        # Log the quote non-blockingly
        try:
            log_quote_to_supabase(
                quote_id=quote_id,
                client_id=x_client_id,
                quote=quote,
                input_data=quote_req.dict(),
                metadata={
                    "source": "api_request",
                    "form_type": quote_req.service_type,
                    "client_theme": client_config.get("branding", {}).get("theme_name", "default") if client_config else "default",
                },
            )
        except Exception as e:
            logger.warning(f"Quote logging failed (non-critical): {str(e)}")
            # Continue with response regardless of logging failure

        return response

    except Exception as e:
        logger.error(f"Quote calculation error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to generate quote: {str(e)}"
        )


# ✅ Client config route
@app.get("/client-config")
async def get_configuration(
    request: Request,
    client_id: Optional[str] = None,
    x_client_id: Optional[str] = Header(None),
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
            detail="client_id must be provided either as a query parameter or x-client-id header",
        )

    try:
        config = get_client_config(final_client_id)
        logger.info(f"Successfully retrieved config for client: {final_client_id}")
        return config
    except ValueError as e:
        logger.error(f"Config not found for client {final_client_id}: {str(e)}")
        raise HTTPException(
            status_code=404,
            detail=f"Configuration not found for client: {final_client_id}",
        )
    except Exception as e:
        logger.error(f"Error fetching client config: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while fetching client configuration",
        )


if __name__ == "__main__":
    import uvicorn

    logger.info("Starting Gendra backend server")
    uvicorn.run(app, host="0.0.0.0", port=8000)
