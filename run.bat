@echo off
title PremiumCollect - Insurance Premium Collection System (WD-LIC-003)
echo ======================================================================
echo   PREMIUMCOLLECT - Premium Collection & Payment Tracking System
echo   Task ID: WD-LIC-003  ^|  Student Code: DAS-LIC-003
echo   Data Alcott Systems  ^|  freeinternships.in
echo ======================================================================
echo.
echo [1/2] Launching browser at http://localhost:5173 ...
start http://localhost:5173
echo.
echo [2/2] Starting local Node.js HTTP server...
node server.js
pause
