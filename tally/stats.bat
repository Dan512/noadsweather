@echo off
rem Double-click me: regenerates stats.html and opens it.
cd /d "%~dp0\.."
node tally\stats.js --days 30 --open
pause
