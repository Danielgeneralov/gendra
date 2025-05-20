from pathlib import Path
import os
import joblib
import numpy as np
import logging
from quote_schemas.registry import get_schema_by_service_type

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
    "aluminum": 1.0,
    "steel": 1.2,
    "plastic": 0.7,
    "titanium": 3.0,
    "carbon fiber": 2.5,
    "default": 1.0,
}

SERVICE_MULTIPLIERS = {
    "conformal_coating": 1.0,
    "parylene": 1.8,
    "nano_coating": 2.2,
    "encapsulation": 1.5,
    "default": 1.0,
}


# Quote generation logic using the model and multipliers
def get_quote(fields: dict) -> float:
    """
    Delegates quote generation to the appropriate schema based on service_type.
    """
    schema = get_schema_by_service_type(fields["service_type"])
    return schema.calculate_quote(fields)
