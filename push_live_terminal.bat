@echo off
title Spike Media - GitHub Live Terminal Pusher
color 0A
echo ==============================================================
echo   SPIKE MEDIA - GITHUB LIVE TERMINAL PUSHER
echo ==============================================================
echo.
cd /d "f:\Script\Valorant\SpikeMedia\SpikeMedia_GitHubPages"
echo Repertoire de travail : %CD%
echo Depot distant : https://github.com/Dartsgame974/SpikeMedia.git
echo.
echo Configuration du tampon HTTP et des delais...
git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999
git config core.compression 0

echo.
echo ==============================================================
echo   Lancement de "git push origin main"...
echo ==============================================================
echo.
git push origin main

echo.
if %errorlevel% neq 0 (
    echo ==============================================================
    echo [ERREUR] Le push s'est arrete avec le code d'erreur %errorlevel%.
    echo ==============================================================
) else (
    echo ==============================================================
    echo [SUCCES] PUSH EFFECTUE AVEC SUCCES SUR GITHUB!
    echo ==============================================================
)
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul
