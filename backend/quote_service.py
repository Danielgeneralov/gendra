from pathlib import Path
import os
import joblib
import numpy as np
import logging

MODEL_PATH = Path(__file__).parent / "model.pkl"

def load_model():
    try:
        model = joblib.load(MODEL_PATH)
        return model
    except Exception as e:
        raise RuntimeError(f"Error loading quote model: {str(e)}")

quote_model = load_model()
