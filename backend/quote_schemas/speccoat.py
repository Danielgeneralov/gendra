from .base_schema import QuoteSchemaBase
from typing import Dict, Any


class SpecCoatSchema(QuoteSchemaBase):
    def calculate_quote(self, fields: Dict[str, Any]) -> float:
        # Extract base parameters with defaults
        quantity = fields.get("quantity", 1)
        complexity = fields.get("complexity", 1.0)
        turnaround_days = fields.get("turnaround_days", 7)

        # Extract new parameters with defaults
        board_size = fields.get("board_size", 10.0)  # Default 10 square inches
        masking_level = fields.get("masking_level", "none")  # Default no masking
        cert_requirements = fields.get(
            "cert_requirements", False
        )  # Default no certification
        volume_breaks = fields.get("volume_breaks", 100)  # Default volume break at 100

        # Calculate urgency multiplier
        urgency_multiplier = 1.3 if turnaround_days < 5 else 1.0

        # Calculate masking multiplier based on level
        masking_multiplier = {"none": 1.0, "light": 1.2, "heavy": 1.5}.get(
            masking_level.lower(), 1.0
        )

        # Calculate board size factor (small increase for larger boards)
        size_factor = 1.0 + (board_size - 10) * 0.01 if board_size > 10 else 1.0

        # Calculate base quote using original formula with new factors
        base_quote = (
            quantity
            * 6
            * complexity
            * urgency_multiplier
            * masking_multiplier
            * size_factor
        )

        # Apply certification surcharge if required
        if cert_requirements:
            base_quote += 25.0

        # Apply volume discount if quantity exceeds break point
        if quantity >= volume_breaks:
            base_quote *= 0.9  # 10% discount

        # Return final quote with minimum $50
        return max(50.0, base_quote)
