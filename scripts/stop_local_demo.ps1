$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$statePath = Join-Path $repoRoot ".runtime\\local-demo-state.json"

if (-not (Test-Path $statePath)) {
    Write-Host "No local demo state found at $statePath"
    Write-Host "If services are still running, close terminals manually and run: docker compose stop mongo"
    exit 0
}

$state = Get-Content $statePath -Raw | ConvertFrom-Json

foreach ($processId in @($state.backendTerminalPid, $state.frontendTerminalPid)) {
    if ($processId) {
        try {
            Stop-Process -Id $processId -Force -ErrorAction Stop
            Write-Host "Stopped terminal process PID $processId"
        }
        catch {
            Write-Host "PID $processId was not running."
        }
    }
}

# Clean up orphaned backend/frontend workers that may survive terminal shutdown.
try {
    $escapedRepoRoot = [Regex]::Escape($repoRoot)
    $orphaned = Get-CimInstance Win32_Process | Where-Object {
        ($_.CommandLine -match "$escapedRepoRoot\\backend" -and $_.CommandLine -match "uvicorn app\.main:app") -or
        ($_.CommandLine -match "$escapedRepoRoot\\frontend" -and $_.CommandLine -match "vite")
    }

    foreach ($proc in $orphaned) {
        try {
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction Stop
            Write-Host "Stopped orphaned process PID $($proc.ProcessId)"
        }
        catch {
            Write-Host "Orphaned PID $($proc.ProcessId) was not running."
        }
    }
}
catch {
    Write-Warning "Unable to inspect orphaned processes: $($_.Exception.Message)"
}

if ($state.useDockerMongo -and -not $state.useMockDb) {
    $dockerCommand = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $dockerCommand) {
        Write-Warning "Docker CLI not found. Skipping MongoDB container shutdown."
    }
    else {
        Push-Location $repoRoot
        try {
            docker compose stop mongo
        }
        finally {
            Pop-Location
        }
        Write-Host "Stopped MongoDB container."
    }
}

Remove-Item $statePath -Force
Write-Host "Local demo stopped."
