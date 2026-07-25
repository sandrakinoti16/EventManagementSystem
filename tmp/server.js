const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const rootDir = path.resolve(__dirname, '..');

http.createServer((req, res) => {
  let requestPath = req.url.split('?')[0];
  if (requestPath === '/') requestPath = '/dashboard.html'; // Default to dashboard page directly
  
  const filePath = path.join(rootDir, requestPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found at: ' + filePath);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}).listen(8000, '0.0.0.0', () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  console.log('Server is running locally at: http://localhost:8000/');
  console.log('Or test on your mobile device via Wi-Fi:');
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`  http://${net.address}:8000/dashboard.html`);
      }
    }
  }
});
