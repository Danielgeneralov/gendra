from typing import Dict, Any, Optional
import os
from pathlib import Path
from supabase import create_client, Client
from functools import lru_cache
import logging
from dotenv import load_dotenv

# Set up logging
logger = logging.getLogger("client_config")

# Try to load environment variables from different possible locations
env_paths = [
    ".env.local",  # Current directory
    "../.env.local",  # Parent directory
    "../../.env.local",  # Project root
]

for env_path in env_paths:
    if Path(env_path).exists():
        logger.info(f"Loading environment from: {env_path}")
        load_dotenv(dotenv_path=env_path)
        break

# Initialize Supabase client with fallback variable names
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_KEY")
    or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
)

if not SUPABASE_URL or not SUPABASE_KEY:
    error_msg = """
    Missing Supabase credentials. Please ensure one of these environment variables is set:
    - SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL
    - SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    Current working directory: {}
    Tried loading from: {}
    """.format(
        os.getcwd(), ", ".join(env_paths)
    )
    logger.error(error_msg)
    raise RuntimeError(error_msg)

logger.info(f"Initializing Supabase client with URL: {SUPABASE_URL[:8]}...")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


@lru_cache(maxsize=100)
def get_client_config(client_id: str) -> Dict[str, Any]:
    """
    Fetches client configuration from Supabase with caching.

    Args:
        client_id: The unique identifier for the client

    Returns:
        Dict containing client configuration

    Raises:
        HTTPException: If client config not found or other error occurs
    """
    try:
        logger.info(f"Fetching config for client: {client_id}")

        # Query the client_configs table
        response = (
            supabase.table("client_configs")
            .select("*")
            .eq("client_id", client_id)
            .execute()
        )

        if not response.data:
            logger.error(f"No config found for client: {client_id}")
            raise ValueError(f"No configuration found for client: {client_id}")

        config = response.data[0]
        logger.info(f"Successfully fetched config for client: {client_id}")

        return {
            "client_id": config["client_id"],
            "quote_schema": config["quote_schema"],
            "visible_fields": config["visible_fields"],
            "branding": config["branding"],
        }

    except Exception as e:
        logger.error(f"Error fetching client config: {str(e)}")
        raise


def clear_client_config_cache(client_id: Optional[str] = None):
    """
    Clears the client config cache for a specific client or all clients.

    Args:
        client_id: Optional client ID to clear specific cache entry
    """
    if client_id:
        get_client_config.cache_clear()
        logger.info(f"Cleared cache for client: {client_id}")
    else:
        get_client_config.cache_clear()
        logger.info("Cleared entire client config cache")
