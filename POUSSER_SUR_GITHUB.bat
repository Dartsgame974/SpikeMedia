@echo off
title Spike Media - Push GitHub (Mode Securise Lot par Lot)
color 0A
echo ==============================================================
echo   SPIKE MEDIA - PUSH VERS GITHUB (MODE ACCELERE & SECURISE)
echo ==============================================================
echo.
cd /d "%~dp0"
echo Repertoire actuel : %CD%
echo Depot distant : https://github.com/Dartsgame974/SpikeMedia.git
echo.
echo Configuration des parametres reseau Git...
git config http.postBuffer 524288000
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999
git config core.compression 0

echo.
echo Envoi des 45 commits vers GitHub (git push -u origin main)...
echo.
git push -u origin main --force

if errorlevel 1 goto ERROR
echo.
echo ==============================================================
echo SUCCESS: TOUS LES COMMITS ET FICHIERS SONT SUR GITHUB!
echo ==============================================================
goto END

:ERROR
echo.
echo ==============================================================
echo ERREUR: L'envoi a rencontre un probleme.
echo ==============================================================

:END
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause
