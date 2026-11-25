/**
 * Build del sitio del Studio para GitHub Pages.
 *
 * Bundlea la UI actual (src/ui/studio.js) en un único ESM que se sirve desde
 * docs/assets/umbral-vision.js. El layout y el CSS del host viven en docs/.
 */

import { build } from 'esbuild';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

await mkdir('docs/assets', { recursive: true });

await build({
  entryPoints: ['src/ui/studio.js'],
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  outfile: 'docs/assets/umbral-vision.js',
  minify: true,
  sourcemap: false,
  legalComments: 'none',
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});

await copyFile('src/audio/audio-map.json', 'docs/assets/audio-map.json');

// Cache-buster: GitHub Pages cachea assets 10 minutos.
const version = Date.now().toString(36);
let html = await readFile('docs/index.html', 'utf8');
html = html.replace(/(\.(?:css|js))\?v=[^"']*/g, `$1?v=${version}`);
await writeFile('docs/index.html', html);

console.log('Built docs/index.html site assets: docs/assets/umbral-vision.js, docs/assets/audio-map.json');
