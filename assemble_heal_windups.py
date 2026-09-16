import os
import wave
import struct

TARGET_DIR = r"f:\Script\Valorant\SpikeMedia\Characters\Events_Char_Miks_SFX\C\Heal_Windups\NewSequence\Characters\_Char_Miks\Abil_C"

def read_wav(path):
    with wave.open(path, 'rb') as w:
        return w.getparams(), w.readframes(w.getnframes())

def write_wav(path, params, frames):
    with wave.open(path, 'wb') as w:
        w.setparams(params)
        w.writeframes(frames)
    print(f"Created assembled file: {os.path.basename(path)} ({os.path.getsize(path)} bytes)")

def mix_pcm_16bit(data_list):
    if not data_list:
        return b''
    
    unpacked_list = []
    max_count = 0
    for data in data_list:
        count = len(data) // 2
        if count > max_count:
            max_count = count
        unpacked_list.append((struct.unpack(f'<{count}h', data), count))
        
    out = bytearray()
    for i in range(max_count):
        total_sample = 0
        for samples, count in unpacked_list:
            if i < count:
                total_sample += samples[i]
                
        mixed = max(-32768, min(32767, total_sample))
        out.extend(struct.pack('<h', mixed))
        
    return bytes(out)

def assemble():
    if not os.path.exists(TARGET_DIR):
        print("Target directory not found:", TARGET_DIR)
        return

    variations = {
        "Variation_1": {
            "DR": [
                "Miks_AbilC_Windup_Heal_DR_1_1_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_1_3_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_1_4_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_1_5_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_1_7_1 (SFX).wav"
            ],
            "TN": [
                "Miks_AbilC_Windup_Heal_TN_1_1_4 (SFX).wav",
                "Miks_AbilC_Windup_Heal_TN_1_5_4 (SFX).wav"
            ],
            "VX": [
                "Miks_AbilC_Windup_Heal_VX_1_1_4 (SFX).wav",
                "Miks_AbilC_Windup_Heal_VX_1_5_4 (SFX).wav"
            ]
        },
        "Variation_2": {
            "DR": [
                "Miks_AbilC_Windup_Heal_DR_2_1_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_2_3_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_2_4_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_2_5_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_2_7_1 (SFX).wav"
            ],
            "TN": [
                "Miks_AbilC_Windup_Heal_TN_2_1_4 (SFX).wav",
                "Miks_AbilC_Windup_Heal_TN_2_5_4 (SFX).wav"
            ],
            "VX": [
                "Miks_AbilC_Windup_Heal_VX_2_1_2 (SFX).wav",
                "Miks_AbilC_Windup_Heal_VX_2_3_4 (SFX).wav",
                "Miks_AbilC_Windup_Heal_VX_2_5_2 (SFX).wav",
                "Miks_AbilC_Windup_Heal_VX_2_7_4 (SFX).wav"
            ]
        },
        "Variation_3": {
            "DR": [
                "Miks_AbilC_Windup_Heal_DR_3_1_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_3_3_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_3_4_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_3_5_1 (SFX).wav",
                "Miks_AbilC_Windup_Heal_DR_3_7_1 (SFX).wav"
            ],
            "TN": [
                "Miks_AbilC_Windup_Heal_TN_3_1_4 (SFX).wav",
                "Miks_AbilC_Windup_Heal_TN_3_5_4 (SFX).wav"
            ],
            "VX": [
                "Miks_AbilC_Windup_Heal_VX_3_1_2 (SFX).wav",
                "Miks_AbilC_Windup_Heal_VX_3_5_2 (SFX).wav",
                "Miks_AbilC_Windup_Heal_VX_3_7_4 (SFX).wav"
            ]
        }
    }

    out_folder = os.path.join(TARGET_DIR, "_ASSEMBLED_SEQUENCES_")
    os.makedirs(out_folder, exist_ok=True)

    for var_name, layers in variations.items():
        print(f"\nProcessing {var_name}...")
        assembled_layer_data = []
        base_params = None

        for layer_name, file_list in layers.items():
            if not file_list:
                continue
            params, layer_data = read_wav(os.path.join(TARGET_DIR, file_list[0]))
            base_params = params
            for f in file_list[1:]:
                _, d = read_wav(os.path.join(TARGET_DIR, f))
                layer_data += d
            
            stem_filename = f"Miks_AbilC_Heal_{var_name}_{layer_name}_Stems.wav"
            write_wav(os.path.join(out_folder, stem_filename), params, layer_data)
            assembled_layer_data.append(layer_data)

        # Mix DR + TN + VX
        mixed_data = mix_pcm_16bit(assembled_layer_data)
        mix_out_name = f"Miks_AbilC_Heal_{var_name}_COMPLETE_MIXED.wav"
        
        # Save complete mix in _ASSEMBLED_SEQUENCES_ and parent TARGET_DIR
        write_wav(os.path.join(out_folder, mix_out_name), base_params, mixed_data)
        write_wav(os.path.join(TARGET_DIR, mix_out_name), base_params, mixed_data)

if __name__ == "__main__":
    assemble()
