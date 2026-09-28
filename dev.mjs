import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const dirs = ['backend', 'frontend'];

for (const dir of dirs) {
  if (existsSync(path.join(root, dir, 'node_modules'))) continue;
  console.log(`[dev] installing ${dir} dependencies...`);
  const install = spawnSync('npm', ['install'], { cwd: path.join(root, dir), stdio: 'inherit', shell: true });
  if (install.status !== 0) process.exit(install.status ?? 1);
}

// The banner must not lie: the backend reads PORT from backend/.env, so read
// the same file here instead of assuming the default.
const backendPort = (() => {
  const envFile = path.join(root, 'backend', '.env');

  if (!existsSync(envFile)) return 3001;

  const match = readFileSync(envFile, 'utf8').match(/^\s*PORT\s*=\s*(\d+)\s*$/m);

  return match ? Number(match[1]) : 3001;
})();


// 5173 is taken by another project on this machine, so we own a dedicated range
const freePort = (candidates) =>
  new Promise((resolve) => {
    const probe = (i) => {
      if (i >= candidates.length) return resolve(candidates[0]);
      const server = net.createServer();
      server.once('error', () => probe(i + 1));
      server.once('listening', () => server.close(() => resolve(candidates[i])));
      server.listen(candidates[i]);
    };
    probe(0);
  });

const port = await freePort([5180, 5181, 5182]);
const frontendUrl = `http://localhost:${port}`;

console.log(`\n[dev] backend  http://localhost:${backendPort}`);
console.log(`[dev] frontend ${frontendUrl}`);
console.log('[dev] Jendela aplikasi terbuka otomatis, tunggu sebentar.');
console.log('[dev] Tekan Ctrl+C di jendela ini untuk mematikan semuanya.\n');

// both start in parallel; vite waits for nothing, backend retries nothing
const children = dirs.map((dir) => {
  const args = dir === 'frontend' ? ['run', 'dev', '--', '--port', String(port), '--strictPort'] : ['run', 'dev'];
  return spawn('npm', args, { cwd: path.join(root, dir), stdio: 'inherit', shell: true });
});

let appWindow;

const stop = () => {
  // only our own browser process; the dedicated profile keeps it ours even when Edge/Chrome is already running
  if (appWindow && appWindow.exitCode === null) appWindow.kill();
  for (const child of children) {
    if (!child.pid || child.exitCode !== null) continue;
    // Windows: the pid is the shell wrapper, kill the whole tree
    if (process.platform === 'win32') spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else child.kill('SIGINT');
  }
};

const waitFor = async (url, timeoutMs = 30000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      await fetch(url, { signal: AbortSignal.timeout(2000) });
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return false;
};

const openAppWindow = (url) => {
  const browsers = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  const exe = browsers.find((candidate) => existsSync(candidate));
  appWindow = exe
    ? spawn(exe, ['--app=' + url], { detached: true, stdio: 'ignore' })
    : spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' });
  appWindow.unref();
};

if (await waitFor(frontendUrl)) {
  openAppWindow(frontendUrl);
} else {
  console.log('\n[dev] Server tidak merespons setelah 30 detik.');
  console.log('[dev] Tutup jendela ini, lalu jalankan Jalankan.bat lagi.\n');
  stop();
  process.exit(1);
}

const shutdown = () => {
  stop();
  process.exit(0);
};

process.on('SIGINT', shutdown);
// a Windows console-window close delivers CTRL_CLOSE_EVENT, which Node maps to SIGHUP
process.on('SIGHUP', shutdown);
process.on('SIGTERM', stop);
