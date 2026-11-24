@echo off
title MARKETxAI Launcher
echo ========================================================
echo               MARKETxAI Platform Launcher
echo ========================================================
echo.

echo [1/3] Starting Python Sentiment AI Service on Port 5001...
start "MARKETxAI - AI Service (5001)" cmd /k "python ai_service/sentiment_api.py"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Express Backend Server on Port 5000...
start "MARKETxAI - Backend API (5000)" cmd /k "node server.js"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Vite Frontend App on Port 5173...
start "MARKETxAI - Frontend (5173)" cmd /k "npm run dev"

echo.
echo ========================================================
echo   All services launched successfully!
echo   Open your browser at: http://localhost:5173
echo ========================================================
echo.
pause
