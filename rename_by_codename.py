import os
import re
import sys

CODENAME_FILE = r"f:\Script\Valorant\SpikeMedia\codename.txt"
TARGET_DIR = r"f:\Script\Valorant\SpikeMedia\Characters"

def to_long_path(path):
    abs_path = os.path.abspath(path)
    if os.name == 'nt' and not abs_path.startswith('\\\\?\\'):
        return '\\\\?\\' + abs_path
    return abs_path

def load_mapping(filepath):
    mapping = {}
    if not os.path.exists(filepath):
        print(f"Error: Codename file not found at {filepath}")
        sys.exit(1)
        
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or '-' not in line:
                continue
            agent, codename = [x.strip() for x in line.split('-', 1)]
            agent_clean = agent.replace('/', '')
            mapping[codename] = agent_clean
            
    return mapping

def main():
    mapping = load_mapping(CODENAME_FILE)
    sorted_codenames = sorted(mapping.keys(), key=lambda x: len(x), reverse=True)
    
    replacements = []
    for cn in sorted_codenames:
        if mapping[cn] != cn:
            pattern = re.compile(re.escape(cn), re.IGNORECASE)
            replacements.append((pattern, mapping[cn]))
            
    print(f"Loaded {len(replacements)} codename replacement rules.")
    
    long_target_dir = to_long_path(TARGET_DIR)
    
    file_renames = 0
    dir_renames = 0
    errors = []
    
    print(f"Renaming files and directories in {TARGET_DIR}...")
    
    for root, dirs, files in os.walk(long_target_dir, topdown=False):
        # 1. Rename files in current directory
        for f in files:
            new_f = f
            for pattern, replacement in replacements:
                new_f = pattern.sub(replacement, new_f)
            
            if new_f != f:
                old_path = os.path.join(root, f)
                new_path = os.path.join(root, new_f)
                try:
                    os.rename(old_path, new_path)
                    file_renames += 1
                except Exception as e:
                    errors.append((old_path, str(e)))
                    
        # 2. Rename directories inside current directory
        for d in dirs:
            new_d = d
            for pattern, replacement in replacements:
                new_d = pattern.sub(replacement, new_d)
                
            if new_d != d:
                old_dir_path = os.path.join(root, d)
                new_dir_path = os.path.join(root, new_d)
                try:
                    os.rename(old_dir_path, new_dir_path)
                    dir_renames += 1
                except Exception as e:
                    errors.append((old_dir_path, str(e)))

    print("\n================ RENAMING SUMMARY ================")
    print(f"Files Renamed: {file_renames}")
    print(f"Directories Renamed: {dir_renames}")
    print(f"Errors Encountered: {len(errors)}")
    print("==================================================")
    
    if errors:
        print("\nErrors preview:")
        for path, err in errors[:10]:
            print(f"- {path}: {err}")

if __name__ == "__main__":
    main()
