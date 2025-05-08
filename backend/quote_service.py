from pathlib import Path
import os
import joblib
import numpy as np
import logging

# Define the path to the trained ML model
MODEL_PATH = Path(__file__).parent / "model.pkl"

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("quote_service")

# Load the trained quote prediction model
def load_model():
    try:
        model = joblib.load(MODEL_PATH)
        logger.info("Quote model loaded successfully")
        return model
    except Exception as e:
        raise RuntimeError(f"Error loading quote model: {str(e)}")

quote_model = load_model()

# Define multipliers based on material and service type
MATERIAL_MULTIPLIERS = {
    'aluminum': 1.0,
    'steel': 1.2,
    'plastic': 0.7,
    'titanium': 3.0,
    'carbon fiber': 2.5,
    'default': 1.0
}

SERVICE_MULTIPLIERS = {
    'conformal_coating': 1.0,
    'parylene': 1.8,
    'nano_coating': 2.2,
    'encapsulation': 1.5,
    'default': 1.0
}

# Quote generation logic using the model and multipliers
def get_quote(quantity: int, complexity: float, material: str, service_type: str, turnaround_days: int = 7) -> float:
    try:
        # Step 1: Predict base quote using ML model
        features = np.array([[quantity, complexity]])
        base_quote = quote_model.predict(features)[0]

        # Step 2: Look up multipliers
        material_multiplier = MATERIAL_MULTIPLIERS.get(material.lower(), MATERIAL_MULTIPLIERS['default'])
        service_multiplier = SERVICE_MULTIPLIERS.get(service_type.lower(), SERVICE_MULTIPLIERS['default'])
        urgency_multiplier = 1.3 if turnaround_days <= 5 else 1.0  # Extra charge for urgent jobs

        # Step 3: Final quote calculation
        final_quote = base_quote * material_multiplier * service_multiplier * urgency_multiplier
        final_quote = round(max(final_quote, 50.0), 2)  # Minimum quote enforcement

        return final_quote

    except Exception as e:
        logger.error(f"Quote generation error: {str(e)}")
        raise RuntimeError("Failed to generate quote")
