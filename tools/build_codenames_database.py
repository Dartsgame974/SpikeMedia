import urllib.request
import json
import re
import os

print("Fetching Valorant API data...")
agents_raw = json.loads(urllib.request.urlopen('https://valorant-api.com/v1/agents?language=en-US').read())['data']
weapons_raw = json.loads(urllib.request.urlopen('https://valorant-api.com/v1/weapons?language=en-US').read())['data']
skins_raw = json.loads(urllib.request.urlopen('https://valorant-api.com/v1/weapons/skins?language=en-US').read())['data']
bundles_raw = json.loads(urllib.request.urlopen('https://valorant-api.com/v1/bundles?language=en-US').read())['data']
gamemodes_raw = json.loads(urllib.request.urlopen('https://valorant-api.com/v1/gamemodes?language=en-US').read())['data']

# 1. AGENTS
agents_list = []
agent_code_map = {}
for a in agents_raw:
    dev_name = a.get('developerName', '')
    disp_name = a.get('displayName', '')
    if dev_name and disp_name:
        agent_code_map[dev_name.lower()] = disp_name
        agents_list.append({
            'developerName': dev_name,
            'displayName': disp_name,
            'role': a.get('role', {}).get('displayName', 'Unknown') if a.get('role') else 'Unknown',
            'displayIcon': a.get('displayIcon'),
            'description': a.get('description', '')
        })

# 2. WEAPONS
weapons_list = []
weapon_code_map = {
    'hmg': 'Odin',
    'lmg': 'Ares',
    'subgun': 'Spectre',
    'compact': 'Stinger',
    'shotgun': 'Bucky',
    'autoshotgun': 'Judge',
    'assaultrifle': 'Vandal',
    'burstrifle': 'Phantom',
    'dmr': 'Guardian',
    'leversniper': 'Marshal',
    'sniper': 'Operator',
    'basepistol': 'Classic',
    'slimpistol': 'Shorty',
    'automaticpistol': 'Frenzy',
    'pistol': 'Ghost',
    'revolver': 'Sheriff',
    'melee': 'Melee',
    'outlaw': 'Outlaw'
}

for w in weapons_raw:
    asset = w.get('assetPath', '')
    disp_name = w.get('displayName', '')
    # Extract codename from assetPath, e.g. Guns/HvyMachineGuns/HMG/HMGPrimaryAsset
    parts = asset.split('/')
    code = parts[-2] if len(parts) >= 2 else w.get('developerName', '')
    weapon_code_map[code.lower()] = disp_name
    weapons_list.append({
        'codename': code,
        'displayName': disp_name,
        'category': w.get('category', '').replace('EEquippableCategory::', ''),
        'displayIcon': w.get('displayIcon')
    })

# 3. BUNDLES
bundles_list = []
bundle_code_map = {}

for b in bundles_raw:
    asset = b.get('assetPath', '')
    disp_name = b.get('displayName', '')
    # Match StorefrontItem_<Codename>_ThemeBundle or similar
    match = re.search(r'StorefrontItem_([A-Za-z0-9_]+)_(Theme)?Bundle', asset)
    code = ''
    if match:
        code = match.group(1)
    else:
        # fallback from asset path
        code = asset.split('/')[-1].replace('StorefrontItem_', '').replace('_DataAsset', '').replace('_ThemeBundle', '').replace('_Bundle', '')
    
    clean_code = code.replace('_Theme', '').replace('_', '')
    if clean_code:
        bundle_code_map[clean_code.lower()] = disp_name
        bundle_code_map[code.lower()] = disp_name
    
    bundles_list.append({
        'codename': code,
        'displayName': disp_name,
        'displayIcon': b.get('displayIcon') or b.get('verticalIcon') or b.get('displayIcon2')
    })

# 4. SKINS
skins_list = []
skin_code_map = {}

for s in skins_raw:
    asset = s.get('assetPath', '')
    disp_name = s.get('displayName', '')
    parts = asset.split('/')
    if len(parts) >= 2:
        code = parts[-2]
        clean_code = code.replace('_', '').lower()
        skin_code_map[clean_code] = disp_name
        skin_code_map[code.lower()] = disp_name
        
        # Get theme / collection name by stripping weapon name
        skin_theme = disp_name
        for w_name in [' Vandal', ' Phantom', ' Operator', ' Odin', ' Ares', ' Spectre', ' Stinger', ' Bucky', ' Judge', ' Guardian', ' Marshal', ' Classic', ' Shorty', ' Frenzy', ' Ghost', ' Sheriff', ' Melee', ' Outlaw']:
            if w_name in skin_theme:
                skin_theme = skin_theme.replace(w_name, '')
                break
        
        if clean_code not in bundle_code_map:
            bundle_code_map[clean_code] = skin_theme
        if code.lower() not in bundle_code_map:
            bundle_code_map[code.lower()] = skin_theme

        skins_list.append({
            'codename': code,
            'displayName': disp_name,
            'theme': skin_theme,
            'displayIcon': s.get('displayIcon')
        })

