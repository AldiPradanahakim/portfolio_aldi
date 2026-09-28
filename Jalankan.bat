@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js tidak ditemukan di komputer ini.
  echo Install dulu Node.js dari https://nodejs.org
  echo Setelah selesai, tutup jendela ini lalu dobel klik Jalankan.bat lagi.
  echo.
  pause
  exit /b 1
)

node dev.mjs

echo.
echo Server sudah berhenti.
pause
