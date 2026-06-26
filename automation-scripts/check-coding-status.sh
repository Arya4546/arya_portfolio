#!/bin/bash
# ── Linux/Ubuntu Coding Status Detection Script ───────────────────────
# This script checks if VS Code, Cursor, or Terminal is running or active
# and sends a POST request to the Live Activity Status API.
#
# Setup:
# 1. Make executable: chmod +x check-coding-status.sh
# 2. Add to crontab: crontab -e
#    Add line: */5 * * * * /path/to/check-coding-status.sh
# ──────────────────────────────────────────────────────────────────────

# Configuration
API_URL="https://arya-portfolio-ag4w.onrender.com/api/activity"
SECRET="7d6e8ea7f6c12a8a90dbaa3e4cc2373b07ee4e81c7f77a8dc652a282d94fb18e"

# Set GUI environment variables (required for xdotool when run via cron)
if [ -z "$DISPLAY" ]; then
  export DISPLAY=:0
fi
if [ -z "$XAUTHORITY" ]; then
  # Detect active Mutter/Xwayland authority file or fallback to .Xauthority
  DETECTED_AUTH=$(ls -t /run/user/$(id -u)/.mutter-Xwaylandauth.* 2>/dev/null | head -n 1)
  if [ -n "$DETECTED_AUTH" ]; then
    export XAUTHORITY="$DETECTED_AUTH"
  else
    export XAUTHORITY="$HOME/.Xauthority"
  fi
fi

# Fetch current status from API
CURRENT_STATUS=$(curl -s "$API_URL" | python3 -c "import sys, json; print(json.load(sys.stdin).get('statusLabel', ''))" 2>/dev/null)

# If current status is a high-priority manual/real-time status, do not overwrite it.
if [[ -n "$CURRENT_STATUS" && "$CURRENT_STATUS" != "Coding" && "$CURRENT_STATUS" != "Debugging" && "$CURRENT_STATUS" != "Offline" ]]; then
  exit 0
fi

IS_CODING=false

# 1. Try X11 active window detection (most accurate for desktop)
if command -v xdotool &> /dev/null; then
  ACTIVE_WINDOW_ID=$(xdotool getactivewindow 2>/dev/null)
  if [ -n "$ACTIVE_WINDOW_ID" ]; then
    ACTIVE_WINDOW_NAME=$(xdotool getwindowname "$ACTIVE_WINDOW_ID" 2>/dev/null)
    
    # Check if window title matches coding apps or terminal
    if [[ "$ACTIVE_WINDOW_NAME" == *"Visual Studio Code"* || "$ACTIVE_WINDOW_NAME" == *"Code - OSS"* ]]; then
      APP_NAME="VS Code"
      if [[ "$ACTIVE_WINDOW_NAME" == *"arya_portfolio"* || "$ACTIVE_WINDOW_NAME" == *"antigravity"* ]]; then
        APP_NAME="Antigravity"
      fi
      curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $SECRET" \
        -d "{\"statusLabel\": \"Coding\", \"appName\": \"$APP_NAME\", \"icon\": \"Coding\"}" > /dev/null
      IS_CODING=true
    elif [[ "$ACTIVE_WINDOW_NAME" == *"Cursor"* ]]; then
      APP_NAME="Cursor"
      if [[ "$ACTIVE_WINDOW_NAME" == *"arya_portfolio"* || "$ACTIVE_WINDOW_NAME" == *"antigravity"* ]]; then
        APP_NAME="Antigravity"
      fi
      curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $SECRET" \
        -d "{\"statusLabel\": \"Coding\", \"appName\": \"$APP_NAME\", \"icon\": \"Coding\"}" > /dev/null
      IS_CODING=true
    elif [[ "$ACTIVE_WINDOW_NAME" == *"Debugging"* ]]; then
      curl -s -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $SECRET" \
        -d '{"statusLabel": "Debugging", "appName": "GDB/LLDB", "icon": "Debugging"}' > /dev/null
      IS_CODING=true
    fi
  fi
fi

# 2. Fallback: Process check (works on Wayland too if xdotool fails)
if [ "$IS_CODING" = false ]; then
  if pgrep -x "cursor" > /dev/null || pgrep -x "cursor-bin" > /dev/null; then
    curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $SECRET" \
      -d '{"statusLabel": "Coding", "appName": "Cursor", "icon": "Coding"}' > /dev/null
    IS_CODING=true
  elif pgrep -x "code" > /dev/null; then
    curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $SECRET" \
      -d '{"statusLabel": "Coding", "appName": "VS Code", "icon": "Coding"}' > /dev/null
    IS_CODING=true
  fi
fi

# 3. If no longer coding but API still reports "Coding" or "Debugging", reset it to "Offline"
if [ "$IS_CODING" = false ]; then
  if [[ "$CURRENT_STATUS" == "Coding" || "$CURRENT_STATUS" == "Debugging" ]]; then
    curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $SECRET" \
      -d '{"statusLabel": "Offline", "appName": null, "icon": "Offline"}' > /dev/null
  fi
fi
