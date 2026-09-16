import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALORANTEK_DIR = path.join(__dirname, 'Valorantek');
const PUBLIC_DIR = path.join(__dirname, 'public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'registry.json');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

function getRelativePath(absolutePath) {
  return path.relative(__dirname, absolutePath).replace(/\\/g, '/');
}

function scanDirAudio(dirPath) {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirAudio(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.wav') || entry.name.endsWith('.mp3') || entry.name.endsWith('.ogg'))) {
      results.push({
        name: entry.name.replace(/\.[^/.]+$/, '').replace(/ \(SFX\)/g, ''),
        filename: entry.name,
        relPath: getRelativePath(fullPath),
        sizeBytes: fs.statSync(fullPath).size
      });
    }
  }
  return results;
}

function scanDirImages(dirPath) {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirImages(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.png') || entry.name.endsWith('.jpg') || entry.name.endsWith('.webp') || entry.name.endsWith('.svg'))) {
      results.push({
        name: entry.name.replace(/\.[^/.]+$/, ''),
        filename: entry.name,
        relPath: getRelativePath(fullPath),
        sizeBytes: fs.statSync(fullPath).size
      });
    }
  }
  return results;
}

// 1. Index Official Role Icons
const roleIconsDir = path.join(VALORANTEK_DIR, 'Icons', 'Roles');
const roleIcons = {};
if (fs.existsSync(roleIconsDir)) {
  const rFiles = fs.readdirSync(roleIconsDir);
  for (const rf of rFiles) {
    const p = path.join(roleIconsDir, rf);
    if (rf.includes('Duelist')) roleIcons['Duelist'] = getRelativePath(p);
    if (rf.includes('Initiator')) roleIcons['Initiator'] = getRelativePath(p);
    if (rf.includes('Controller')) roleIcons['Controller'] = getRelativePath(p);
    if (rf.includes('Sentinel')) roleIcons['Sentinel'] = getRelativePath(p);
    if (rf.includes('All')) roleIcons['All'] = getRelativePath(p);
  }
}

// 2. Index All Sub-directories of Icons/
const iconsBaseDir = path.join(VALORANTEK_DIR, 'Icons');
const iconCategories = {};

if (fs.existsSync(iconsBaseDir)) {
  const iconSubEntries = fs.readdirSync(iconsBaseDir, { withFileTypes: true });
  for (const entry of iconSubEntries) {
    const fullPath = path.join(iconsBaseDir, entry.name);
    if (entry.isDirectory()) {
      const imgs = scanDirImages(fullPath);
      if (imgs.length > 0) {
        iconCategories[entry.name] = imgs;
      }
    } else if (entry.isFile() && (entry.name.endsWith('.png') || entry.name.endsWith('.jpg'))) {
      if (!iconCategories['General Icons']) iconCategories['General Icons'] = [];
      iconCategories['General Icons'].push({
        name: entry.name.replace(/\.[^/.]+$/, ''),
        filename: entry.name,
        relPath: getRelativePath(fullPath),
        sizeBytes: fs.statSync(fullPath).size
      });
    }
  }
}

// 3. Index Agents
const agentsDir = path.join(VALORANTEK_DIR, 'agents');
const agentsList = [];

