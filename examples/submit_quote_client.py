"""
Python client example demonstrating how to use the enhanced quote submission API

This example shows how to send structured data to the /submit-quote endpoint
and handle the response using the requests library.
"""

import requests
import json
import sys

# Base URL for API - change this to your actual API endpoint
API_BASE_URL = "http://localhost:8000"  # For local FastAPI development
# API_BASE_URL = "https://your-production-api.com"  # For production

def submit_quote(quote_data):
    """
    Submit quote data to the API endpoint
    
    Args:
        quote_data (dict): Quote request data
        
    Returns:
        dict: API response data
    """
    try:
        # Build the endpoint URL
        endpoint = f"{API_BASE_URL}/submit-quote"
        
        # Send POST request to the API
        response = requests.post(
            endpoint,
            json=quote_data,
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        )
        
        # Raise an exception for non-2xx responses
        response.raise_for_status()
        
        # Parse and return the JSON response
        return response.json()
        
    except requests.exceptions.RequestException as e:
        print(f"Error sending request: {e}")
        sys.exit(1)
    except json.JSONDecodeError:
        print("Error parsing API response")
        sys.exit(1)

def main():
    """Main function to demonstrate API usage"""
    
    # Example quote data
    quote_data = {
        "email": "user@example.com",
        "industry": "metal_fabrication",
        "material": "Aluminum",
        "quantity": 100,
        "complexity": "Medium",
        "surface_finish": "Powder Coat",
        "lead_time_preference": "Standard",
        "custom_fields": {
            "thickness_mm": 2.0,
            "width_mm": 50,
            "height_mm": 30
        },
        "full_quote_shown": True
    }
    
    # Submit the quote
    print(f"Submitting quote data: {json.dumps(quote_data, indent=2)}")
    print("Sending request to server...")
    
    result = submit_quote(quote_data)
    
    # Display the result
    print("\nQuote submitted successfully!")
    print(f"Success: {result['success']}")
    print(f"Message: {result['message']}")
    print(f"Quote range: ${result['quote_range']['min_amount']} - ${result['quote_range']['max_amount']}")
    print(f"Lead time estimate: {result['lead_time_estimate']}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 