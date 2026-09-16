import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);

const CHARACTERS_DIR = path.join(ROOT_DIR, 'Characters');
const VGMSTREAM_CLI = path.join(ROOT_DIR, 'tools', 'vgmstream', 'vgmstream-cli.exe');

const execFileAsync = promisify(execFile);

function findWemFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findWemFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.wem')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  console.log('1. Scanning Characters directory for unconverted .wem audio files...');
  const wemFiles = findWemFiles(CHARACTERS_DIR);
  console.log(`Found ${wemFiles.length} .wem files to convert to .wav.`);

  if (wemFiles.length === 0) {
    console.log('No .wem files found. All files are already converted!');
    return;
  }

  const concurrency = 16;
  let completed = 0;
  let errors = 0;
  const startTime = Date.now();

  async function worker(queue) {
    while (queue.length > 0) {
      const wemPath = queue.pop();
      if (!wemPath) break;

      const wavPath = wemPath.slice(0, -4) + '.wav';

      try {
        await execFileAsync(VGMSTREAM_CLI, ['-o', wavPath, wemPath]);
        // Remove .wem file after successful conversion
        if (fs.existsSync(wavPath) && fs.statSync(wavPath).size > 0) {
          fs.unlinkSync(wemPath);
          completed++;
        } else {
          errors++;
        }
      } catch (err) {
        errors++;
      }

      if (completed % 500 === 0 && completed > 0) {
        console.log(`Progress: ${completed}/${wemFiles.length} WEM conversions completed...`);
      }
    }
  }

  const queue = [...wemFiles];
  const workers = Array.from({ length: concurrency }, () => worker(queue));
  await Promise.all(workers);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`================ CONVERSION SUMMARY ================`);
  console.log(`Time Elapsed: ${duration} seconds`);
  console.log(`WEM Files Converted: ${completed} / ${wemFiles.length}`);
  console.log(`Errors: ${errors}`);
  console.log(`====================================================`);
}

main();
