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

let codenameMap = {};
const mapPath = path.join(PUBLIC_DIR, 'codename_map.json');
if (fs.existsSync(mapPath)) {
  try {
    codenameMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
  } catch (err) {
    console.warn('Could not load codename_map.json:', err.message);
  }
}

function extractCodename(filename) {
  const nameNoExt = filename.replace(/\.[^/.]+$/, '');
  const m = nameNoExt.match(/GN_([A-Za-z0-9_]+)_Bundle/i) 
         || nameNoExt.match(/Bundle_([A-Za-z0-9_]+)/i)
         || nameNoExt.match(/AnimatedStoreBundle_([A-Za-z0-9_]+)/i);
  if (m) return m[1];
  return nameNoExt.replace(/^GN_/, '').replace(/_Bundle_Featured$/, '').replace(/_Bundle_Purchase$/, '').replace(/_Feature$/, '').replace(/_MASTER$/, '').replace(/^Bundle_/, '').replace(/^TX_UI_/, '');
}

const vctTeams = {
  'koi': 'VCT KOI', 'fnatic': 'VCT FNATIC', 'fnc': 'VCT FNATIC', 'sentinels': 'VCT Sentinels', 'sen': 'VCT Sentinels',
  'paperrex': 'VCT Paper Rex', 'prx': 'VCT Paper Rex', 'vitality': 'VCT Team Vitality', 'vit': 'VCT Team Vitality',
  'gentlemates': 'VCT Gentle Mates', 'm8': 'VCT Gentle Mates', 'karmine': 'VCT Karmine Corp', 'kc': 'VCT Karmine Corp',
  'loud': 'VCT LOUD', 'drx': 'VCT DRX', 't1': 'VCT T1', 'edg': 'VCT EDward Gaming', 'navi': 'VCT Natus Vincere',
  'g2': 'VCT G2 Esports', 'c9': 'VCT Cloud9', 'nrg': 'VCT NRG', 'krx': 'VCT DRX', 'zeta': 'VCT ZETA DIVISION',
  'dfm': 'VCT DetonatioN FocusMe', 'bleed': 'VCT BLEED', 'bilibili': 'VCT Bilibili Gaming', 'blg': 'VCT Bilibili Gaming',
  'trace': 'VCT Trace Esports', 'giantx': 'VCT GIANTX', 'gx': 'VCT GIANTX', 'heretics': 'VCT Team Heretics',
  'th': 'VCT Team Heretics', 'kru': 'VCT KRÜ Esports', 'leviatan': 'VCT Leviatán', 'lev': 'VCT Leviatán',
  'mibr': 'VCT MIBR', '100t': 'VCT 100 Thieves', 'talon': 'VCT Talon Esports', 'secret': 'VCT Team Secret',
  'rrq': 'VCT Rex Regum Qeon', 'global': 'VCT Global Esports', 'ge': 'VCT Global Esports', 'furia': 'VCT FURIA', 'fur': 'VCT FURIA'
};

function resolveDisplayName(filename, rawName) {
  const nameNoExt = filename.replace(/\.[^/.]+$/, '');
  
  // 1. VCT Team Capsules check
  for (const [teamCode, teamName] of Object.entries(vctTeams)) {
    const pattern = new RegExp('\\b' + teamCode + '\\b', 'i');
    if (pattern.test(nameNoExt) || nameNoExt.toLowerCase().includes(`_${teamCode}_`) || nameNoExt.toLowerCase().startsWith(`bundle_${teamCode}`) || nameNoExt.toLowerCase().startsWith(`${teamCode}_`)) {
      return {
        displayName: `${teamName} Team Capsule`,
        codename: `VCT_${teamCode.toUpperCase()}`
      };
    }
  }

  const code = extractCodename(filename);
  const codeClean = code.replace(/_/g, '').toLowerCase();
  let matched = codenameMap[codeClean] || codenameMap[code.toLowerCase()];
  
  if (matched) {
    const suffixes = [' Knuckle Knife', ' Knife', ' Blade', ' Staff', ' Sword', ' Dagger', ' Axe', ' Hammer', ' Scythe', ' Katana', ' Vandal', ' Phantom', ' Operator', ' Odin', ' Ares', ' Spectre', ' Stinger', ' Bucky', ' Judge', ' Guardian', ' Marshal', ' Classic', ' Shorty', ' Frenzy', ' Ghost', ' Sheriff', ' Melee', ' Outlaw'];
    for (const suff of suffixes) {
      if (matched.includes(suff)) {
        matched = matched.replace(suff, '');
        break;
      }
    }
    const finalTitle = (!matched.endsWith('Bundle') && !matched.includes('Vol.') && !matched.includes('Champions')) ? `${matched} Bundle` : matched;
    return {
      displayName: finalTitle,
      codename: code
    };
  }

  const cleanFallback = nameNoExt.replace(/^GN_/, '').replace(/_Bundle_Featured$/, '').replace(/_Bundle_Purchase$/, '').replace(/_Feature$/, '').replace(/_MASTER$/, '').replace(/^Bundle_/, '').replace(/^TX_UI_/, '').replace(/_/g, ' ');
  return {
    displayName: cleanFallback,
    codename: code
  };
}

