import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VALORANTEK_DIR = path.join(__dirname, 'Valorantek');
const SCRIPT_PATH = path.join(__dirname, 'generate_registry.mjs');

console.log(`[Watch] Monitoring directory: ${VALORANTEK_DIR}`);
console.log(`[Watch] Any new agent folder or image asset added will auto-trigger registry regeneration...`);

let debounceTimer = null;
function triggerRegen(filename) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log(`[Watch] Change detected in ${filename}. Rebuilding registry.json...`);
    exec(`node "${SCRIPT_PATH}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`[Watch] Error rebuilding registry:`, err.message);
        return;
      }
      console.log(`[Watch] Registry rebuilt successfully!\n${stdout}`);
    });
  }, 500);
}

if (fs.existsSync(VALORANTEK_DIR)) {
  fs.watch(VALORANTEK_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && !filename.includes('registry.json')) {
      triggerRegen(filename);
    }
  });
}
