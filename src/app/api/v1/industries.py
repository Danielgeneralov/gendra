from fastapi import APIRouter, HTTPException, Path
from fastapi.responses import JSONResponse
import os
import json
from typing import List, Dict, Any, Optional
import numpy as np
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["industries"])

# Path to the industry configuration files
INDUSTRIES_DIR = os.path.join(os.path.dirname(__file__), "../../models/industries")


class QuoteRequest(BaseModel):
    """Request model for quote calculation"""
    # Dynamic fields will be validated at runtime


class QuoteResponse(BaseModel):
    """Response model for quote calculation"""
    quote: float
    leadTime: str
    complexity: str
    basePrice: float
    materialCost: float
    complexityFactor: float
    quantityDiscount: float


def load_industry_configs() -> List[Dict[str, Any]]:
    """Load all industry configurations from the directory"""
    industries = []
    
    # Create directory if it doesn't exist
    if not os.path.exists(INDUSTRIES_DIR):
        os.makedirs(INDUSTRIES_DIR)
    
    for filename in os.listdir(INDUSTRIES_DIR):
        if filename.endswith('.json'):
            try:
                with open(os.path.join(INDUSTRIES_DIR, filename), 'r') as f:
                    industry_config = json.load(f)
                    # Add id from filename if not specified
                    if 'id' not in industry_config:
                        industry_config['id'] = os.path.splitext(filename)[0]
                    industries.append(industry_config)
            except Exception as e:
                print(f"Error loading industry config {filename}: {e}")
    
    return industries


def get_industry_config(industry_id: str) -> Optional[Dict[str, Any]]:
    """Get configuration for a specific industry"""
    try:
        # Try direct file lookup first
        config_path = os.path.join(INDUSTRIES_DIR, f"{industry_id}.json")
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                config = json.load(f)
                config['id'] = industry_id
                return config
        
        # If not found, scan all configs
        for config in load_industry_configs():
            if config.get('id') == industry_id:
                return config
        
        return None
    except Exception as e:
        print(f"Error loading industry config for {industry_id}: {e}")
        return None


def validate_quote_request(industry_config: Dict[str, Any], request_data: Dict[str, Any]) -> bool:
    """Validate the quote request against the industry configuration"""
    required_fields = [field['id'] for field in industry_config.get('formFields', []) if field.get('required', False)]
    
    for field_id in required_fields:
        if field_id not in request_data:
            return False
    
    return True


@router.get("/industries")
async def get_industries():
    """Get list of all available industries"""
    industries = load_industry_configs()
    
    # Return only the necessary information for listing
    simplified_industries = []
    for industry in industries:
        simplified_industries.append({
            "id": industry.get("id", ""),
            "name": industry.get("name", ""),
            "description": industry.get("description", ""),
            "icon": industry.get("icon", "")
        })
    
    return {"industries": simplified_industries}


@router.get("/industries/{industry_id}")
async def get_industry(industry_id: str = Path(..., description="ID of the industry")):
    """Get configuration for a specific industry"""
    industry_config = get_industry_config(industry_id)
    
    if not industry_config:
        raise HTTPException(status_code=404, detail=f"Industry '{industry_id}' not found")
    
    return industry_config


@router.post("/quote/{industry_id}")
async def calculate_quote(request_data: Dict[str, Any], industry_id: str = Path(..., description="ID of the industry")):
    """Calculate quote for a specific industry"""
    industry_config = get_industry_config(industry_id)
    
    if not industry_config:
        raise HTTPException(status_code=404, detail=f"Industry '{industry_id}' not found")
    
    # Validate request data
    if not validate_quote_request(industry_config, request_data):
        raise HTTPException(status_code=400, detail="Invalid request data")
    
    try:
        # Extract relevant fields based on industry
        complexity_field = next((f for f in industry_config.get('formFields', []) if f.get('id') == 'complexity'), None)
        material_field = next((f for f in industry_config.get('formFields', []) if f.get('id') == 'material'), None)
        quantity_field = next((f for f in industry_config.get('formFields', []) if f.get('id') == 'quantity'), None)
        
        # Get complexity factor
        complexity_value = request_data.get('complexity', '')
        complexity_factor = 1.0
        complexity_name = ''
        
        if complexity_field and complexity_field.get('type') == 'select':
            for option in complexity_field.get('options', []):
                if option.get('value') == complexity_value:
                    complexity_factor = option.get('factor', 1.0)
                    complexity_name = option.get('label', '')
        
        # Get material cost multiplier
        material_value = request_data.get('material', '')
        material_cost_multiplier = 1.0
        
        if material_field and material_field.get('type') == 'select':
            for option in material_field.get('options', []):
                if option.get('value') == material_value:
                    material_cost_multiplier = option.get('costFactor', 1.0)
        
        # Get quantity and calculate discount
        quantity = int(request_data.get('quantity', 1))
        quantity_discount = 0.0
        
        if quantity > 100:
            quantity_discount = 0.15  # 15% discount for large quantities
        elif quantity > 50:
            quantity_discount = 0.10  # 10% discount for medium quantities
        elif quantity > 20:
            quantity_discount = 0.05  # 5% discount for small quantities
        
        # Calculate base price using linear regression model
        # This is a simplified example - in a real system, this would use actual ML models
        base_price = industry_config.get('basePriceCoefficient', 100.0)
        
        # Calculate material cost
        material_cost = base_price * material_cost_multiplier
        
        # Final quote calculation
        quote = base_price + material_cost
        quote *= complexity_factor
        quote *= quantity
        quote *= (1 - quantity_discount)
        
        # Calculate lead time based on quantity and complexity
        lead_time_days = 7  # Default: 1 week
        
        if complexity_factor > 1.3:
            lead_time_days += 7  # Add a week for high complexity
        
        if quantity > 50:
            lead_time_days += 5  # Add 5 days for larger quantities
        
        lead_time = f"{lead_time_days} days"
        
        # Prepare response
        response = {
            "quote": round(quote, 2),
            "leadTime": lead_time,
            "complexity": complexity_name,
            "basePrice": round(base_price, 2),
            "materialCost": round(material_cost, 2),
            "complexityFactor": complexity_factor,
            "quantityDiscount": quantity_discount
        }
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating quote: {str(e)}") 