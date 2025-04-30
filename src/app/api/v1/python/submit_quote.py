from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Dict, Any, Optional
import os
from datetime import datetime
import supabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Gendra AI Quote API")

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
async def submit_quote(quote_request: QuoteRequest):
    try:
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
        
        # Insert data into Supabase
        result = supabase_client.table("quote_leads").insert(quote_data).execute()
        
        # Check for errors
        if hasattr(result, 'error') and result.error:
            raise HTTPException(status_code=500, detail=f"Failed to save quote: {result.error}")
        
        # Return success response with quote range
        lead_time_estimate = "5-7 business days" if quote_request.lead_time_preference == "Rush" else "10-14 business days"
        
        return {
            "success": True,
            "message": "Quote submitted successfully",
            "quote_range": quote_range,
            "lead_time_estimate": lead_time_estimate
        }
        
    except Exception as e:
        # Log the error and return a friendly message
        print(f"Error processing quote submission: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Optional: Add additional routes for quote history, etc.
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "api_version": "1.0.0"}

# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("submit_quote:app", host="0.0.0.0", port=8000, reload=True) 