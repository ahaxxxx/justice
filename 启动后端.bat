@echo off
cd /d "%~dp0"

echo Starting Justice Cat backend...
echo Keep this window open while using AI verdict.
echo.

call npm run dev:backend

pause

