import os
import sys
import subprocess
import shutil
import zlib
import struct

FFMPEG = r"C:\ffmpeg\bin\ffmpeg.exe"
ROOT_DIR = r"f:\Script\Valorant\SpikeMedia"
SPRITESHEET_DIR = os.path.join(ROOT_DIR, "Valorantek", "Spritesheet")
OUTPUT_DIR = os.path.join(SPRITESHEET_DIR, "converted")

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Grid specs for known spritesheets
SPECS = {
    'TX_FB_AnnouncementBombIntro.png': {'cols': 4, 'rows': 6, 'fps': 24, 'widescreen': False},
    'TX_Transitions_UI_Sprite_Intro2.png': {'cols': 5, 'rows': 6, 'fps': 25, 'widescreen': True}
}

def read_png_rgba(path):
    with open(path, 'rb') as f:
        data = f.read()
    w, h = struct.unpack('>II', data[16:24])
    idat = b''
    pos = 8
    while pos < len(data):
        length, chunk_type = struct.unpack('>I4s', data[pos:pos+8])
        if chunk_type == b'IDAT':
            idat += data[pos+8:pos+8+length]
        pos += 12 + length
    raw = zlib.decompress(idat)
    bpp = 4
    stride = w * bpp + 1
    pixels = bytearray(w * h * 4)
    prev_line = bytearray(w * 4)
    for y in range(h):
        line = raw[y * stride : (y + 1) * stride]
        filter_type = line[0]
        curr_line = bytearray(w * 4)
        for x in range(w * 4):
            filt = line[1 + x]
            if filter_type == 0: val = filt
            elif filter_type == 1: val = (filt + (curr_line[x - 4] if x >= 4 else 0)) % 256
            elif filter_type == 2: val = (filt + prev_line[x]) % 256
            elif filter_type == 3: val = (filt + ((curr_line[x - 4] if x >= 4 else 0) + prev_line[x]) // 2) % 256
            elif filter_type == 4:
                a = curr_line[x - 4] if x >= 4 else 0
                b = prev_line[x]
                c = prev_line[x - 4] if x >= 4 else 0
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                val = (filt + pr) % 256
            curr_line[x] = val
        pixels[y*w*4 : (y+1)*w*4] = curr_line
        prev_line = curr_line
    return w, h, pixels

def save_png_rgba(path, width, height, pixels):
    def make_chunk(chunk_type, data):
        return struct.pack('>I', len(data)) + chunk_type + data + struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)

    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0) # None filter
        raw_data.extend(pixels[y * width * 4 : (y + 1) * width * 4])

    compressed = zlib.compress(raw_data)
    
    header = b'\x89PNG\r\n\x1a\n'
    ihdr = make_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    idat = make_chunk(b'IDAT', compressed)
    iend = make_chunk(b'IEND', b'')

    with open(path, 'wb') as f:
        f.write(header + ihdr + idat + iend)

def render_videos(temp_frames_dir, output_prefix, fps, scale_vf=None):
    gif_path = f"{output_prefix}.gif"
    mov_path = f"{output_prefix}.mov"
    mp4_path = f"{output_prefix}.mp4"

    # 1. GIF
    gif_vf = "split[s0][s1];[s0]palettegen=reserve_transparent=1[p];[s1][p]paletteuse"
    if scale_vf:
        gif_vf = f"{scale_vf},{gif_vf}"

    print(f"Generating GIF: {gif_path}")
    cmd_gif = [
        FFMPEG, "-y",
        "-framerate", str(fps),
        "-i", os.path.join(temp_frames_dir, "frame_%03d.png"),
        "-vf", gif_vf,
        gif_path
    ]
    subprocess.run(cmd_gif, check=True)

    # 2. MOV (QTRLE with Alpha Transparency)
    mov_args = []
    if scale_vf:
        mov_args = ["-vf", scale_vf]

    print(f"Generating MOV: {mov_path}")
    cmd_mov = [
        FFMPEG, "-y",
        "-framerate", str(fps),
        "-i", os.path.join(temp_frames_dir, "frame_%03d.png"),
        *mov_args,
        "-c:v", "qtrle",
        mov_path
    ]
    subprocess.run(cmd_mov, check=True)

    # 3. MP4 (H.264)
    mp4_vf = "pad=ceil(iw/2)*2:ceil(ih/2)*2"
    if scale_vf:
        mp4_vf = f"{scale_vf},{mp4_vf}"

    print(f"Generating MP4: {mp4_path}")
    cmd_mp4 = [
        FFMPEG, "-y",
        "-framerate", str(fps),
        "-i", os.path.join(temp_frames_dir, "frame_%03d.png"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-vf", mp4_vf,
        mp4_path
    ]
    subprocess.run(cmd_mp4, check=True)

def process_spritesheet(filename):
    src_path = os.path.join(SPRITESHEET_DIR, filename)
    if not os.path.exists(src_path):
        print(f"Skipping {filename}, not found.")
        return

    base_name = os.path.splitext(filename)[0]
    spec = SPECS.get(filename, {'cols': 4, 'rows': 4, 'fps': 24, 'widescreen': False})
    cols = spec['cols']
    rows = spec['rows']
    fps = spec['fps']
    has_widescreen = spec.get('widescreen', False)

    print(f"\n==================================================")
    print(f"Processing {filename} ({cols} cols x {rows} rows, {fps} fps)...")
    print(f"==================================================")
    
    w, h, pixels = read_png_rgba(src_path)
    fw = w // cols
    fh = h // rows

    temp_frames_dir = os.path.join(ROOT_DIR, "scratch", f"frames_{base_name}")
    os.makedirs(temp_frames_dir, exist_ok=True)

    frame_count = 0
    for r in range(rows):
        for c in range(cols):
            frame_pixels = bytearray(fw * fh * 4)
            for fy in range(fh):
                sy = r * fh + fy
                sx_start = c * fw
                src_idx = (sy * w + sx_start) * 4
                dst_idx = (fy * fw) * 4
                frame_pixels[dst_idx : dst_idx + fw * 4] = pixels[src_idx : src_idx + fw * 4]
            
            frame_path = os.path.join(temp_frames_dir, f"frame_{frame_count:03d}.png")
            save_png_rgba(frame_path, fw, fh, frame_pixels)
            frame_count += 1

    print(f"Extracted {frame_count} frames to {temp_frames_dir}")

    # Standard / Pure Native Version
    native_prefix = os.path.join(OUTPUT_DIR, base_name)
    render_videos(temp_frames_dir, native_prefix, fps, scale_vf=None)

    if has_widescreen:
        # 16:9 Widescreen Stretched Version (1920x1080)
        ws_prefix = os.path.join(OUTPUT_DIR, f"{base_name}_16x9")
        print(f"\n--- Generating 16:9 Widescreen Stretched (1920x1080) version for {base_name} ---")
        render_videos(temp_frames_dir, ws_prefix, fps, scale_vf="scale=1920:1080:flags=bicubic")

    # Cleanup temp frames
    shutil.rmtree(temp_frames_dir, ignore_errors=True)
    print(f"Finished processing {filename} successfully.")

def main():
    for fn in os.listdir(SPRITESHEET_DIR):
        if fn.endswith('.png') and fn in SPECS:
            process_spritesheet(fn)

if __name__ == "__main__":
    main()
