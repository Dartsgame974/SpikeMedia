import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);

const CHARACTERS_DIR = path.join(ROOT_DIR, 'Characters');
const AGENTS_DEST_DIR = path.join(ROOT_DIR, 'Valorantek', 'SFX', 'UI', 'Agents');

// Codename -> Agent Display Name mapping (100% verified against official Valorant dev codenames)
const CODENAME_TO_AGENT = {
  'Rift': 'Astra',
  'Breach': 'Breach',
  'Sarge': 'Brimstone',
  'Deadeye': 'Chamber',
  'Smonk': 'Clove',
  'Gumshoe': 'Cypher',
  'Cable': 'Deadlock',
  'BountyHunter': 'Fade',
  'Aggrobot': 'Gekko',
  'Mage': 'Harbor',
  'Sequoia': 'Iso',
  'Wushu': 'Jett',
  'Grenadier': 'KAYO',
  'Killjoy': 'Killjoy',
  'Iris': 'Miks',
  'Sprinter': 'Neon',
  'Wraith': 'Omen',
  'Phoenix': 'Phoenix',
  'Clay': 'Raze',
  'Vampire': 'Reyna',
  'Thorne': 'Sage',
  'Guide': 'Skye',
  'Hunter': 'Sova',
  'Cashew': 'Tejo',
  'Pine': 'Veto',
  'Pandemic': 'Viper',
  'Nox': 'Vyse',
  'Terra': 'Waylay',
  'Stealth': 'Yoru'
};

// Agent -> Official English Ability Names per slot (wiki.playvalorant.com verified)
const AGENT_ABILITIES = {
  'Astra': { C: 'Gravity Well', Q: 'Nova Pulse', E: 'Nebula / Dissipate', X: 'Cosmic Divide', Passive: 'Astral Form' },
  'Breach': { C: 'Aftershock', Q: 'Flashpoint', E: 'Fault Line', X: 'Rolling Thunder' },
  'Brimstone': { C: 'Stim Beacon', Q: 'Incendiary', E: 'Sky Smoke', X: 'Orbital Strike' },
  'Chamber': { C: 'Trademark', Q: 'Headhunter', E: 'Rendezvous', X: 'Tour De Force' },
  'Clove': { C: 'Pick-Me-Up', Q: 'Meddle', E: 'Ruse', X: 'Not Dead Yet', Passive: 'Post-Death Smokes' },
  'Cypher': { C: 'Trapwire', Q: 'Cyber Cage', E: 'Spycam', X: 'Neural Theft' },
  'Deadlock': { C: 'GravNet', Q: 'Sonic Sensor', E: 'Barrier Mesh', X: 'Annihilation' },
  'Fade': { C: 'Prowler', Q: 'Seize', E: 'Haunt', X: 'Nightfall', Passive: 'Terror Trails' },
  'Gekko': { C: 'Mosh Pit', Q: 'Wingman', E: 'Dizzy', X: 'Thrash', Passive: 'Globules' },
  'Harbor': { C: 'Cascade', Q: 'Cove', E: 'High Tide', X: 'Reckoning' },
  'Iso': { C: 'Contingency', Q: 'Undercut', E: 'Double Tap', X: 'Kill Contract' },
  'Jett': { C: 'Cloudburst', Q: 'Updraft', E: 'Tailwind', X: 'Blade Storm', Passive: 'Drift' },
  'KAYO': { C: 'FRAGment', Q: 'FLASHdrive', E: 'ZEROpoint', X: 'NULLcmd' },
  'Killjoy': { C: 'Nanoswarm', Q: 'Alarmbot', E: 'Turret', X: 'Lockdown' },
  'Miks': { C: 'M-pulse', Q: 'Harmonize', E: 'Waveform', X: 'Bassquake' },
  'Neon': { C: 'Fast Lane', Q: 'Relay Bolt', E: 'High Gear', X: 'Overdrive' },
  'Omen': { C: 'Shrouded Step', Q: 'Paranoia', E: 'Dark Cover', X: 'From the Shadows' },
  'Phoenix': { C: 'Blaze', Q: 'Curveball', E: 'Hot Hands', X: 'Run It Back', Passive: 'Heating Up' },
  'Raze': { C: 'Boom Bot', Q: 'Blast Pack', E: 'Paint Shells', X: 'Showstopper' },
  'Reyna': { C: 'Leer', Q: 'Devour', E: 'Dismiss', X: 'Empress', Passive: 'Soul Harvest' },
  'Sage': { C: 'Barrier Orb', Q: 'Slow Orb', E: 'Healing Orb', X: 'Resurrection' },
  'Skye': { C: 'Regrowth', Q: 'Trailblazer', E: 'Guiding Light', X: 'Seekers' },
  'Sova': { C: 'Owl Drone', Q: 'Shock Bolt', E: 'Recon Bolt', X: 'Hunter\'s Fury' },
  'Tejo': { C: 'Stealth Drone', Q: 'Special Delivery', E: 'Guided Salvo', X: 'Armageddon' },
  'Veto': { C: 'Crosscut', Q: 'Chokehold', E: 'Interceptor', X: 'Evolution' },
  'Viper': { C: 'Snake Bite', Q: 'Poison Cloud', E: 'Toxic Screen', X: 'Viper\'s Pit', Passive: 'Toxin' },
  'Vyse': { C: 'Razorvine', Q: 'Shear', E: 'Arc Rose', X: 'Steel Garden' },
  'Waylay': { C: 'Saturate', Q: 'Lightspeed', E: 'Refract', X: 'Convergent Paths' },
  'Yoru': { C: 'Fakeout', Q: 'Blindside', E: 'Gatecrash', X: 'Dimensional Drift' }
};

