import uuid
from datetime import datetime
import logging
from typing import Dict, Any, Optional

from client_config import supabase

logger = logging.getLogger("quote_logger")


def log_quote_to_supabase(
    quote_id: Optional[str],
    client_id: Optional[str],
    quote: float,
    input_data: Dict[str, Any],
    metadata: Optional[Dict[str, Any]] = None,
) -> None:
    """
    Logs a quote event to Supabase.

    Args:
        quote_id: Optional UUID for the quote. Generated if not provided.
        client_id: Optional client identifier.
        quote: Final calculated quote amount.
        input_data: Dict with standard quoting inputs (material, quantity, etc.).
        metadata: Optional structured metadata (e.g. RFQ source, API route, user agent).

    Notes:
        - Designed to fail silently to avoid blocking main app flow.
        - Logs all important outcomes via the quote_logger.
    """
    try:
        final_quote_id = quote_id or str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        # Core quote payload
        payload = {
            "quote_id": final_quote_id,
            "client_id": client_id or "unknown",
            "quote": quote,
            "created_at": timestamp,
            "service_type": input_data.get("service_type"),
            "material": input_data.get("material"),
            "quantity": input_data.get("quantity"),
            "complexity": input_data.get("complexity", 1.0),
            "turnaround_days": input_data.get("turnaround_days", 7),
        }

        # Remove any None values
        payload = {k: v for k, v in payload.items() if v is not None}

        # Optional: attach metadata (JSONB in Supabase)
        if metadata:
            payload["metadata"] = metadata

        # Push to Supabase
        response = supabase.table("Quotes").insert(payload).execute()

        if response.data:
            logger.info(f"✅ Quote {final_quote_id} logged for client {payload['client_id']}")
        else:
            logger.warning(f"⚠️ Quote {final_quote_id} insert returned no data.")

    except Exception as e:
        logger.error(
            f"❌ Failed to log quote {quote_id or 'unknown'} to Supabase: {str(e)}",
            exc_info=True
        )


def log_feedback_to_supabase(
    feedback_id: Optional[str],
    quote_id: str,
    feedback_data: Dict[str, Any],
    metadata: Optional[Dict[str, Any]] = None,
) -> None:
    """
    Future extension: logs customer feedback or review data tied to a quote_id.

    Args:
        feedback_id: Optional UUID for feedback entry.
        quote_id: Reference to quote_id this feedback relates to.
        feedback_data: Structured feedback (e.g., helpfulness, satisfaction score).
        metadata: Optional source info or UI context.
    """
    pass  # Ready for future use
