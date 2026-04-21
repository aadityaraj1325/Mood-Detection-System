param(
    [string]$BaseUrl = "http://localhost:8000",
    [string]$Password = "StudentPass123!",
    [int]$StartupTimeoutSeconds = 120
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n==> $Message"
}

function Wait-Backend {
    param(
        [string]$Url,
        [int]$TimeoutSeconds
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $health = Invoke-RestMethod -Method Get -Uri "$Url/health"
            if ($health.status -eq "ok") {
                return $true
            }
        }
        catch {
            # Wait until backend is available.
        }
        Start-Sleep -Seconds 2
    }

    return $false
}

# Tiny valid JPEG (1x1) used as payload for /analyze-mood
$sampleFrameBase64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/AP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8BP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//Z"

$stamp = Get-Date -Format "yyyyMMddHHmmss"
$email = "student.$stamp@university.edu"
$fullName = "Student Demo $stamp"

Write-Step "Checking backend health"
if (-not (Wait-Backend -Url $BaseUrl -TimeoutSeconds $StartupTimeoutSeconds)) {
    throw "Backend is not reachable at $BaseUrl within $StartupTimeoutSeconds seconds. Check backend terminal logs."
}

$health = Invoke-RestMethod -Method Get -Uri "$BaseUrl/health"
$ready = $null
try {
    $ready = Invoke-RestMethod -Method Get -Uri "$BaseUrl/ready"
}
catch {
    throw "Backend is running but database is not ready. Start Docker Desktop, then run ./scripts/start_local_demo.ps1 again."
}
Write-Host "Health: $($health.status), Ready: $($ready.status)"

Write-Step "Registering a new student account"
$registerBody = @{
    email = $email
    full_name = $fullName
    password = $Password
} | ConvertTo-Json
$register = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/auth/register" -ContentType "application/json" -Body $registerBody
Write-Host "Registered user: $($register.email)"

Write-Step "Logging in and retrieving JWT"
$loginBody = @{
    email = $email
    password = $Password
} | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/auth/login" -ContentType "application/json" -Body $loginBody
$token = $login.access_token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "JWT acquired for user id: $($login.user.id)"

Write-Step "Analyzing mood from sample frame"
$analyzeBody = @{ frame_base64 = $sampleFrameBase64 } | ConvertTo-Json
$analysis = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/analyze-mood" -Headers $headers -ContentType "application/json" -Body $analyzeBody
Write-Host "Detected: $($analysis.emotion), confidence: $($analysis.confidence)"

Write-Step "Saving mood event"
$saveBody = @{
    emotion = $analysis.emotion
    confidence = [double]$analysis.confidence
    source = "api-smoke"
} | ConvertTo-Json
$saved = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/save-mood" -Headers $headers -ContentType "application/json" -Body $saveBody
Write-Host "Saved mood id: $($saved.id)"

Write-Step "Fetching mood history"
$history = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/get-history?limit=5" -Headers $headers
Write-Host "History entries returned: $($history.items.Count)"

Write-Step "Fetching recommendation"
$recommend = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/recommend" -Headers $headers
Write-Host "Predicted next mood: $($recommend.predicted_next_mood), stress score: $($recommend.stress_score)"

Write-Step "Fetching analytics summary"
$analytics = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/analytics/summary" -Headers $headers
Write-Host "Weekly points: $($analytics.weekly.Count), Monthly points: $($analytics.monthly.Count)"

Write-Step "Checking daily notification payload"
$daily = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/notifications/daily-check" -Headers $headers
Write-Host "Notification enabled: $($daily.enabled), message: $($daily.message)"

Write-Step "Smoke flow completed successfully"
Write-Host "User: $email"
