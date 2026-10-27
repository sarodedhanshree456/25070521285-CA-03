@echo off
title FitForge - React Frontend (Port 5173)
color 0B
echo ===================================================================
echo     FitForge React Frontend Client (Port 5173)                     
echo ===================================================================
echo.

if not exist node_modules (
    echo [FitForge] Installing client dependencies (first run)...
    call npm install
    echo.
)

echo [FitForge] Launching Vite Dev Server on http://localhost:5173 ...
echo.
npm run dev
pause
