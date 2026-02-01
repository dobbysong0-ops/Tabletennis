@echo off
cd /d "%~dp0"
echo ==========================================
echo Starting Table Tennis Management System
echo ==========================================

echo [1/2] Starting Backend Server (Port 3000)...
start "Backend Server" cmd /k "cd /d "%~dp0server" && npm install && npm start"

echo [2/2] Starting Frontend Application (Port 5173)...
timeout /t 5
start "Table Tennis App" cmd /k "cd /d "%~dp0" && npm install && npm run dev"

echo ==========================================
echo System is starting up...
echo Please wait for the browser windows to open or navigate to:
echo Frontend: http://localhost:5173
echo Backend Health: http://localhost:3000/api/health
echo ==========================================
pause
