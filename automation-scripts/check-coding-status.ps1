# ── Windows Coding Status Detection Script ───────────────────────────
# This script checks if VS Code or Cursor is running and sends a POST
# request to the Live Activity Status API.
#
# Setup:
# 1. Open Task Scheduler.
# 2. Create a basic task running every 5 minutes.
# 3. Action: Start a program.
#    Program/script: powershell.exe
#    Add arguments: -WindowStyle Hidden -File "C:\path\to\check-coding-status.ps1"
# ──────────────────────────────────────────────────────────────────────

# Configuration
$apiUrl = "https://arya-portfolio-ag4w.onrender.com/api/activity"
$secret = "7d6e8ea7f6c12a8a90dbaa3e4cc2373b07ee4e81c7f77a8dc652a282d94fb18e"

# Get current status from API
$currentStatus = ""
try {
    $current = Invoke-RestMethod -Uri $apiUrl -Method Get -TimeoutSec 5
    $currentStatus = $current.statusLabel
} catch {
    # Ignore and proceed
}

# Define C# Type to get active window title on Windows
$winApiCode = @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class ActiveWindow {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
}
"@

try {
    Add-Type -TypeDefinition $winApiCode -ErrorAction SilentlyContinue
} catch {
    # Ignore if already loaded
}

# Fetch active window title
$activeTitle = ""
try {
    $hWnd = [ActiveWindow]::GetForegroundWindow()
    $title = New-Object System.Text.StringBuilder 256
    $null = [ActiveWindow]::GetWindowText($hWnd, $title, 256)
    $activeTitle = $title.ToString()
} catch {
    # Fail silently
}

# Check processes
$codeRunning = Get-Process -Name "Code" -ErrorAction SilentlyContinue
$cursorRunning = Get-Process -Name "Cursor" -ErrorAction SilentlyContinue

if ($codeRunning -or $cursorRunning) {
    # Determine default editor name
    $appName = if ($cursorRunning) { "Cursor" } else { "VS Code" }

    # If the active window title contains editor name, inspect for Antigravity workspace
    if ($activeTitle -like "*Visual Studio Code*" -or $activeTitle -like "*Cursor*") {
        if ($activeTitle -like "*arya_portfolio*" -or $activeTitle -like "*antigravity*") {
            $appName = "Antigravity"
        }
    }
    
    $body = @{
        statusLabel = "Coding"
        appName = $appName
        icon = "Coding"
    } | ConvertTo-Json

    try {
        $headers = @{
            "Authorization" = "Bearer $secret"
            "Content-Type" = "application/json"
        }
        Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body -TimeoutSec 10 > $null
    } catch {
        # Fail silently to avoid popups
    }
} else {
    # If no longer coding but API still reports "Coding" or "Debugging", reset it to "Offline"
    if ($currentStatus -eq "Coding" -or $currentStatus -eq "Debugging") {
        $body = @{
            statusLabel = "Offline"
            appName = $null
            icon = "Offline"
        } | ConvertTo-Json

        try {
            $headers = @{
                "Authorization" = "Bearer $secret"
                "Content-Type" = "application/json"
            }
            Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $body -TimeoutSec 10 > $null
        } catch {
            # Fail silently
        }
    }
}
