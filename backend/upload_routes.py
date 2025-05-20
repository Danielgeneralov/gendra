from quote_service import get_quote
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import tempfile
import os
import pandas as pd
import pdfplumber
from supabase_service import supabase_service

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
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        # 🔍 Parse file
        parsed_data = {}
        if tmp_path.endswith((".csv", ".xlsx")):
            parsed_data = parse_spreadsheet(tmp_path)
        elif tmp_path.endswith(".pdf"):
            parsed_data = parse_pdf(tmp_path)

        # Ensure required keys for quoting are present after parsing
        required_quote_keys = ["quantity", "complexity", "service_type", "material", "turnaround_days"]
        if not all(k in parsed_data for k in required_quote_keys):
            for key in required_quote_keys:
                if key not in parsed_data:
                    parsed_data[key] = None

        # 💡 Calculate quote using schema-based engine
        quote_amount = None
        try:
            quote_input_data = {
                "service_type": parsed_data.get("service_type"),
                "material": parsed_data.get("material"),
                "quantity": parsed_data.get("quantity"),
                "complexity": parsed_data.get("complexity"),
                "turnaround_days": parsed_data.get("turnaround_days")
            }
            quote_amount = get_quote(quote_input_data)
            parsed_data["quote"] = quote_amount
        except Exception as e:
            print(f"WARNING: Quote calculation failed for {file.filename}: {str(e)}")
            parsed_data["quote_calculation_error"] = str(e)

        # 💾 Save to Supabase (quotes table)
        quote_data_to_save = {
            "service_type": parsed_data.get("service_type"),
            "material": parsed_data.get("material"),
            "quantity": parsed_data.get("quantity"),
            "complexity": parsed_data.get("complexity"),
            "turnaround_days": parsed_data.get("turnaround_days"),
            "quote_amount": quote_amount,
            "customer_email": parsed_data.get("customer_email"),
            "customer_name": parsed_data.get("customer_name"),
            "company_name": parsed_data.get("company_name"),
            "additional_notes": parsed_data.get("additional_notes", f"Uploaded file: {file.filename}"),
            "status": parsed_data.get("status", "uploaded"),
            "metadata": parsed_data.get("metadata", {})
        }

        saved_quote = await supabase_service.save_quote(quote_data_to_save)

        # 🧹 Clean up the temporary file
        os.unlink(tmp_path)

        if saved_quote:
            return JSONResponse(
                status_code=200,
                content={
                    "message": f"File uploaded and quote saved successfully (ID: {saved_quote.get('id')})",
                    "filename": file.filename,
                    "data": parsed_data,
                    "quote_id": saved_quote.get("id")
                }
            )
        else:
            raise HTTPException(status_code=500, detail=f"Upload failed: Could not save quote to database.")

    except Exception as e:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


def parse_spreadsheet(file_path: str) -> dict:
    try:
        if file_path.endswith(".csv"):
            df = pd.read_csv(file_path)
        elif file_path.endswith(".xlsx"):
            df = pd.read_excel(file_path)
        else:
            raise ValueError("Unsupported file type for parsing.")

        first_row = df.iloc[0]

        parsed_data = {
            "service_type": str(first_row.get("service_type")),
            "quantity": first_row.get("quantity"),
            "material": str(first_row.get("material")),
            "complexity": first_row.get("complexity"),
            "turnaround_days": first_row.get("turnaround_days"),
        }

        parsed_data["quantity"] = int(parsed_data["quantity"]) if pd.notna(parsed_data["quantity"]) else None
        parsed_data["complexity"] = float(parsed_data["complexity"]) if pd.notna(parsed_data["complexity"]) else None
        parsed_data["turnaround_days"] = int(parsed_data["turnaround_days"]) if pd.notna(parsed_data["turnaround_days"]) else None

        return parsed_data

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse spreadsheet: {str(e)}")


def parse_pdf(file_path: str) -> dict:
    try:
        with pdfplumber.open(file_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""

        lines = text.lower().splitlines()
        data = {
            "service_type": None,
            "quantity": None,
            "material": None,
            "complexity": None,
            "turnaround_days": None,
        }

        for line in lines:
            if "service type:" in line:
                data["service_type"] = line.split("service type:")[-1].strip()
            elif "quantity:" in line:
                try:
                    data["quantity"] = int("".join(filter(str.isdigit, line.split("quantity:")[-1])))
                except ValueError:
                    pass
            elif "material:" in line:
                data["material"] = line.split("material:")[-1].strip()
            elif "complexity:" in line:
                try:
                    data["complexity"] = float(line.split("complexity:")[-1])
                except ValueError:
                    pass
            elif "turnaround days:" in line:
                try:
                    data["turnaround_days"] = int("".join(filter(str.isdigit, line.split("turnaround days:")[-1])))
                except ValueError:
                    pass

        for key, value in data.items():
            if isinstance(value, str) and value == '':
                data[key] = None

        return data

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {str(e)}")
