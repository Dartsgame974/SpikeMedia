@echo off
title Spike Media - Valorant Asset & SFX Library
cd /d "%~dp0"

echo ========================================================
echo               SPIKE MEDIA LAUNCHER
echo ========================================================
echo.
echo [1/2] Generating asset registry index from Valorantek...
node generate_registry.mjs

echo.
echo [2/2] Starting Spike Media local server...
echo Access in your browser: http://localhost:3000
echo Press Ctrl+C in this window to stop the server.
echo.

npx vite --port 3000 --open

pause