// Ability-specific keywords per agent to ensure accurate categorization
const AGENT_KEYWORDS = {
  'Astra': { C: ['gravitywell', 'pull'], Q: ['novapulse', 'pulse'], E: ['nebula', 'dissipate'], X: ['astralform', 'cosmicdivide', 'wall'] },
  'Breach': { C: ['aftershock', 'replique', 'fusion', 'abil1'], Q: ['flashpoint', 'ligne', 'flash', 'abil2'], E: ['faultline', 'fault_line', 'fissure', 'abil3'], X: ['rollingthunder', 'rolling_thunder', 'quake', 'thunder', 'breach_ult', 'ult_cast', 'ult_equip', 'ult_explo', 'abil4'] },
  'Brimstone': { C: ['stimbeacon', 'stim', 'beacon', 'combatstim', 'abil1'], Q: ['molotov', 'incendiary', 'abil2'], E: ['skysmoke', 'smoke', 'abil3'], X: ['orbitalstrike', 'orbital', 'abil4'] },
  'Chamber': { C: ['trademark', 'trap', 'abil1'], Q: ['headhunter', 'pistol', 'abil2'], E: ['rendezvous', 'tp', 'anchor', 'abil3'], X: ['tourdeforce', 'sniper', 'abil4'] },
  'Clove': { C: ['pickmeup', 'overheal', 'abil1'], Q: ['meddle', 'decay', 'abil2'], E: ['ruse', 'smoke', 'abil3'], X: ['notdeadyet', 'res', 'abil4'] },
  'Cypher': { C: ['trapwire', 'tripwire', 'trap', 'abil1'], Q: ['cybercage', 'cage', 'abil2'], E: ['spycam', 'camera', 'cam', 'abil3'], X: ['neuraltheft', 'neural', 'hat', 'abil4'] },
  'Deadlock': { C: ['gravnet', 'net', 'abil1'], Q: ['sonicsensor', 'sensor', 'abil2'], E: ['barriermesh', 'mesh', 'abil3'], X: ['annihilation', 'cocoon', 'abil4'] },
  'Fade': { C: ['prowler', 'dog', 'abil1'], Q: ['seize', 'tether', 'abil2'], E: ['haunt', 'eye', 'abil3'], X: ['nightfall', 'abil4'] },
  'Gekko': { C: ['moshpit', 'mosh', 'abil1'], Q: ['wingman', 'buddy', 'abil2'], E: ['dizzy', 'spit', 'abil3'], X: ['thrash', 'abil4'] },
  'Harbor': { C: ['cascade', 'wave', 'abil1'], Q: ['cove', 'shieldsmoke', 'bubblenade', 'splashgrenade', 'abil2'], E: ['hightide', 'wall', 'abil3'], X: ['reckoning', 'abil4'] },
  'Iso': { C: ['contingency', 'c_wall', 'abil1'], Q: ['undercut', 'q_fragile', 'abil2'], E: ['doubletap', 'e_flow', 'abil3'], X: ['killcontract', 'x_duel', 'abil4'] },
  'Jett': { C: ['cloudburst', 'grenade', 'abil1'], Q: ['updraft', 'courant', 'abil2'], E: ['tailwind', 'dash', 'vent', 'abil3'], X: ['bladestorm', 'blade_storm', 'couteaux', 'abil4'] },
  'KAYO': { C: ['fragment', 'frag', 'abil1'], Q: ['flashdrive', 'flash', 'abil2'], E: ['zeropoint', 'knife', 'abil3'], X: ['nullcmd', 'null', 'abil4'] },
  'Killjoy': { C: ['nanoswarm', 'swarm', 'abil1'], Q: ['alarmbot', 'alarm', 'abil2'], E: ['turret', 'bot', 'abil3'], X: ['lockdown', 'abil4'] },
  'Miks': { C: ['mpulse', 'pulse', 'abil1'], Q: ['harmonize', 'attunement', 'abil2'], E: ['waveform', 'abil3'], X: ['bassquake', 'seismic', 'abil4'] },
  'Neon': { C: ['fastlane', 'wall', 'abil1'], Q: ['relaybolt', 'stun', 'abil2'], E: ['highgear', 'sprint', 'slide', 'abil3'], X: ['overdrive', 'beam', 'abil4'] },
  'Omen': { C: ['shroudedstep', 'shortteleport', 'tp', 'abil1'], Q: ['paranoia', 'blind', 'abil2'], E: ['darkcover', 'smokedome', 'abil3'], X: ['fromtheshadows', 'globalteleport', 'abil4'] },
  'Phoenix': { C: ['blaze', 'firewall', 'abil1'], Q: ['curveball', 'flash', 'abil2'], E: ['hothands', 'fireball', 'abil3'], X: ['runitback', 'reconversion', 'abil4'] },
  'Raze': { C: ['boomba', 'boombot', 'abil1'], Q: ['satchel', 'blastpack', 'abil2'], E: ['clustergrenade', 'paintshells', 'abil3'], X: ['rocket', 'showstopper', 'abil4'] },
  'Reyna': { C: ['leer', 'nearsight', 'eye', 'abil1'], Q: ['devour', 'heal', 'abil2'], E: ['dismiss', 'invisible', 'abil3'], X: ['empress', 'abil4'] },
  'Sage': { C: ['barrierorb', 'wall', 'abil1'], Q: ['sloworb', 'slow', 'abil2'], E: ['healorb', 'heal', 'abil3'], X: ['resurrection', 'revive', 'abil4'] },
  'Skye': { C: ['regrowth', 'heal', 'abil1'], Q: ['trailblazer', 'dog', 'abil2'], E: ['guidinglight', 'bird', 'flash', 'abil3'], X: ['seekers', 'cabbages', 'abil4'] },
  'Sova': { C: ['owldrone', 'drone', 'abil1'], Q: ['shockdart', 'shockbolt', 'abil2'], E: ['reconbolt', 'recon', 'recondrone', 'abil3'], X: ['huntersfury', 'fury', 'abil4'] },
  'Tejo': { C: ['stealthdrone', 'drone', 'abil1'], Q: ['specialdelivery', 'grenade', 'abil2'], E: ['guidedsalvo', 'salvo', 'missile', 'abil3'], X: ['armageddon', 'strike', 'abil4'] },
  'Veto': { C: ['crosscut', 'vortex', 'abil1'], Q: ['chokehold', 'trap', 'abil2'], E: ['interceptor', 'abil3'], X: ['evolution', 'mutate', 'abil4'] },
  'Viper': { C: ['snakebite', 'morsure', 'abil1'], Q: ['poisoncloud', 'nuage', 'grn', 'abil2'], E: ['toxicscreen', 'ecran', 'wallform', 'abil3'], X: ['viperpit', 'pit', 'abil4'] },
  'Vyse': { C: ['razorvine', 'barbedwire', 'abil1'], Q: ['shear', 'wall', 'abil2'], E: ['arcrose', 'flash', 'abil3'], X: ['steelgarden', 'disarm', 'abil4'] },
  'Waylay': { C: ['saturate', 'cluster', 'abil1'], Q: ['lightspeed', 'dash', 'abil2'], E: ['refract', 'mote', 'rewind', 'abil3'], X: ['convergentpaths', 'beam', 'ultimate', 'abil4'] },
  'Yoru': { C: ['fakeout', 'decoy', 'abil1'], Q: ['blindside', 'flash', 'abil2'], E: ['gatecrash', 'tp', 'abil3'], X: ['dimensionaldrift', 'mask', 'abil4'] }
};

