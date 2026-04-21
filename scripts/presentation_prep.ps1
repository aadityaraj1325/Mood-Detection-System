$ErrorActionPreference = "Stop"

Write-Host "Preparing PulseMind AI for presentation..."

Write-Host "Step 1: Checking backend health"
$health = Invoke-RestMethod http://localhost:8000/health
$ready = Invoke-RestMethod http://localhost:8000/ready
Write-Host "Health: $($health.status)"
Write-Host "Ready: $($ready.status)"

Write-Host "Step 2: Running API smoke flow"
& "$PSScriptRoot\demo_api_flow.ps1"

Write-Host "Presentation prep checks completed successfully."
Write-Host "You can now open http://localhost:5173 and start the live demo."
