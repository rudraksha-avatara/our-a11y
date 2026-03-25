import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const versionDir = join(distDir, 'a11y', 'v1');

mkdirSync(versionDir, { recursive: true });

const filesToCopy = [
  'our-a11y.iife.js',
  'our-a11y.iife.js.map',
  'our-a11y.es.js',
  'our-a11y.es.js.map'
];

for (const file of filesToCopy) {
  const source = join(distDir, file);
  const target = join(versionDir, file);
  if (existsSync(source)) {
    copyFileSync(source, target);
  }
}
