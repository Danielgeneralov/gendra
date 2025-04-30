# Gendra AI Quote API

This API provides endpoints for submitting and managing quotes for manufacturing services.

## Endpoints

### Submit Quote

`POST /api/v1/submit-quote`

Submits a new quote request and saves it to the Supabase `quote_leads` table.

#### Request Body

```json
{
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
  "full_quote_shown": true
}
```

| Field                | Type    | Description                                                |
|----------------------|---------|------------------------------------------------------------|
| email                | string  | User's email address (required)                            |
| industry             | string  | Manufacturing industry category (required)                 |
| material             | string  | Material type for manufacturing (required)                 |
| quantity             | integer | Number of parts or units (required, must be positive)      |
| complexity           | string  | Complexity level (Low, Medium, High)                       |
| surface_finish       | string  | Surface finish type                                        |
| lead_time_preference | string  | Desired lead time (Standard, Rush)                         |
| custom_fields        | object  | Additional industry-specific fields (varies by industry)   |
| full_quote_shown     | boolean | Whether the user viewed the full quote details             |

#### Response

```json
{
  "success": true,
  "message": "Quote submitted successfully",
  "quote_range": {
    "minAmount": 1350,
    "maxAmount": 1650
  },
  "lead_time_estimate": "10-14 business days"
}
```

| Field              | Type    | Description                                 |
|--------------------|---------|---------------------------------------------|
| success            | boolean | Indicates if the request was successful     |
| message            | string  | Human-readable status message               |
| quote_range        | object  | Min and max quote amount                    |
| lead_time_estimate | string  | Estimated production time                   |

### Health Check

`GET /api/v1/health`

Checks the API's operational status.

#### Response

```json
{
  "status": "healthy",
  "api_version": "1.0.0"
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `400 Bad Request`: Missing or invalid parameters
- `500 Internal Server Error`: Server-side error

Error responses include an `error` field with a description of what went wrong:

```json
{
  "error": "Missing required fields"
}
```

## Environment Variables

The API requires the following environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key for database access

## Database Schema

The API stores quote leads in the `quote_leads` table with the following schema:

| Column               | Type                    | Description                           |
|----------------------|-------------------------|---------------------------------------|
| id                   | uuid                    | Primary key                           |
| email                | text                    | User's email address                  |
| industry             | text                    | Industry category                     |
| material             | text                    | Material type                         |
| quantity             | integer                 | Quantity of parts                     |
| complexity           | text                    | Complexity level                      |
| surface_finish       | text                    | Surface finish type                   |
| lead_time_preference | text                    | Desired lead time                     |
| custom_fields        | jsonb                   | Industry-specific fields              |
| full_quote_shown     | boolean                 | Whether full quote was shown          |
| quote_amount         | numeric                 | Calculated quote amount               |
| created_at           | timestamp with timezone | Creation timestamp                    |
| is_contacted         | boolean                 | Whether follow-up contact was made    |
| notes                | text                    | Additional notes                      |

Run the SQL migration in `src/app/supabase/migrations/update_quote_leads.sql` to update your database schema. 