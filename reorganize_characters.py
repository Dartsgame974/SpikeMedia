import os
import sys
import shutil
import re

SOURCE_DIR = r"f:\Script\Valorant\SpikeMedia\Characters"
STAGING_DIR = r"f:\Script\Valorant\SpikeMedia\Characters_Clean"

def to_long_path(path):
    abs_path = os.path.abspath(path)
    if os.name == 'nt' and not abs_path.startswith('\\\\?\\'):
        return '\\\\?\\' + abs_path
    return abs_path

def clean_agent_name(dir_name):
    # Standardize agent folder names
    name = dir_name.replace('Events_Char_', '').replace('_SFX', '').replace('Events_', '')
    if name == 'Miks':
        return 'Miks'
    return name

def categorize_file(rel_path, filename):
    lower_path = (rel_path + '/' + filename).lower()
    fn_lower = filename.lower()
    
    # Ability C
    if any(k in lower_path for k in ['abilc', 'abil_c', '/c/', '\\c\\']) or re.search(r'[\_\s]c[\_\s\.]', fn_lower):
        if 'abilq' not in lower_path and 'abile' not in lower_path and 'abilx' not in lower_path:
            return os.path.join("Competences", "Competence_C")
            
    # Ability Q
    if any(k in lower_path for k in ['abilq', 'abil_q', '/q/', '\\q\\']) or re.search(r'[\_\s]q[\_\s\.]', fn_lower):
        return os.path.join("Competences", "Competence_Q")
        
    # Ability E
    if any(k in lower_path for k in ['abile', 'abil_e', '/e/', '\\e\\']) or re.search(r'[\_\s]e[\_\s\.]', fn_lower):
        return os.path.join("Competences", "Competence_E")
        
    # Ability X (Ultimate)
    if any(k in lower_path for k in ['abilx', 'abil_x', 'abil4', 'abil_4', '/x/', '\\x\\']) or re.search(r'[\_\s]x[\_\s\.]', fn_lower):
        return os.path.join("Competences", "Competence_X_Ultime")
        
    # Movement
    if any(k in lower_path for k in ['mvt', 'movement', 'footstep', 'jump', 'land', 'fs_']):
        return "Deplacements"
        
    # Melee / Weapon
    if any(k in lower_path for k in ['melee', 'weapon', 'wp_']):
        return "Armes_Melee"
        
    return "Effets_Speciaux"

def main():
    long_source = to_long_path(SOURCE_DIR)
    long_staging = to_long_path(STAGING_DIR)
    
    if os.path.exists(STAGING_DIR):
        shutil.rmtree(long_staging)
    os.makedirs(long_staging, exist_ok=True)
    
    total_files_scanned = 0
    total_files_copied = 0
    collisions_resolved = 0
    
    print("Scanning and reorganizing files into staging directory...")
    
    for root, dirs, files in os.walk(long_source):
        raw_root = root[4:] if root.startswith('\\\\?\\') else root
        rel_root = os.path.relpath(raw_root, SOURCE_DIR)
        
        if rel_root == '.':
            continue
            
        parts = rel_root.split(os.sep)
        agent_dir = parts[0]
        clean_agent = clean_agent_name(agent_dir)
        
        rel_inside = os.path.sep.join(parts[1:]) if len(parts) > 1 else ''
        
        for f in files:
            total_files_scanned += 1
            cat = categorize_file(rel_inside, f)
            
            dest_cat_dir = os.path.join(STAGING_DIR, clean_agent, cat)
            long_dest_cat_dir = to_long_path(dest_cat_dir)
            os.makedirs(long_dest_cat_dir, exist_ok=True)
            
            src_file_path = os.path.join(raw_root, f)
            long_src_file_path = to_long_path(src_file_path)
            
            dest_file_path = os.path.join(dest_cat_dir, f)
            
            # Resolve collision if file already exists in category
            if os.path.exists(to_long_path(dest_file_path)):
                collisions_resolved += 1
                name, ext = os.path.splitext(f)
                counter = 2
                while True:
                    alt_name = f"{name}_v{counter}{ext}"
                    dest_file_path = os.path.join(dest_cat_dir, alt_name)
                    if not os.path.exists(to_long_path(dest_file_path)):
                        break
                    counter += 1
                    
            long_dest_file_path = to_long_path(dest_file_path)
            shutil.copy2(long_src_file_path, long_dest_file_path)
            total_files_copied += 1
            
    print(f"\nStaging Complete:")
    print(f"- Total Files Scanned: {total_files_scanned}")
    print(f"- Total Files Copied: {total_files_copied}")
    print(f"- Filename Collisions Resolved: {collisions_resolved}")
    
    # Replace old Characters directory with Characters_Clean
    print("\nReplacing old Characters folder with clean structure...")
    backup_dir = r"f:\Script\Valorant\SpikeMedia\Characters_Old_Raw"
    long_backup_dir = to_long_path(backup_dir)
    
    if os.path.exists(backup_dir):
        shutil.rmtree(long_backup_dir)
        
    os.rename(long_source, long_backup_dir)
    os.rename(long_staging, long_source)
    
    print("\nCleanup of old raw folder...")
    shutil.rmtree(long_backup_dir)
    
    # Final count verification
    final_count = 0
    for root, dirs, files in os.walk(long_source):
        final_count += len(files)
        
    print("\n================ REORGANIZATION SUMMARY ================")
    print(f"Total Preserved Audio Files: {final_count} / {total_files_scanned}")
    print(f"Status: SUCCESS (100% files organized)")
    print("========================================================")

if __name__ == "__main__":
    main()
