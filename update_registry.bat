@echo off
title Spike Media - GitHub Pages Registry Updater
echo ==============================================================
echo   Spike Media - GitHub Pages Registry & Asset Auto-Scanner
echo ==============================================================
echo.
echo Scanning Valorantek folder for newly added agents, icons, or SFX...
echo.
node generate_registry.mjs
echo.
echo ==============================================================
echo   Registry updated successfully in public/registry.json!
echo   To publish your changes on GitHub Pages:
echo     1. Run: npm run build
echo     2. Commit and push your changes to GitHub
echo ==============================================================
pause
