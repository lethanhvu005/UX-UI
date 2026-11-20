const { loadEnvFile } = require('node:process');
const { networkInterfaces } = require('node:os');
const { spawn } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
loadEnvFile(path.join(root, '.env.local'));
const host = process.env.REACT_NATIVE_PACKAGER_HOSTNAME;
const addresses = Object.values(networkInterfaces()).flat().filter(a => a.family === 'IPv4' && !a.internal).map(a => a.address);
if (!addresses.includes(host)) {
  console.error('IP trong .env.local khong con thuoc may tinh. Cap nhat REACT_NATIVE_PACKAGER_HOSTNAME. IPv4 hien tai:', addresses.join(', '));
  process.exit(1);
}
console.log('Expo LAN IP:', host);
if (process.argv.includes('--check')) process.exit(0);
const cli = path.join(path.dirname(require.resolve('expo/package.json')), 'bin', 'cli');
const child = spawn(process.execPath, [cli, 'start', '--go', '--lan', '--port', '8090', ...process.argv.slice(2)], { cwd: root, stdio: 'inherit', env: process.env });
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