if (fs.existsSync(agentsDir)) {
  const agentFolders = fs.readdirSync(agentsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const folderName of agentFolders) {
    const folderPath = path.join(agentsDir, folderName);
    const infoFile = path.join(folderPath, `${folderName}_info.json`);

    let meta = {
      id: folderName.toLowerCase(),
      name: folderName,
      developerName: '',
      role: 'Unknown',
      roleDescription: '',
      roleIcon: null,
      description: '',
      tags: []
    };

    if (fs.existsSync(infoFile)) {
      try {
        const json = JSON.parse(fs.readFileSync(infoFile, 'utf-8'));
        meta.name = json.displayName || folderName;
        meta.developerName = json.developerName || '';
        meta.description = '';
        meta.tags = json.characterTags || [];
        if (json.role) {
          meta.role = json.role.displayName || 'Unknown';
          meta.roleDescription = '';
        }
      } catch (err) {
        console.warn(`Could not parse ${infoFile}:`, err.message);
      }
    }

    const roleKeyMap = {
      'duelliste': 'Duelist', 'duelist': 'Duelist',
      'initiateur': 'Initiator', 'initiator': 'Initiator',
      'contrôleur': 'Controller', 'controller': 'Controller',
      'sentinelle': 'Sentinel', 'sentinel': 'Sentinel'
    };
    const normRole = roleKeyMap[meta.role?.toLowerCase()] || 'Duelist';
    meta.role = normRole;
    meta.tags = [];

    if (roleIcons[normRole]) {
      meta.roleIconPath = roleIcons[normRole];
    }

    // Local Image Assets
    const assets = {
      squareIcon: null,
      bustPortrait: null,
      fullPortrait: null,
      wallpaper: null,
      killfeedIcon: null,
      minimapIcon: null,
      abilityIcons: []
    };

    const filesInFolder = fs.readdirSync(folderPath);
    for (const file of filesInFolder) {
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isFile()) {
        if (file.includes('icone_carree') || file.includes('icone_petite')) {
          assets.squareIcon = getRelativePath(filePath);
        } else if (file.includes('portrait_buste')) {
          assets.bustPortrait = getRelativePath(filePath);
        } else if (file.includes('portrait_complet')) {
          if (!assets.fullPortrait) assets.fullPortrait = getRelativePath(filePath);
        } else if (file.includes('fond_ecran')) {
          assets.wallpaper = getRelativePath(filePath);
        } else if (file.includes('icone_killfeed')) {
          assets.killfeedIcon = getRelativePath(filePath);
        }
      }
    }

    const killfeedDir = path.join(VALORANTEK_DIR, 'Icons', 'Killfeed');
    const killfeedIconsList = [];
    if (fs.existsSync(killfeedDir)) {
      const kFiles = fs.readdirSync(killfeedDir);
      const searchTerms = [folderName.toLowerCase(), meta.developerName.toLowerCase()];
      if (folderName.toLowerCase() === 'veto') searchTerms.push('pine', 'sym');
      if (folderName.toLowerCase() === 'harbor') searchTerms.push('mage');

      for (const kf of kFiles) {
        const kfLower = kf.toLowerCase();
        if (searchTerms.some(st => st && kfLower.includes(st))) {
          const rel = getRelativePath(path.join(killfeedDir, kf));
          if (!killfeedIconsList.includes(rel)) {
            killfeedIconsList.push(rel);
          }
        }
      }
    }
    if (killfeedIconsList.length > 0) {
      assets.killfeedIcon = killfeedIconsList[0];
      assets.killfeedIcons = killfeedIconsList;
      if (killfeedIconsList.length > 1) {
        assets.secondaryKillfeedIcon = killfeedIconsList[1];
      }
    }

    // Minimap Portrait Icon & Multiple Forms (e.g. Veto / Sym form)
    const minimapThumbDir = path.join(VALORANTEK_DIR, 'Icons', 'Minimap', 'Minimap_Thumbnails');
    const minimapPortraitsList = [];
    if (fs.existsSync(minimapThumbDir)) {
      const thumbFiles = fs.readdirSync(minimapThumbDir);
      const searchTerms = [folderName.toLowerCase(), meta.developerName.toLowerCase()];
      if (folderName.toLowerCase() === 'veto') searchTerms.push('pine', 'sym');
      if (folderName.toLowerCase() === 'harbor') searchTerms.push('mage');

      for (const tf of thumbFiles) {
        const tfLower = tf.toLowerCase();
        if (searchTerms.some(st => st && tfLower.includes(st))) {
          const rel = getRelativePath(path.join(minimapThumbDir, tf));
          if (!minimapPortraitsList.includes(rel)) {
            minimapPortraitsList.push(rel);
          }
        }
      }
    }
    if (minimapPortraitsList.length > 0) {
      assets.minimapIcon = minimapPortraitsList[0];
      assets.minimapPortraits = minimapPortraitsList;
      if (minimapPortraitsList.length > 1) {
        assets.secondaryMinimapIcon = minimapPortraitsList[1];
      }
    }

    // Ability Icons Map
    const abilitiesFolderPath = path.join(folderPath, 'abilities');
    const abilityIconsMap = {};

    if (fs.existsSync(abilitiesFolderPath)) {
      const abilFiles = fs.readdirSync(abilitiesFolderPath);
      for (const af of abilFiles) {
        if (af.endsWith('.png') || af.endsWith('.jpg')) {
          const pathRel = getRelativePath(path.join(abilitiesFolderPath, af));
          assets.abilityIcons.push({
            filename: af,
            path: pathRel
          });

          if (af.includes('_C_')) abilityIconsMap['C'] = pathRel;
          else if (af.includes('_Q_')) abilityIconsMap['Q'] = pathRel;
          else if (af.includes('_E_')) abilityIconsMap['E'] = pathRel;
          else if (af.includes('_X_')) abilityIconsMap['X'] = pathRel;
          else if (af.includes('_Passive_') || af.includes('_Vol_')) abilityIconsMap['Passive'] = pathRel;
        }
      }
    }

    // Minimap Ability & Marker Icons for this agent
    const minimapIcons = [];
    const minimapDir = path.join(VALORANTEK_DIR, 'Icons', 'Minimap');
    if (fs.existsSync(minimapDir)) {
      const mmFiles = fs.readdirSync(minimapDir);
      const searchTerms = [folderName.toLowerCase(), meta.developerName.toLowerCase()];
      if (folderName.toLowerCase() === 'kayo') searchTerms.push('kayo', 'grenadier');
      if (folderName.toLowerCase() === 'fade') searchTerms.push('bountyhounter', 'bountyhunter');
      if (folderName.toLowerCase() === 'veto') searchTerms.push('pine', 'sym');

      for (const mf of mmFiles) {
        const mfPath = path.join(minimapDir, mf);
        if (fs.statSync(mfPath).isFile() && (mf.endsWith('.png') || mf.endsWith('.jpg'))) {
          const mfLower = mf.toLowerCase();
          if (searchTerms.some(st => st && st.length > 2 && mfLower.includes(st))) {
            minimapIcons.push({
              name: mf.replace(/\.[^/.]+$/, '').replace(/TX_UI_Minimap_/g, '').replace(/TX_Minimap_/g, '').replace(/_/g, ' '),
              filename: mf,
              path: getRelativePath(mfPath)
            });
          }
        }
      }
    }
    assets.minimapIcons = minimapIcons;

    // Agent SFX Scanning (GitHub Version: Spells & Abilities & Special Effects ONLY, exclude Movement/Footsteps)
    let agentSfxDir = path.join(VALORANTEK_DIR, 'SFX', 'UI', 'Agents', folderName);
    if (!fs.existsSync(agentSfxDir) && meta.developerName) {
      agentSfxDir = path.join(VALORANTEK_DIR, 'SFX', 'UI', 'Agents', meta.developerName);
    }
    if (!fs.existsSync(agentSfxDir)) {
      agentSfxDir = path.join(VALORANTEK_DIR, 'SFX', 'SFX', 'Agents', folderName);
    }

    const audioCategories = {};

    function walkAgentDir(dir) {
      if (!fs.existsSync(dir)) return;
      const subEntries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of subEntries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // EXCLUDE MOVEMENT / DEPLACEMENTS FOR GITHUB VERSION AS REQUESTED
          const nameLower = entry.name.toLowerCase();
          if (nameLower.includes('movement') || nameLower.includes('deplacement') || nameLower.includes('footstep')) {
            continue;
          }

          const children = fs.readdirSync(fullPath, { withFileTypes: true });
          const hasSubDirs = children.some(c => c.isDirectory());

          if (hasSubDirs) {
            walkAgentDir(fullPath);
          } else {
            const clips = scanDirAudio(fullPath);
            if (clips.length > 0) {
              let categoryLabel = entry.name.replace(/^Ability_/, '').replace(/_/g, ' ');

              // Match icon for ability folders
              let iconPath = null;
              if (entry.name.includes('Ability_C')) iconPath = abilityIconsMap['C'];
              else if (entry.name.includes('Ability_Q')) iconPath = abilityIconsMap['Q'];
              else if (entry.name.includes('Ability_E')) iconPath = abilityIconsMap['E'];
              else if (entry.name.includes('Ability_X')) iconPath = abilityIconsMap['X'];
              else if (entry.name.includes('Ability_Passive')) iconPath = abilityIconsMap['Passive'];

              audioCategories[categoryLabel] = {
                icon: iconPath,
                clips
              };
            }
          }
        }
      }
    }

    walkAgentDir(agentSfxDir);

    agentsList.push({
      ...meta,
      assets,
      audioCategories
    });
  }
}

