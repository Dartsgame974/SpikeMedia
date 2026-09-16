import os
import wave
import struct

TARGET_DIR = r"f:\Script\Valorant\SpikeMedia\Characters\Events_Char_Miks_SFX\C\Concuss_Windups\NewSequence\Characters\_Char_Miks\Abil_C"

def read_wav(path):
    with wave.open(path, 'rb') as w:
        return w.getparams(), w.readframes(w.getnframes())

def write_wav(path, params, frames):
    with wave.open(path, 'wb') as w:
        w.setparams(params)
        w.writeframes(frames)
    print(f"Created assembled file: {os.path.basename(path)} ({os.path.getsize(path)} bytes)")

def mix_pcm_16bit(data1, data2):
    count1 = len(data1) // 2
    count2 = len(data2) // 2
    max_count = max(count1, count2)
    
    samples1 = struct.unpack(f'<{count1}h', data1)
    samples2 = struct.unpack(f'<{count2}h', data2)
    
    out = bytearray()
    for i in range(max_count):
        s1 = samples1[i] if i < count1 else 0
        s2 = samples2[i] if i < count2 else 0
        mixed = max(-32768, min(32767, s1 + s2))
        out.extend(struct.pack('<h', mixed))
    return bytes(out)

def assemble():
    if not os.path.exists(TARGET_DIR):
        print("Target directory not found:", TARGET_DIR)
        return

    variations = {
        "Variation_1": {
            "TN": ["Miks_AbilC_Windup_Concuss_TN_1_1_4 (SFX).wav", "Miks_AbilC_Windup_Concuss_TN_1_5_4 (SFX).wav"],
            "Vx": [
                "Miks_AbilC_Windup_Concuss_Vx_1_1_2 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_1_3_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_1_4_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_1_5_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_1_6_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_1_7_2 (SFX).wav"
            ]
        },
        "Variation_2": {
            "TN": ["Miks_AbilC_Windup_Concuss_TN_2_1_4 (SFX).wav", "Miks_AbilC_Windup_Concuss_TN_2_5_4 (SFX).wav"],
            "Vx": [
                "Miks_AbilC_Windup_Concuss_Vx_2_1_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_2_2_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_2_3_2 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_2_5_2 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_2_7_2 (SFX).wav"
            ]
        },
        "Variation_3": {
            "TN": ["Miks_AbilC_Windup_Concuss_TN_3_1_4 (SFX).wav", "Miks_AbilC_Windup_Concuss_TN_3_5_4 (SFX).wav"],
            "Vx": [
                "Miks_AbilC_Windup_Concuss_Vx_3_1_2 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_3_3_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_3_4_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_3_5_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_3_6_1 (SFX).wav",
                "Miks_AbilC_Windup_Concuss_Vx_3_7_1 (SFX).wav"
            ]
        }
    }

    out_folder = os.path.join(TARGET_DIR, "_ASSEMBLED_SEQUENCES_")
    os.makedirs(out_folder, exist_ok=True)

    for var_name, layers in variations.items():
        print(f"\nProcessing {var_name}...")
        
        # Stitch TN
        tn_params, tn_data = read_wav(os.path.join(TARGET_DIR, layers["TN"][0]))
        for f in layers["TN"][1:]:
            _, d = read_wav(os.path.join(TARGET_DIR, f))
            tn_data += d
        tn_out_name = f"Miks_AbilC_{var_name}_TN_FullStems.wav"
        write_wav(os.path.join(out_folder, tn_out_name), tn_params, tn_data)

        # Stitch Vx
        vx_params, vx_data = read_wav(os.path.join(TARGET_DIR, layers["Vx"][0]))
        for f in layers["Vx"][1:]:
            _, d = read_wav(os.path.join(TARGET_DIR, f))
            vx_data += d
        vx_out_name = f"Miks_AbilC_{var_name}_Vx_FullStems.wav"
        write_wav(os.path.join(out_folder, vx_out_name), vx_params, vx_data)

        # Mix TN + Vx
        mixed_data = mix_pcm_16bit(tn_data, vx_data)
        mix_out_name = f"Miks_AbilC_{var_name}_COMPLETE_MIXED.wav"
        write_wav(os.path.join(out_folder, mix_out_name), tn_params, mixed_data)
        
        # Also copy complete mix into parent folder for quick access
        write_wav(os.path.join(TARGET_DIR, mix_out_name), tn_params, mixed_data)

if __name__ == "__main__":
    assemble()
