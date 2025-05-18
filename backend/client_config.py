from typing import Dict, Any, Optional
import os
from pathlib import Path
from supabase import create_client, Client
from functools import lru_cache
import logging
from dotenv import load_dotenv

# Setup logging
logger = logging.getLogger("client_config")

# Load .env.local from current backend directory
env_path = Path(".env.local")
if env_path.exists():
    logger.info(f"Loading environment from: {env_path}")
    load_dotenv(dotenv_path=env_path)
else:
    logger.warning(".env.local not found. Supabase credentials may be missing.")

# Load Supabase credentials (PRIORITIZE secure backend access)
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # ✅ Backend should only use this key

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        f"Missing Supabase credentials. Check that .env.local includes SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.\n"
        f"Current working dir: {os.getcwd()}"
    )

logger.info(f"Initializing Supabase client with URL: {SUPABASE_URL[:8]}...")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@lru_cache(maxsize=100)
def get_client_config(client_id: str) -> Dict[str, Any]:
    """
    Fetch and cache client config from Supabase.
    """
    try:
        logger.info(f"Fetching config for client: {client_id}")
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
        logger.info(f"Fetched config for client: {client_id}")
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
    Clears the cached config for a specific client or all.
    """
    get_client_config.cache_clear()
    if client_id:
        logger.info(f"Cleared cache for client: {client_id}")
    else:
        logger.info("Cleared all client config cache")
