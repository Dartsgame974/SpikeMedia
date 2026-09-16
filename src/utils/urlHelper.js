export function toAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

  return `${cleanBase}${cleanPath}`;
}

const BUNDLE_CODENAME_MAP = {
  'airplane': 'Altitude',
  'ashen': "Gaia's Vengeance",
  'ashen2': "Gaia's Vengeance Vol. 2",
  'oblivion': 'Ion',
  'oblivion2': 'Ion Vol. 2',
  'koi': 'Kohaku & Matsuba',
  'aquarium': 'Neptune',
  'aquarium2': 'Neptune Vol. 2',
  'afterglow': 'RGX 11z Pro',
  'afterglow2': 'RGX 11z Pro Vol. 2',
  'afterglow3': 'RGX 11z Pro Vol. 3',
  'alien': 'Xenohunter',
  'angler': 'Intergrade',
  'anime1': 'VALORANT GO! Vol. 1',
  'anime1_1': 'VALORANT GO! Vol. 2',
  'anime11': 'VALORANT GO! Vol. 2',
  'anime3': 'VALORANT GO! Vol. 3',
  'anomaly': 'Divergence',
  'antares': 'Araxys',
  'antares2': 'Araxys Vol. 2',
  'arcade': 'Radiant Entertainment System',
  'astronaut': 'Endeavour',
  'assault': 'MK.VII Liberty',
  'atlas': 'Spectrum',
  'blackletter': 'Heartbreaker',
  'champs21': 'Champions 2021',
  'champs22': 'Champions 2022',
  'champs23': 'Champions 2023',
  'champs24': 'Champions 2024',
  'champs25': 'Champions 2025',
  'cyberpunk': 'Glitchpop',
  'dragon': 'Elderflame',
  'doodlebuds': 'Doodle Buds',
  'golem': "Dolmir's Revenge",
  'gunslinger': 'Neo Frontier',
  'hypebeast': 'Prime',
  'hypebeast2': 'Prime//2.0',
  'proto': 'Protocol 781-A',
  'soulstealer': 'Reaver',
  'soulstealer2': 'Reaver Vol. 2',
  'steampunk': 'Magepunk',
  'syndraill': 'Coven',
};

export function getRealBundleDisplayName(img) {
  if (!img) return '';

  const rawName = img.filename || img.name || '';
  
  // Specific override for Bundle_Koi
  if (rawName === 'Bundle_Koi.png' || rawName === 'Bundle_Koi.webp' || img.name === 'Bundle_Koi') {
    return 'Kohaku & Matsuba Bundle';
  }

  // If img already has a clean displayName that is NOT raw filename
  if (img.displayName && !img.displayName.startsWith('Bundle_') && !img.displayName.startsWith('Bundle ') && !img.displayName.startsWith('GN_') && img.displayName !== 'VCT KOI Team Capsule') {
    return img.displayName;
  }

  const cleanName = rawName.replace(/\.[^/.]+$/, '').replace(/^Bundle_/, '').replace(/^GN_/, '').replace(/_Bundle_Featured$/, '').replace(/_Bundle_Purchase$/, '');
  const codeClean = cleanName.replace(/_/g, '').toLowerCase();

  if (BUNDLE_CODENAME_MAP[codeClean]) {
    const title = BUNDLE_CODENAME_MAP[codeClean];
    return (!title.endsWith('Bundle') && !title.includes('Vol.') && !title.includes('Champions')) ? `${title} Bundle` : title;
  }

  return cleanName.replace(/_/g, ' ');
}

export function getRealBundleCodename(img) {
  if (!img) return '';
  if (img.codename && img.codename !== 'VCT_KOI') return img.codename;
  const rawName = img.filename || img.name || '';
  return rawName.replace(/\.[^/.]+$/, '').replace(/^Bundle_/, '').replace(/^GN_/, '').replace(/_Bundle_Featured$/, '').replace(/_Bundle_Purchase$/, '');
}
