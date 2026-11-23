import { build } from 'esbuild';
import { copyFile, mkdir } from 'node:fs/promises';

const common = {
  entryPoints: ['src/index.js'],
  bundle: true,
  sourcemap: true,
  target: ['es2022'],
  external: ['p5']
};

await build({
  ...common,
  outfile: 'dist/index.mjs',
  format: 'esm'
});

await build({
  ...common,
  outfile: 'dist/index.cjs',
  format: 'cjs',
  platform: 'neutral'
});

await mkdir('dist', { recursive: true });
await copyFile('src/audio/audio-map.json', 'dist/audio-map.json');

console.log('Built dist/index.mjs, dist/index.cjs and dist/audio-map.json');
