@echo off
rem Double-click me: live stats dashboard in your browser.
rem Every page load (and the Refresh button) re-reads Firestore.
rem Close this window to stop the dashboard.
cd /d "%~dp0\.."
node tally\stats.js --serve --open
pause