// 4. Index Global UI SFX
const uiSfxBaseDirs = [
  path.join(VALORANTEK_DIR, 'SFX', 'SFX'),
  path.join(VALORANTEK_DIR, 'SFX', 'UI'),
  path.join(VALORANTEK_DIR, 'SFX')
];
const uiCategories = {};

for (const baseDir of uiSfxBaseDirs) {
  if (fs.existsSync(baseDir)) {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'Agents' && entry.name !== 'SFX' && entry.name !== 'UI') {
        const catPath = path.join(baseDir, entry.name);
        const clips = scanDirAudio(catPath);
        if (clips.length > 0) {
          if (!uiCategories[entry.name]) {
            uiCategories[entry.name] = [];
          }
          for (const clip of clips) {
            if (!uiCategories[entry.name].some(c => c.filename === clip.filename)) {
              uiCategories[entry.name].push(clip);
            }
          }
        }
      }
    }
  }
}

// 5. Index Weapons
const weaponsDir = path.join(VALORANTEK_DIR, 'weapons');
const weaponsList = [];
if (fs.existsSync(weaponsDir)) {
  const wFolders = fs.readdirSync(weaponsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const wName of wFolders) {
    const wPath = path.join(weaponsDir, wName);
    const images = scanDirImages(wPath);
    if (images.length > 0) {
      weaponsList.push({
        name: wName,
        imagesCount: images.length,
        images
      });
    }
  }
}

