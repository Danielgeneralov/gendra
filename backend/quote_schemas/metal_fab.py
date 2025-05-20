from .base_schema import QuoteSchemaBase


class MetalFabQuoteSchema(QuoteSchemaBase):
    def calculate_quote(self, fields: dict) -> float:
        q = fields["quantity"]
        c = fields["complexity"]
        return max(50.0, q * 5 * c)