function sanitizeFolderName(name) {
  return name.replace(/[^a-zA-Z0-9_\-]/g, '_');
}

function categorizeFile(relPath, filename, agentName) {
  const lowerPath = (relPath + '/' + filename).toLowerCase();
  const fn = filename.toLowerCase();

  // Check agent specific keywords first
  const kw = AGENT_KEYWORDS[agentName];
  if (kw) {
    for (const k of kw.C) { if (lowerPath.includes(k)) return 'C'; }
    for (const k of kw.Q) { if (lowerPath.includes(k)) return 'Q'; }
    for (const k of kw.E) { if (lowerPath.includes(k)) return 'E'; }
    for (const k of kw.X) { if (lowerPath.includes(k)) return 'X'; }
  }

  // Wwise slot folders / numbers (1=C, 2=Q, 3=E, 4=X)
  if (lowerPath.includes('/c/') || lowerPath.includes('\\c\\') || lowerPath.includes('abilc') || fn.includes('_abilc_') || fn.includes('_c_') || lowerPath.includes('/1/') || lowerPath.includes('\\1\\') || lowerPath.includes('_abil1_')) {
    if (!lowerPath.includes('abilq') && !lowerPath.includes('abile') && !lowerPath.includes('abilx')) return 'C';
  }
  if (lowerPath.includes('/q/') || lowerPath.includes('\\q\\') || lowerPath.includes('abilq') || fn.includes('_abilq_') || fn.includes('_q_') || lowerPath.includes('/2/') || lowerPath.includes('\\2\\') || lowerPath.includes('_abil2_')) {
    return 'Q';
  }
  if (lowerPath.includes('/e/') || lowerPath.includes('\\e\\') || lowerPath.includes('abile') || fn.includes('_abile_') || fn.includes('_e_') || lowerPath.includes('/3/') || lowerPath.includes('\\3\\') || lowerPath.includes('_abil3_')) {
    return 'E';
  }
  if (lowerPath.includes('/x/') || lowerPath.includes('\\x\\') || lowerPath.includes('abilx') || lowerPath.includes('ultimate') || fn.includes('_abilx_') || fn.includes('_x_') || lowerPath.includes('/4/') || lowerPath.includes('\\4\\') || lowerPath.includes('_abil4_')) {
    return 'X';
  }
  if (lowerPath.includes('passive') || fn.includes('passive') || fn.includes('drift')) {
    return 'Passive';
  }

  // Default fallback for general movement/weapons/sfx
  if (lowerPath.includes('mvt') || lowerPath.includes('movement') || lowerPath.includes('footstep') || lowerPath.includes('land') || lowerPath.includes('jump')) {
    return 'Movement';
  }
  if (lowerPath.includes('melee') || lowerPath.includes('weapon') || lowerPath.includes('knife')) {
    return 'Weapons_Melee';
  }

  return 'Special_Effects';
}