// 6. Index Background Sub-Categories
const backgroundDir = path.join(VALORANTEK_DIR, 'Backgrounds');
const backgroundCategories = {};
if (fs.existsSync(backgroundDir)) {
  const bgEntries = fs.readdirSync(backgroundDir, { withFileTypes: true });
  for (const entry of bgEntries) {
    const fullPath = path.join(backgroundDir, entry.name);
    if (entry.isDirectory()) {
      const imgs = scanDirImages(fullPath);
      if (imgs.length > 0) {
        backgroundCategories[entry.name] = imgs;
      }
    } else if (entry.isFile() && (entry.name.endsWith('.png') || entry.name.endsWith('.jpg'))) {
      if (!backgroundCategories['General Backgrounds']) backgroundCategories['General Backgrounds'] = [];
      backgroundCategories['General Backgrounds'].push({
        name: entry.name.replace(/\.[^/.]+$/, ''),
        filename: entry.name,
        relPath: getRelativePath(fullPath),
        sizeBytes: fs.statSync(fullPath).size
      });
    }
  }
}

// 7. Index Spritesheets with Animated Formats
const spritesheetDir = path.join(VALORANTEK_DIR, 'Spritesheet');
const spritesheetsList = [];
if (fs.existsSync(spritesheetDir)) {
  const files = fs.readdirSync(spritesheetDir);
  for (const f of files) {
    if (f.endsWith('.png')) {
      const baseName = f.replace(/\.[^/.]+$/, '');
      const rawRel = getRelativePath(path.join(spritesheetDir, f));
      const gifRel = getRelativePath(path.join(spritesheetDir, 'converted', `${baseName}.gif`));
      const movRel = getRelativePath(path.join(spritesheetDir, 'converted', `${baseName}.mov`));
      const mp4Rel = getRelativePath(path.join(spritesheetDir, 'converted', `${baseName}.mp4`));

      const gif16x9 = getRelativePath(path.join(spritesheetDir, 'converted', `${baseName}_16x9.gif`));
      const mov16x9 = getRelativePath(path.join(spritesheetDir, 'converted', `${baseName}_16x9.mov`));
      const mp416x9 = getRelativePath(path.join(spritesheetDir, 'converted', `${baseName}_16x9.mp4`));
      const has16x9 = fs.existsSync(path.join(__dirname, mp416x9));

      spritesheetsList.push({
        name: baseName.replace(/_/g, ' '),
        baseName,
        rawPng: rawRel,
        gif: fs.existsSync(path.join(__dirname, gifRel)) ? gifRel : null,
        mov: fs.existsSync(path.join(__dirname, movRel)) ? movRel : null,
        mp4: fs.existsSync(path.join(__dirname, mp4Rel)) ? mp4Rel : null,
        has16x9,
        widescreen16x9: has16x9 ? {
          gif: fs.existsSync(path.join(__dirname, gif16x9)) ? gif16x9 : null,
          mov: fs.existsSync(path.join(__dirname, mov16x9)) ? mov16x9 : null,
          mp4: fs.existsSync(path.join(__dirname, mp416x9)) ? mp416x9 : null,
        } : null
      });
    }
  }
}

// 8. Index Global Image Libraries
const imageLibraries = {
  iconCategories,
  logos: scanDirImages(path.join(VALORANTEK_DIR, 'Logos')),
  backgrounds: scanDirImages(path.join(VALORANTEK_DIR, 'Backgrounds')),
  backgroundCategories,
  rankings: scanDirImages(path.join(VALORANTEK_DIR, 'Rankings')).concat(scanDirImages(path.join(VALORANTEK_DIR, 'ranks'))),
  overlays: scanDirImages(path.join(VALORANTEK_DIR, 'Overlays')),
  playerbannerAssets: scanDirImages(path.join(VALORANTEK_DIR, 'PlayerbannerAssets')),
  misc: scanDirImages(path.join(VALORANTEK_DIR, 'Misc')),
  spritesheets: spritesheetsList,
  valorantGradient: scanDirImages(path.join(VALORANTEK_DIR, 'Valorant Gradient'))
};

const registry = {
  generatedAt: new Date().toISOString(),
  roleIcons,
  agentsCount: agentsList.length,
  agents: agentsList,
  uiCategories,
  weapons: weaponsList,
  imageLibraries
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));
console.log(`[GitHub Pages] Registry generated with 100% English Spells & UI SFX tree (Movement excluded) for ${agentsList.length} agents at ${OUTPUT_FILE}`);
