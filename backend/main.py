from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, Dict
from fastapi.middleware.cors import CORSMiddleware
import random
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib
import os
import logging
from pathlib import Path
from upload_routes import router as upload_router

app = FastAPI()  # ✅ Define the FastAPI app FIRST
app.include_router(upload_router)  # ✅ Then register the router


# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("gendra-backend")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuoteRequest(BaseModel):
    material: str
    quantity: int
    complexity: Optional[float] = 1.0
    
class QuoteResponse(BaseModel):
    quote: float

# Dictionary of material cost multipliers
MATERIAL_MULTIPLIERS = {
    'aluminum': 1.0,
    'steel': 1.2,
    'plastic': 0.7,
    'titanium': 3.0,
    'carbon fiber': 2.5,
    # Default case for unknown materials
    'default': 1.0
}

# Define model file path
MODEL_PATH = Path(__file__).parent / "model.pkl"

def train_quote_model():
    """Creates a synthetic dataset and trains a linear regression model for quote prediction"""
    
    logger.info("Training new quote prediction model...")
    
    # Generate synthetic dataset
    # Features: quantity, complexity
    # We'll create data points for different quantity ranges with various complexity levels
    
    # Generate quantity values across different ranges
    quantities = np.concatenate([
        np.linspace(1, 10, 10).astype(int),       # Small quantities
        np.linspace(15, 50, 8).astype(int),      # Medium quantities
        np.linspace(75, 200, 6).astype(int),     # Large quantities
        np.linspace(300, 1000, 5).astype(int)    # Very large quantities
    ])
    
    # For each quantity, we'll use 3 complexity levels
    complexities = np.array([0.5, 1.0, 1.5])  # Low, Medium, High
    
    # Create X (features) by combining quantity and complexity values
    X = []
    for q in quantities:
        for c in complexities:
            X.append([q, c])
    
    X = np.array(X)
    
    # Generate target values (quotes) using a formula that guarantees positive values
    # This is a simpler pricing model:
    # base_price + (quantity * unit_price * complexity)
    # where unit_price decreases with quantity
    y = []
    for features in X:
        quantity, complexity = features
        
        # Base price - always positive
        base_price = 50.0
        
        # Unit price that decreases with quantity (but never goes below 3)
        unit_price = max(3.0, 15.0 * np.exp(-0.001 * quantity))
        
        # Calculate quote using a simpler formula that ensures positive values
        quote = base_price + (quantity * unit_price * complexity)
        
        # Add small random positive noise
        quote = quote * (1 + abs(np.random.normal(0, 0.01)))
        y.append(quote)
    
    y = np.array(y)
    
    # Train a linear regression model
    model = LinearRegression()
    model.fit(X, y)
    
    logger.info(f"Model trained with {len(X)} samples")
    logger.info(f"Coefficients: {model.coef_}")
    logger.info(f"Intercept: {model.intercept_}")
    
    # Validate model on a few test points
    test_points = [
        [1, 1.0],    # 1 quantity, medium complexity
        [10, 1.0],   # 10 quantity, medium complexity
        [100, 1.0],  # 100 quantity, medium complexity
        [1000, 1.0]  # 1000 quantity, medium complexity
    ]
    predictions = model.predict(test_points)
    logger.info("\nModel validation:")
    for i, (point, pred) in enumerate(zip(test_points, predictions)):
        logger.info(f"Test {i+1}: Qty={point[0]}, Complexity={point[1]} → Predicted quote: ${pred:.2f}")
    
    return model

def save_model(model, filepath=MODEL_PATH):
    """Save the trained model to a file using joblib"""
    try:
        directory = os.path.dirname(filepath)
        if not os.path.exists(directory):
            os.makedirs(directory)
            
        joblib.dump(model, filepath)
        logger.info(f"Model saved successfully to {filepath}")
        return True
    except Exception as e:
        logger.error(f"Error saving model: {str(e)}")
        return False

def load_model(filepath=MODEL_PATH):
    """Load a trained model from a file using joblib"""
    try:
        model = joblib.load(filepath)
        logger.info(f"Model loaded successfully from {filepath}")
        
        # Perform a quick validation on the loaded model
        test_point = np.array([[10, 1.0]])  # 10 quantity, medium complexity
        prediction = model.predict(test_point)[0]
        logger.info(f"Model test prediction: Qty=10, Complexity=1.0 → ${prediction:.2f}")
        
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        return None

def get_quote_model():
    """Get the quote prediction model, either by loading from file or training a new one"""
    
    # Check if model file exists
    if os.path.exists(MODEL_PATH):
        logger.info(f"Found existing model at {MODEL_PATH}")
        model = load_model()
        
        # If loading fails, train a new model
        if model is None:
            logger.warning("Loading model failed, training a new one")
            model = train_quote_model()
            save_model(model)
    else:
        logger.info("No existing model found, training a new one")
        model = train_quote_model()
        save_model(model)
    
    return model

# Get the model when the application starts
quote_model = get_quote_model()

@app.get("/")
async def root():
    return {"message": "Gendra backend is running"}

@app.post("/predict-quote", response_model=QuoteResponse)
async def predict_quote(request: QuoteRequest):
    # Normalize material name and get cost multiplier
    material_lower = request.material.lower()
    material_multiplier = MATERIAL_MULTIPLIERS.get(material_lower, MATERIAL_MULTIPLIERS['default'])
    
    # Create feature vector [quantity, complexity]
    features = np.array([[request.quantity, request.complexity]])
    
    # Use the trained model to predict the base quote
    base_quote = quote_model.predict(features)[0]
    
    # Ensure the base quote is positive
    base_quote = max(50.0, abs(base_quote))  # Minimum quote is $50
    
    # Apply material multiplier
    final_quote = base_quote * material_multiplier
    
    # Add small random variation to make quotes look more realistic (±3%)
    variation = random.uniform(0.97, 1.03)
    final_quote = round(final_quote * variation, 2)
    
    # Final check to ensure we never return a negative or zero quote
    final_quote = max(50.0, final_quote)
    
    return {"quote": final_quote}

# Endpoint to retrain model if needed
@app.post("/admin/retrain-model")
async def retrain_model():
    """Admin endpoint to force model retraining"""
    global quote_model
    
    try:
        # Train a new model
        new_model = train_quote_model()
        
        # Save the model
        if save_model(new_model):
            # Update the global model reference
            quote_model = new_model
            return {"status": "success", "message": "Model retrained and saved successfully"}
        else:
            return {"status": "error", "message": "Failed to save retrained model"}
    except Exception as e:
        logger.error(f"Error retraining model: {str(e)}")
        return {"status": "error", "message": f"Error retraining model: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 