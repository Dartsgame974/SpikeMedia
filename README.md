# Spike Media - GitHub Pages Version

This directory contains the **Static GitHub Pages Distribution** of Spike Media.

## Features
- **GitHub Pages Ready**: Configured with relative base paths (`base: './'`) in `vite.config.js`.
- **Post-Build Modifiable**: Double-click `update_registry.bat` or run `npm run sync` whenever you add a new agent folder or image asset to `Valorantek/`.
- **Automated Deployment**: Includes `.github/workflows/deploy.yml` for automatic deployment on push to `main`/`master` branch.

## How to Add New Agents or Assets Post-Build
1. Add your new agent folder in `Valorantek/agents/<NewAgent>/` or new icons/audio clips in `Valorantek/Icons/` / `Valorantek/SFX/`.
2. Double-click **`update_registry.bat`** (or run `npm run sync`).
3. Run `npm run build` (or commit and push to GitHub).
