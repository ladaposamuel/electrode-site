import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentlayerCli = path.join(root, 'node_modules', 'contentlayer', 'bin', 'cli.cjs');

const result = spawnSync(process.execPath, [contentlayerCli, 'build'], {
  cwd: root,
  encoding: 'utf8',
});

let stdout = result.stdout ?? '';
let stderr = result.stderr ?? '';
const combinedOutput = `${stdout}\n${stderr}`;
const isNode23ExitCodeNoise =
  result.status === 0 &&
  combinedOutput.includes('The "code" argument must be of type number') &&
  combinedOutput.includes('process.set [as exitCode]');

if (isNode23ExitCodeNoise) {
  const noisePattern = /TypeError: The "code" argument must be of type number[\s\S]*?\n}\n?/g;
  stdout = stdout.replace(noisePattern, '');
  stderr = stderr.replace(noisePattern, '');
}

if (stdout) {
  process.stdout.write(stdout);
}

if (stderr) {
  process.stderr.write(stderr);
}

process.exit(result.status ?? 1);
