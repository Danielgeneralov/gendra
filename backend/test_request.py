import requests
import json

# Test request to the backend API
try:
    print("Sending request to backend...")
    response = requests.post(
        "http://localhost:8000/predict-quote",
        json={
            "material": "steel",
            "quantity": 10,
            "complexity": 1.0
        },
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    )
    
    print(f"Status code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Quote result: {result}")
    else:
        print(f"Error response: {response.text}")
        
except Exception as e:
    print(f"Exception occurred: {e}") 