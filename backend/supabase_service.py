from typing import Dict, Any, Optional
import os
from supabase import create_client, Client
import logging
from datetime import datetime
from dotenv import load_dotenv, find_dotenv
from pathlib import Path

# Load .env as early as possible
env_path = find_dotenv()
if not env_path:
    env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        # Debug logging
        logger.info(f"Supabase URL: {self.supabase_url}")
        logger.info(f"Supabase Key: {'*' * len(self.supabase_key) if self.supabase_key else None}")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing Supabase credentials")
        self.client: Client = create_client(self.supabase_url, self.supabase_key)

    async def save_quote(self, quote_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a quote to the quotes table"""
        try:
            data = {
                "service_type": quote_data["service_type"],
                "material": quote_data["material"],
                "quantity": quote_data["quantity"],
                "complexity": quote_data.get("complexity"),
                "turnaround_days": quote_data.get("turnaround_days"),
                "quote_amount": quote_data["quote_amount"],
                "customer_email": quote_data.get("customer_email"),
                "customer_name": quote_data.get("customer_name"),
                "company_name": quote_data.get("company_name"),
                "additional_notes": quote_data.get("additional_notes"),
                "status": "pending",
                "metadata": quote_data.get("metadata", {})
            }
            
            result = self.client.table("quotes").insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error saving quote: {str(e)}")
            raise

    async def save_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a lead to the leads table"""
        try:
            data = {
                "email": lead_data["email"],
                "name": lead_data.get("name"),
                "company_name": lead_data.get("company_name"),
                "phone": lead_data.get("phone"),
                "interest_type": lead_data["interest_type"],
                "message": lead_data.get("message"),
                "status": lead_data.get("status", "new"),
                "source": lead_data.get("source"),
                "metadata": lead_data.get("metadata", {})
            }
            
            result = self.client.table("leads").insert(data).execute()
            
            logger.info(f"Supabase insert lead result data: {result.data}")
            
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error saving lead: {str(e)}")
            raise

    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user in the users table"""
        try:
            data = {
                "email": user_data["email"],
                "full_name": user_data.get("full_name"),
                "company_name": user_data.get("company_name"),
                "role": user_data.get("role", "user"),
                "subscription_status": user_data.get("subscription_status", "free"),
                "subscription_tier": user_data.get("subscription_tier"),
                "last_login": datetime.utcnow().isoformat(),
                "metadata": user_data.get("metadata", {})
            }
            
            result = self.client.table("users").insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            raise

    async def save_portal_config(self, config_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save portal configuration"""
        try:
            data = {
                "company_id": config_data["company_id"],
                "company_name": config_data["company_name"],
                "logo_url": config_data.get("logo_url"),
                "primary_color": config_data.get("primary_color"),
                "secondary_color": config_data.get("secondary_color"),
                "custom_domain": config_data.get("custom_domain"),
                "features": config_data.get("features", {}),
                "settings": config_data.get("settings", {}),
                "is_active": config_data.get("is_active", True),
                "metadata": config_data.get("metadata", {})
            }
            
            result = self.client.table("portal_configs").insert(data).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error saving portal config: {str(e)}")
            raise

    async def get_user_quotes(self, user_id: str) -> list:
        """Get all quotes for a specific user"""
        try:
            result = self.client.table("quotes").select("*").eq("user_id", user_id).execute()
            return result.data
        except Exception as e:
            logger.error(f"Error getting user quotes: {str(e)}")
            raise

    async def get_portal_config(self, company_id: str) -> Optional[Dict[str, Any]]:
        """Get portal configuration for a company"""
        try:
            result = self.client.table("portal_configs").select("*").eq("company_id", company_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            logger.error(f"Error getting portal config: {str(e)}")
            raise

# Create a singleton instance
supabase_service = SupabaseService() 