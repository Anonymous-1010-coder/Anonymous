@echo off
title Anonymous Platform

echo ============================================
echo   Anonymous - App Sharing Platform
echo ============================================
echo.
echo Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Generating Prisma client...
cd /d "%~dp0backend"
call npx prisma generate
if %errorlevel% neq 0 (
    echo Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo Pushing database schema...
call npx prisma db push
if %errorlevel% neq 0 (
    echo Failed to push database schema
    echo Make sure PostgreSQL is running and DATABASE_URL in backend\.env is correct
    pause
    exit /b 1
)

echo.
echo Starting servers...
echo.

start "Anonymous Backend" cmd /c "cd /d "%~dp0backend" && echo Backend running on http://localhost:5000 && npm run dev"
timeout /t 3 /nobreak >nul
start "Anonymous Frontend" cmd /c "cd /d "%~dp0frontend" && echo Frontend running on http://localhost:3000 && npm run dev"

echo.
echo ============================================
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ============================================
echo.
echo Both servers are starting in separate windows.
echo Close them to stop the servers.
echo.
pause