function getThumbPath(fullPath) {
  const ext = path.extname(fullPath);
  const base = fullPath.slice(0, -ext.length);
  const thumbFullPath = `${base}_thumb.webp`;
  if (fs.existsSync(thumbFullPath)) {
    return getRelativePath(thumbFullPath);
  }
  return getRelativePath(fullPath);
}

function scanDirImages(dirPath) {
  let results = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirImages(fullPath));
    } else if (entry.isFile() && !entry.name.endsWith('_thumb.webp') && (entry.name.endsWith('.png') || entry.name.endsWith('.jpg') || entry.name.endsWith('.webp') || entry.name.endsWith('.svg'))) {
      const rawName = entry.name.replace(/\.[^/.]+$/, '');
      const meta = resolveDisplayName(entry.name, rawName);
      results.push({
        name: rawName,
        displayName: meta.displayName,
        codename: meta.codename,
        filename: entry.name,
        relPath: getRelativePath(fullPath),
        thumbPath: getThumbPath(fullPath),
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
        meta.description = ''; // Omit residual localized description
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
    meta.tags = []; // Purge all localized French tags

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
      abilityIcons: [],
      posters: []
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

    const postersFolderPath = path.join(folderPath, 'posters');
    if (fs.existsSync(postersFolderPath)) {
      const pFiles = fs.readdirSync(postersFolderPath);
      for (const pf of pFiles) {
        if (!pf.endsWith('_thumb.webp') && (pf.endsWith('.jpg') || pf.endsWith('.png') || pf.endsWith('.webp'))) {
          const pfPath = path.join(postersFolderPath, pf);
          assets.posters.push({
            filename: pf,
            name: pf.replace(/\.[^/.]+$/, ''),
            relPath: getRelativePath(pfPath),
            thumbPath: getThumbPath(pfPath),
            sizeBytes: fs.statSync(pfPath).size
          });
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

    // Agent SFX Scanning from 100% English SFX/UI/Agents (Deduplicated)
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
const sfxFolderCategoryMap = {
  'spike/main_spike': 'Spike - Main Spike',
  'spike/operations': 'Spike - Operations & Stages',
  'barriers': 'Spawn Barriers & Zones',
  'gungame': 'Game Modes & Escalation',
  'maps/bind_duality': 'Maps - Bind (Duality - Teleporters & Doors)',
  'maps/bind_portals': 'Maps - Bind (Duality - Teleporters & Alarms)',
  'maps/fracture_canyon': 'Maps - Fracture (Canyon - Automatic Doors)',
  'maps/lotus_jam': 'Maps - Lotus (Jam - Rotating Stone Doors)',
  'maps/summit_plummet': 'Maps - Summit (Plummet - Fire Doors)',
  'maps/the_range_poveglia': 'Maps - The Range (Poveglia - Target Dummies)'
};

const categoryTranslations = {
  'Barrières de Spawn & Zones (Spawn Barriers)': 'Spawn Barriers & Zones',
  'Modes de Jeu & Escalade (GunGame)': 'Game Modes & Escalation',
  'Maps - Bind (Duality - Teleporteurs & Portes)': 'Maps - Bind (Duality - Teleporters & Doors)',
  'Maps - Bind (Duality - Teleporteurs & Alarmi)': 'Maps - Bind (Duality - Teleporters & Alarms)',
  'Maps - Fracture (Canyon - Portes Automatiques)': 'Maps - Fracture (Canyon - Automatic Doors)',
  'Maps - Lotus (Jam - Portes de Pierre Rotatives)': 'Maps - Lotus (Jam - Rotating Stone Doors)',
  'Maps - Summit (Plummet - Portes Coupe-Feu)': 'Maps - Summit (Plummet - Fire Doors)',
  'Maps - The Range (Poveglia - Mannequins Cibles)': 'Maps - The Range (Poveglia - Target Dummies)',
  'Spike - Main Spike (Sons Principaux)': 'Spike - Main Spike',
  'Spike - Operations & Stages (Plantation & Impulsions)': 'Spike - Operations & Stages',
  'Commons Abilitys': 'Common Abilities',
  'Carton Rouge Foot': 'Red Card Soccer',
  'Classoc Spray': 'Classic Spray',
  'Win & Loose': 'Win & Loss',
  'Flexs': 'Flexes'
};

const uiCategories = {};

function scanFolderForUiSfx(dirPath, baseRel = '') {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const audioClips = scanDirAudio(dirPath);
  if (audioClips.length > 0 && baseRel) {
    const normRel = baseRel.replace(/\\/g, '/').toLowerCase();
    let catName = sfxFolderCategoryMap[normRel];
    if (!catName) {
      catName = path.basename(dirPath);
    }
    catName = categoryTranslations[catName] || catName;

    if (catName !== 'Agents' && catName !== 'SFX' && catName !== 'UI') {
      if (!uiCategories[catName]) uiCategories[catName] = [];
      for (const clip of audioClips) {
        if (!uiCategories[catName].some(c => c.filename === clip.filename)) {
          uiCategories[catName].push(clip);
        }
      }
    }
  }

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'Agents') {
      const subPath = path.join(dirPath, entry.name);
      const subRel = baseRel ? path.join(baseRel, entry.name) : entry.name;
      scanFolderForUiSfx(subPath, subRel);
    }
  }
}

scanFolderForUiSfx(path.join(VALORANTEK_DIR, 'SFX'));
scanFolderForUiSfx(path.join(PUBLIC_DIR, 'Valorantek', 'SFX'));

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

// 7. Index Spritesheets with Animated Formats (GIF, MOV, MP4, raw PNG)
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

// 9. Preserve mapsData from existing registry file if present
let mapsData = [];
const srcRegistryFile = path.join(__dirname, 'src', 'data', 'registry.json');
if (fs.existsSync(srcRegistryFile)) {
  try {
    const existingObj = JSON.parse(fs.readFileSync(srcRegistryFile, 'utf-8'));
    if (Array.isArray(existingObj.mapsData) && existingObj.mapsData.length > 0) {
      mapsData = existingObj.mapsData;
    }
  } catch (e) {
    console.warn('Could not preserve existing mapsData:', e.message);
  }
}

const registry = {
  generatedAt: new Date().toISOString(),
  roleIcons,
  agentsCount: agentsList.length,
  agents: agentsList,
  uiCategories,
  weapons: weaponsList,
  imageLibraries,
  mapsData
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));

if (fs.existsSync(srcRegistryFile)) {
  fs.writeFileSync(srcRegistryFile, JSON.stringify(registry, null, 2));
}

const distRegistryPath = path.join(__dirname, 'dist', 'registry.json');
if (fs.existsSync(path.dirname(distRegistryPath))) {
  fs.writeFileSync(distRegistryPath, JSON.stringify(registry, null, 2));
}

console.log(`[GitHub Pages] Registry generated successfully with ${agentsList.length} agents, ${Object.keys(uiCategories).length} UI categories, and ${mapsData.length} maps at ${OUTPUT_FILE}`);
