from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import os
import pandas as pd
import pdfplumber


router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    allowed_types = {
        "application/pdf": ".pdf",
        "text/csv": ".csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    try:
        suffix = allowed_types[file.content_type]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # 🔍 Parse file if supported
        parsed_data = {}
        if tmp_path.endswith((".csv", ".xlsx")):
            parsed_data = parse_spreadsheet(tmp_path)
            
        elif tmp_path.endswith(".pdf"):
         parsed_data = parse_pdf(tmp_path)


        return JSONResponse(
            status_code=200,
            content={
                "message": "File uploaded successfully",
                "filename": file.filename,
                "data": parsed_data,
                "path": tmp_path  # optional: remove in production
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

def parse_spreadsheet(file_path: str) -> dict:
    try:
        if file_path.endswith(".csv"):
            df = pd.read_csv(file_path)
        elif file_path.endswith(".xlsx"):
            df = pd.read_excel(file_path)
        else:
            raise ValueError("Unsupported file type for parsing.")

        # Expect columns like: quantity, material, complexity
        first_row = df.iloc[0]

        return {
            "quantity": int(first_row.get("quantity", 1)),
            "material": str(first_row.get("material", "aluminum")),
            "complexity": float(first_row.get("complexity", 1.0))
        }

    except Exception as e:
        raise ValueError(f"Failed to parse spreadsheet: {str(e)}")


def parse_pdf(file_path: str) -> dict:
    try:
        with pdfplumber.open(file_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""

        # Simple text-based parsing (customize this to match your expected format)
        # Example expected: "quantity: 100\nmaterial: aluminum\ncomplexity: 1.2"
        lines = text.lower().splitlines()
        data = {
            "quantity": 1,
            "material": "aluminum",
            "complexity": 1.0
        }

        for line in lines:
            if "quantity" in line:
                data["quantity"] = int("".join(filter(str.isdigit, line)))
            elif "material" in line:
                data["material"] = line.split(":")[-1].strip()
            elif "complexity" in line:
                try:
                    data["complexity"] = float(line.split(":")[-1])
                except ValueError:
                    pass

        return data

    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")