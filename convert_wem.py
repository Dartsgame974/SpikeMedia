import os
import sys
import shutil
import glob
import time
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

SOURCE_DIR = r"C:\Users\DartsgameKL\Downloads\FModel\Output\Exports\ShooterGame\Content\WwiseAudio\Events\SFX\Characters"
OUTPUT_DIR = r"f:\Script\Valorant\SpikeMedia\Characters"
VGMSTREAM_CLI = r"f:\Script\Valorant\SpikeMedia\tools\vgmstream\vgmstream-cli.exe"

def to_long_path(path):
    abs_path = os.path.abspath(path)
    if os.name == 'nt' and not abs_path.startswith('\\\\?\\'):
        return '\\\\?\\' + abs_path
    return abs_path

def convert_single_wem(args):
    src_file, dst_file = args
    long_src = to_long_path(src_file)
    long_dst = to_long_path(dst_file)
    
    os.makedirs(os.path.dirname(dst_file), exist_ok=True)
    
    cmd = [VGMSTREAM_CLI, "-o", long_dst, long_src]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0 and os.path.exists(dst_file) and os.path.getsize(dst_file) > 0:
            return True, src_file, None
        else:
            return False, src_file, f"vgmstream returned {res.returncode}: {res.stderr.strip()}"
    except Exception as e:
        return False, src_file, str(e)

def copy_single_wav(args):
    src_file, dst_file = args
    long_src = to_long_path(src_file)
    long_dst = to_long_path(dst_file)
    
    os.makedirs(os.path.dirname(dst_file), exist_ok=True)
    try:
        shutil.copy2(long_src, long_dst)
        return True, src_file, None
    except Exception as e:
        return False, src_file, str(e)

def main():
    start_time = time.time()
    
    if not os.path.exists(VGMSTREAM_CLI):
        print(f"Error: vgmstream-cli.exe not found at {VGMSTREAM_CLI}")
        sys.exit(1)
        
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: Source directory not found: {SOURCE_DIR}")
        sys.exit(1)
        
    print(f"Scanning source directory: {SOURCE_DIR}")
    
    wem_tasks = []
    wav_tasks = []
    
    long_source_dir = to_long_path(SOURCE_DIR)
    for root, dirs, files in os.walk(long_source_dir):
        raw_root = root[4:] if root.startswith('\\\\?\\') else root
        for f in files:
            src_path = os.path.join(raw_root, f)
            rel_path = os.path.relpath(src_path, SOURCE_DIR)
            
            ext = os.path.splitext(f)[1].lower()
            if ext == ".wem":
                dst_name = os.path.splitext(rel_path)[0] + ".wav"
                dst_path = os.path.join(OUTPUT_DIR, dst_name)
                wem_tasks.append((src_path, dst_path))
            elif ext == ".wav":
                dst_path = os.path.join(OUTPUT_DIR, rel_path)
                wav_tasks.append((src_path, dst_path))
                
    print(f"Found {len(wem_tasks)} WEM files to process.")
    print(f"Found {len(wav_tasks)} WAV files to process.")
    
    workers = min(32, (os.cpu_count() or 4) * 2)
    print(f"Starting conversion using {workers} parallel threads with Windows Long Path support...")
    
    successful_conversions = 0
    failed_conversions = 0
    errors = []
    
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(convert_single_wem, task) for task in wem_tasks]
        
        total = len(futures)
        done_count = 0
        for future in as_completed(futures):
            done_count += 1
            success, src_file, err = future.result()
            if success:
                successful_conversions += 1
            else:
                failed_conversions += 1
                errors.append((src_file, err))
                
            if done_count % 1000 == 0 or done_count == total:
                print(f"Progress: {done_count}/{total} WEM conversions completed...")

    successful_copies = 0
    failed_copies = 0
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = [executor.submit(copy_single_wav, task) for task in wav_tasks]
        for future in as_completed(futures):
            success, src_file, err = future.result()
            if success:
                successful_copies += 1
            else:
                failed_copies += 1
                errors.append((src_file, err))
                
    elapsed = time.time() - start_time
    
    total_size = 0
    total_wav_count = 0
    long_output_dir = to_long_path(OUTPUT_DIR)
    for root, dirs, files in os.walk(long_output_dir):
        raw_root = root[4:] if root.startswith('\\\\?\\') else root
        for f in files:
            if f.lower().endswith('.wav'):
                total_wav_count += 1
                total_size += os.path.getsize(os.path.join(raw_root, f))
                
    total_mb = total_size / (1024 * 1024)
    
    print("\n================ FINAL CONVERSION SUMMARY ================")
    print(f"Elapsed Time: {elapsed:.2f} seconds")
    print(f"WEM Files Converted: {successful_conversions} / {len(wem_tasks)}")
    print(f"WAV Files Copied: {successful_copies} / {len(wav_tasks)}")
    print(f"Failed Conversions/Copies: {len(errors)}")
    print(f"Total Output WAV Files: {total_wav_count}")
    print(f"Total Disk Size: {total_mb:.2f} MB")
    print("==========================================================")
    
    if errors:
        print("\nErrors encountered:")
        for src, err in errors[:10]:
            print(f"- {src}: {err}")
        if len(errors) > 10:
            print(f"... and {len(errors) - 10} more errors.")

if __name__ == "__main__":
    main()