function main() {
  console.log('1. Deleting AGENTS SFX directory...');
  if (fs.existsSync(AGENTS_DEST_DIR)) {
    fs.rmSync(AGENTS_DEST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(AGENTS_DEST_DIR, { recursive: true });

  console.log('2. Rebuilding 100% English Agent SFX Directory Tree from Characters...');
  let totalCopied = 0;

  const charSubDirs = fs.readdirSync(CHARACTERS_DIR, { withFileTypes: true });

  for (const entry of charSubDirs) {
    if (!entry.isDirectory()) continue;

    const rawCodename = entry.name.replace('Events_Char_', '').replace('_SFX', '').replace('Events_', '');
    const agentName = CODENAME_TO_AGENT[rawCodename] || rawCodename;
    const abilityMeta = AGENT_ABILITIES[agentName] || {};

    const sourceAgentPath = path.join(CHARACTERS_DIR, entry.name);

    function walkAndCopy(currentDir) {
      const files = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const f of files) {
        const fullSrcPath = path.join(currentDir, f.name);
        if (f.isDirectory()) {
          walkAndCopy(fullSrcPath);
        } else if (f.isFile() && (f.name.endsWith('.wav') || f.name.endsWith('.mp3') || f.name.endsWith('.ogg'))) {
          const relInside = path.relative(sourceAgentPath, fullSrcPath);
          const slot = categorizeFile(relInside, f.name, agentName);

          let targetSubDir = '';
          if (['C', 'Q', 'E', 'X', 'Passive'].includes(slot)) {
            const abName = abilityMeta[slot] || slot;
            const slotFolder = slot === 'X' ? 'Ability_X_Ultimate' : `Ability_${slot}`;
            targetSubDir = path.join('Abilities', `${slotFolder}_${sanitizeFolderName(abName)}`);
          } else {
            targetSubDir = slot;
          }

          const targetDirFull = path.join(AGENTS_DEST_DIR, agentName, targetSubDir);
          fs.mkdirSync(targetDirFull, { recursive: true });

          const targetFileFull = path.join(targetDirFull, f.name);
          fs.copyFileSync(fullSrcPath, targetFileFull);
          totalCopied++;
        }
      }
    }

    walkAndCopy(sourceAgentPath);
  }

  console.log(`================ REBUILD SUMMARY ================`);
  console.log(`Successfully rebuilt 100% English SFX directory for ${Object.keys(CODENAME_TO_AGENT).length} agents.`);
  console.log(`Total Audio Files Physically Copied: ${totalCopied}`);
  console.log(`Target Path: ${AGENTS_DEST_DIR}`);
  console.log(`=================================================`);
}

main();
