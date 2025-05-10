from .base_schema import QuoteSchemaBase

class SpecCoatSchema(QuoteSchemaBase):
    def calculate_quote(self, fields: dict) -> float:
        q = fields["quantity"]
        c = fields["complexity"]
        turnaround = fields.get("turnaround_days", 7)
        multiplier = 1.3 if turnaround < 5 else 1.0
        return max(50.0, q * 6 * c * multiplier) 