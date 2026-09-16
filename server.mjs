import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const PUBLIC_DIR = path.join(__dirname, 'public');
const REGISTRY_FILE = path.join(PUBLIC_DIR, 'registry.json');
const REGEN_SCRIPT = path.join(__dirname, 'generate_registry.mjs');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.gif': 'image/gif'
};

function serveFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to dist/index.html for SPA routing
      const indexPath = path.join(DIST_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Dynamic API Endpoint: /api/registry or /api/scan
  if (urlPath === '/api/registry' || urlPath === '/api/scan') {
    console.log('[Server] Rebuilding registry dynamically for request...');
    exec(`node "${REGEN_SCRIPT}"`, (err, stdout) => {
      if (err) {
        console.error('[Server] Regen error:', err.message);
      }
      if (fs.existsSync(REGISTRY_FILE)) {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
        fs.createReadStream(REGISTRY_FILE).pipe(res);
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to generate registry' }));
      }
    });
    return;
  }

  // Check if requested file exists in dist, public, or root workspace
  let targetPath = path.join(DIST_DIR, urlPath);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    serveFile(req, res, targetPath);
    return;
  }

  targetPath = path.join(PUBLIC_DIR, urlPath);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    serveFile(req, res, targetPath);
    return;
  }

  targetPath = path.join(__dirname, urlPath);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
    serveFile(req, res, targetPath);
    return;
  }

  // SPA fallback
  serveFile(req, res, path.join(DIST_DIR, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`[Server] Spike Media Node Auto-Scanner Server running on http://localhost:${PORT}`);
  console.log(`[Server] Live Dynamic Registry API available at http://localhost:${PORT}/api/registry`);
});
