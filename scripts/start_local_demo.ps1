param(
    [switch]$UseDockerMongo = $true,
    [int]$BackendPort = 8000,
    [int]$FrontendPort = 5173,
    [int]$BackendStartupTimeoutSeconds = 120
)

$ErrorActionPreference = "Stop"
if (Get-Variable PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$runtimeDir = Join-Path $repoRoot ".runtime"
if (-not (Test-Path $runtimeDir)) {
    New-Item -ItemType Directory -Path $runtimeDir | Out-Null
}

Write-Host "Starting PulseMind local demo from: $repoRoot"

$useMockDb = $false

function Test-TcpPortOpen {
    param(
        [string]$TargetHost = "localhost",
        [int]$Port = 27017,
        [int]$TimeoutMs = 1000
    )

    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $async = $client.BeginConnect($TargetHost, $Port, $null, $null)
        $isConnected = $async.AsyncWaitHandle.WaitOne($TimeoutMs, $false)
        if (-not $isConnected) {
            $client.Close()
            return $false
        }
        $client.EndConnect($async)
        $client.Close()
        return $true
    }
    catch {
        return $false
    }
}

function Wait-BackendHealth {
    param(
        [string]$Url,
        [int]$TimeoutSeconds
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-RestMethod -Method Get -Uri "$Url/health"
            if ($response.status -eq "ok") {
                return $true
            }
        }
        catch {
            # Backend may still be installing dependencies or booting.
        }
        Start-Sleep -Seconds 2
    }

    return $false
}

function Ensure-DockerDaemon {
    param([int]$TimeoutSeconds = 120)

    cmd /c "docker info >nul 2>nul"
    if ($LASTEXITCODE -eq 0) {
        return $true
    }

    Write-Host "Docker daemon is not ready. Trying to launch Docker Desktop..."

    $desktopPaths = @(
        "C:\Program Files\Docker\Docker\Docker Desktop.exe",
        "C:\Program Files\Docker\Docker\Docker Desktop"
    )

    foreach ($path in $desktopPaths) {
        if (Test-Path $path) {
            Start-Process $path | Out-Null
            break
        }
    }

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        cmd /c "docker info >nul 2>nul"
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
        Start-Sleep -Seconds 3
    }

    return $false
}

if ($UseDockerMongo) {
    $dockerCommand = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $dockerCommand) {
        Write-Warning "Docker CLI was not found. Falling back to in-memory mock database mode. Install Docker Desktop to use persistent MongoDB."
        $UseDockerMongo = $false
        $useMockDb = $true
    }
    else {
        if (-not (Ensure-DockerDaemon -TimeoutSeconds 120)) {
            Write-Warning "Docker daemon did not start in time. Falling back to in-memory mock database mode."
            $UseDockerMongo = $false
            $useMockDb = $true
        }

        if ($UseDockerMongo) {
            Write-Host "Starting MongoDB via Docker..."
            Push-Location $repoRoot
            try {
                cmd /c "docker compose up -d mongo"
                if ($LASTEXITCODE -ne 0) {
                    Write-Warning "Unable to start MongoDB container. Falling back to in-memory mock database mode."
                    $UseDockerMongo = $false
                    $useMockDb = $true
                }
            }
            finally {
                Pop-Location
            }
        }
    }
}
else {
    # Deterministic local mode: when Docker Mongo is disabled, run with in-memory mock DB.
    $useMockDb = $true
    Write-Host "Docker Mongo disabled. Using in-memory mock database mode."
}

$mockFlag = if ($useMockDb) { "true" } else { "false" }
$mongoUri = "mongodb://localhost:27017"

$backendCmd = @"
Set-Location '$repoRoot\\backend'
if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env' }
if (-not (Test-Path '.venv')) { python -m venv .venv }
. .\\.venv\\Scripts\\Activate.ps1
python -m pip install -r requirements.txt
`$env:USE_MOCK_DB = '$mockFlag'
`$env:MONGODB_URI = '$mongoUri'
uvicorn app.main:app --host 0.0.0.0 --port $BackendPort
"@

$frontendCmd = @"
Set-Location '$repoRoot\\frontend'
if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env' }
if (-not (Test-Path 'node_modules')) { npm install }
npm run dev -- --host 0.0.0.0 --port $FrontendPort
"@

Write-Host "Launching backend terminal..."
$backendProc = Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -PassThru

Write-Host "Launching frontend terminal..."
$frontendProc = Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -PassThru

Write-Host "Waiting for backend health endpoint..."
$backendUrl = "http://localhost:$BackendPort"
$isBackendHealthy = Wait-BackendHealth -Url $backendUrl -TimeoutSeconds $BackendStartupTimeoutSeconds
if (-not $isBackendHealthy) {
    Write-Warning "Backend did not become healthy in time. Check the backend terminal for errors."
}
else {
    Write-Host "Backend is healthy."
}

$state = [ordered]@{
    startedAt = (Get-Date).ToString("o")
    useDockerMongo = [bool]$UseDockerMongo
    useMockDb = [bool]$useMockDb
    backendTerminalPid = $backendProc.Id
    frontendTerminalPid = $frontendProc.Id
    backendUrl = $backendUrl
    frontendUrl = "http://localhost:$FrontendPort"
}

$statePath = Join-Path $runtimeDir "local-demo-state.json"
$state | ConvertTo-Json | Set-Content -Path $statePath -Encoding UTF8

Write-Host "Local demo started."
Write-Host "Frontend: http://localhost:$FrontendPort"
Write-Host "Backend:  http://localhost:$BackendPort"
Write-Host "Database mode: $(if ($useMockDb) { 'mock (in-memory)' } else { 'mongo (persistent via Docker volume)' })"
Write-Host "State file: $statePath"
Write-Host "Use scripts/stop_local_demo.ps1 to stop launched terminals and Mongo."
