from .metal_fab import MetalFabQuoteSchema
from .speccoat import SpecCoatSchema
from .base_schema import QuoteSchemaBase

SCHEMA_REGISTRY = {
    "metal_fab": MetalFabQuoteSchema(),
    "speccoat": SpecCoatSchema(),
}


def get_schema_by_service_type(service_type: str) -> QuoteSchemaBase:
    return SCHEMA_REGISTRY.get(service_type, MetalFabQuoteSchema())
