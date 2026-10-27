@echo off
title FitForge - Backend API Server (Port 5000)
color 0A
echo ===================================================================
echo     FitForge Node.js / Express Backend Server (Port 5000)          
echo ===================================================================
echo.

if not exist node_modules (
    echo [FitForge] Installing server dependencies (first run)...
    call npm install
    echo.
)

echo [FitForge] Launching Backend API on http://localhost:5000 ...
echo [FitForge] Health Check: http://localhost:5000/api/health
echo.
npm run dev
pause
