# Spike Media - Valorant Asset & Sound Archive

[![Spike Media Hub](public/logo.svg)](https://wiki.playvalorant.com/en-us/)

**Spike Media** is an ultra-modern, high-performance web asset hub and media repository for Valorant audio, agent packaging, high-res posters, map art, typography fonts, and game UI sound effects. Built specifically for content creators, 3D animators, video editors, and application developers.

---

## Key Features

- **29+ Agent Media Packages**: High-resolution bust & full portraits, square icons, killfeed icons, minimap thumbnails, ability icons, and official Champions posters (Clove, Omen, Iso, Jett, Viper, and more).
- **Interactive Typography Catalog**: Download official Valorant font families (**Tungsten** and **BioSans**) with real-time Google Fonts-style live text preview, custom text input, tracking controls, size sliders, and `@font-face` CSS snippets.
- **50+ Categorized UI SFX**: High-quality audio player with waveform visualizer, audio looping, volume controls, and instant sound downloads for Spike, Barriers, Game Modes, and Map interactions.
- **Weapons & Game Assets Index**: Searchable database of Valorant weapon skins, codenames index, rankings, icons, and background artwork.
- **Community & Developer Resources**: Curated collection of essential Valorant tools, APIs, datamining utilities, and official links.

---

## Recommended Websites & Essential Resources

### 1. Official Valorant Wiki (PlayValorant)
- **URL**: [https://wiki.playvalorant.com/en-us/](https://wiki.playvalorant.com/en-us/)
- **Note**: The official partnership wiki for Valorant. Highly recommended whenever you need accurate, verified game information, agent abilities, weapon damage numbers, lore, and patch updates. Vastly cleaner and more reliable than Fandom.

### 2. Kingdom Laboratories
- **Twitter/X**: [@KLaboratories](https://x.com/KLaboratories)
- **Details**: KINGDOM LABORATORIES | LORE | GAMES | SERVIDORES
  - Content Creator / Influencer
  - Fan page & content creation
  - Contact: `kingdomlaboratories@gmail.com`
- **Note**: Premier community content creator covering Valorant lore, game updates, leaks, fan creations, and community servers.

---

## Typography Fonts Included

| Font Family | Usage | Weights / Formats | Downloads |
| :--- | :--- | :--- | :--- |
| **Tungsten** | Title Headers, Killfeed Headlines, Agent Victory Displays | Bold (700) - `.ttf`, `.woff`, `.woff2`, `.eot` | Included in `/fonts/tungsten/` & `.zip` |
| **BioSans** | In-Game HUD, Subtitles, Weapon Stats, Store Menus | Regular, SemiBold, Bold, ExtraBold - `.otf` | Included in `/fonts/biosans/` & `.zip` |

---

## Development & Build Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```

### Building for Production / GitHub Pages
```bash
# Generate asset registry
node generate_registry.mjs

# Build production bundle
npm run build
```

---

## License & Disclaimer

*Valorant* and all associated assets, logos, artwork, audio clips, and trademarks are property of **Riot Games, Inc.**  
Spike Media is an unofficial fan project and media repository created for educational, editing, and content creation purposes under Riot Games' Legal Jibber Jabber policies.