# 5. GAMEMODES
gamemodes_list = []
for gm in gamemodes_raw:
    disp_name = gm.get('displayName', '')
    if not disp_name:
        continue
    dev_name = gm.get('developerName')
    asset = gm.get('assetPath') or ''
    parts = [p for p in asset.split('/') if p]
    if not dev_name and 'GameModes' in parts:
        idx = parts.index('GameModes')
        if idx + 1 < len(parts):
            dev_name = parts[idx + 1]
            if dev_name == '_Development' and idx + 2 < len(parts):
                dev_name = parts[idx + 2]
    if not dev_name:
        dev_name = parts[-2] if len(parts) >= 2 else 'Unknown'
    if dev_name == 'Swiftplay_EndOfRoundCredits':
        dev_name = 'SwiftPlay'

    gamemodes_list.append({
        'developerName': dev_name,
        'displayName': disp_name,
        'duration': gm.get('duration', ''),
        'displayIcon': gm.get('displayIcon') or gm.get('listViewIconTall'),
        'description': gm.get('description', '') or ''
    })

print(f"Total Agents mapped: {len(agents_list)}")
print(f"Total Weapons mapped: {len(weapons_list)}")
print(f"Total Bundles mapped: {len(bundles_list)}")
print(f"Total Skins mapped: {len(skins_list)}")
print(f"Total GameModes mapped: {len(gamemodes_list)}")
print(f"Total Unique Bundle Codenames mapped: {len(bundle_code_map)}")

# SAVE CODENAMES DATABASE TO PUBLIC/CODENAMES.JSON
codenames_db = {
    'generatedAt': '2026-09-19',
    'agents': sorted(agents_list, key=lambda x: x['displayName']),
    'weapons': sorted(weapons_list, key=lambda x: x['displayName']),
    'bundles': sorted(bundles_list, key=lambda x: x['displayName']),
    'gameModes': sorted(gamemodes_list, key=lambda x: x['displayName']),
    'skins': skins_list[:150] # Top preview skins
}

with open('public/codenames.json', 'w', encoding='utf-8') as f:
    json.dump(codenames_db, f, indent=2)

print("Saved public/codenames.json successfully.")

# UPDATE REGISTRY.JSON WITH CLEAN ENGLISH DISPLAY NAMES FOR ALL BUNDLE/WEAPON IMAGES
with open('public/registry.json', 'r', encoding='utf-8') as f:
    registry = json.load(f)

def extract_codename_from_filename(filename):
    # e.g. GN_Afterglow3_Bundle_Featured.png -> Afterglow3
    # e.g. Bundle_Airplane.png -> Airplane
    # e.g. TX_UI_AnimatedStoreBundle_Champs25_BG_02.png -> Champs25
    name_no_ext = os.path.splitext(filename)[0]
    
    m = re.search(r'GN_([A-Za-z0-9_]+)_Bundle', name_no_ext, re.IGNORECASE)
    if m: return m.group(1)

    m = re.search(r'Bundle_([A-Za-z0-9_]+)', name_no_ext, re.IGNORECASE)
    if m: return m.group(1)

    m = re.search(r'AnimatedStoreBundle_([A-Za-z0-9_]+)', name_no_ext, re.IGNORECASE)
    if m: return m.group(1)

    clean = name_no_ext.replace('GN_', '').replace('_Bundle_Featured', '').replace('_Bundle_Purchase', '').replace('_Feature', '').replace('_MASTER', '').replace('Bundle_', '').replace('TX_UI_', '')
    return clean

# Enhance Background Bundles in registry
bundle_imgs = registry.get('imageLibraries', {}).get('backgroundCategories', {}).get('Bundle', [])
matched_count = 0

for img in bundle_imgs:
    fname = img['filename']
    code = extract_codename_from_filename(fname)
    code_clean = code.replace('_', '').lower()
    
    disp = bundle_code_map.get(code_clean) or bundle_code_map.get(code.lower()) or skin_code_map.get(code_clean)
    
    if disp:
        img['displayName'] = disp
        img['codename'] = code
        matched_count += 1
    else:
        # Clean fallback name from filename
        clean_name = fname.replace('.png', '').replace('.jpg', '').replace('GN_', '').replace('_Bundle_Featured', '').replace('_Bundle_Purchase', '').replace('Bundle_', '').replace('_', ' ')
        img['displayName'] = clean_name
        img['codename'] = code

print(f"Registry Bundle Images updated: {matched_count} / {len(bundle_imgs)} matched to official Valorant API display names!")

# Also update general backgrounds and weapon images in registry
bg_all = registry.get('imageLibraries', {}).get('backgrounds', [])
for img in bg_all:
    fname = img['filename']
    code = extract_codename_from_filename(fname)
    code_clean = code.replace('_', '').lower()
    disp = bundle_code_map.get(code_clean) or bundle_code_map.get(code.lower())
    if disp:
        img['displayName'] = disp
        img['codename'] = code

with open('public/registry.json', 'w', encoding='utf-8') as f:
    json.dump(registry, f, indent=2)

print("Saved public/registry.json successfully with updated display names!")
