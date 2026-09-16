import os
import sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

def process_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext not in ['.png', '.jpg', '.jpeg']:
        return (0, 0)

    try:
        orig_sz = os.path.getsize(file_path)
        # Skip small files (< 300 KB)
        if orig_sz < 300 * 1024:
            return (0, 0)

        with Image.open(file_path) as im:
            im.thumbnail((2560, 2560), Image.Resampling.LANCZOS)
            webp_path = os.path.splitext(file_path)[0] + '.webp'
            im.save(webp_path, 'WEBP', quality=82, optimize=True)

        new_sz = os.path.getsize(webp_path)
        os.remove(file_path)
        return (orig_sz, new_sz)
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return (0, 0)

def main():
    target_dirs = ['Valorantek', 'Characters']
    all_files = []

    for target in target_dirs:
        if os.path.exists(target):
            for root, _, files in os.walk(target):
                for f in files:
                    if f.lower().endswith(('.png', '.jpg', '.jpeg')):
                        all_files.append(os.path.join(root, f))

    print(f"Found {len(all_files)} total image candidates to check.")

    total_orig = 0
    total_new = 0
    converted_count = 0

    with ThreadPoolExecutor(max_workers=12) as executor:
        results = executor.map(process_file, all_files)
        for orig, new in results:
            if orig > 0:
                total_orig += orig
                total_new += new
                converted_count += 1

    print(f"DONE: Converted {converted_count} heavy images.")
    print(f"Original total size: {total_orig / (1024*1024):.2f} MB")
    print(f"New optimized size:  {total_new / (1024*1024):.2f} MB")
    print(f"Total space saved:   {(total_orig - total_new) / (1024*1024):.2f} MB")

if __name__ == '__main__':
    main()
