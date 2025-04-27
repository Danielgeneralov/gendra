from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Gendra Backend API")

class QuoteRequest(BaseModel):
    material: str
    quantity: int
    complexity: Optional[float] = 1.0
    
class QuoteResponse(BaseModel):
    quote: float

@app.get("/")
async def root():
    return {"message": "Gendra backend is running"}

@app.post("/predict-quote", response_model=QuoteResponse)
async def predict_quote(request: QuoteRequest):
    # Dummy implementation - will be replaced with actual prediction logic
    return {"quote": 123.45}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 