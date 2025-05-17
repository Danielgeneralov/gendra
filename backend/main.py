from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import logging
from upload_routes import router as upload_router
from quote_service import get_quote, quote_model  # 🔁 use the modularized logic

# ✅ FastAPI app init
app = FastAPI()
app.include_router(upload_router)

# ✅ Logging config
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("gendra-backend")

# ✅ CORS middleware (development-friendly)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://gendra-beryl.vercel.app",
        "https://gendra-backend.onrender.com"
        ],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Schema for quote input
class QuoteRequest(BaseModel):
    service_type: str
    material: str
    quantity: int
    complexity: Optional[float] = 1.0
    turnaround_days: Optional[int] = 7

# ✅ Schema for quote output
class QuoteResponse(BaseModel):
    quote: float

# ✅ Health check
@app.get("/")
async def root():
    return {"message": "Gendra backend is running"}

# ✅ Prediction route
@app.post("/predict-quote", response_model=QuoteResponse)
async def predict_quote(request: QuoteRequest):
    try:
        quote = get_quote(
            quantity=request.quantity,
            complexity=request.complexity,
            material=request.material,
            service_type=request.service_type,
            turnaround_days=request.turnaround_days
        )
        return {"quote": quote}
    except Exception as e:
        logger.error(f"Quote calculation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate quote")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
