# Gendra Backend

A FastAPI backend for the Gendra application that handles quote predictions.

## Setup

1. Create a virtual environment (recommended):
```
python -m venv venv
```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```
pip install -r requirements.txt
```

## Running the Server

Start the FastAPI server:
```
uvicorn main:app --reload
```

The server will run at [http://localhost:8000](http://localhost:8000)

## API Documentation

FastAPI automatically generates interactive API documentation:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc) 