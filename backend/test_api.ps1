$headers = @{
    "accept" = "application/json"
    "Content-Type" = "application/json"
}

$body = @{
    material = "steel"
    quantity = 10
    complexity = 1.0
} | ConvertTo-Json

Write-Host "Testing the predict-quote endpoint with:" -ForegroundColor Cyan
Write-Host $body -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/predict-quote" -Method Post -Headers $headers -Body $body
    Write-Host "Response received:" -ForegroundColor Green
    $response | ConvertTo-Json
}
catch {
    Write-Host "Error calling API:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} 