import { build } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const path = (name) => fileURLToPath(new URL(name, root));
const output = await build({
  root: path('.'),
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    write: false,
    lib: { entry: path('src/main.tsx'), name: 'ClearMealsDirectory', formats: ['iife'] },
  },
});
const files = (Array.isArray(output) ? output : [output]).flatMap((item) => item.output);
const javascript = files.find((item) => item.type === 'chunk')?.code;
const css = files.find((item) => item.type === 'asset' && item.fileName.endsWith('.css'))?.source;
if (!javascript || typeof css !== 'string') throw new Error('Incomplete directory bundle');

const favicon = Buffer.from(await readFile(path('src/favicon.svg'))).toString('base64');
const template = await readFile(path('dev.html'), 'utf8');
const html = template
  .replace('./src/favicon.svg', () => 'data:image/svg+xml;base64,' + favicon)
  .replace('</head>', () => '<style>' + css.replace(/<\/style/gi, '<\\/style') + '</style>\n  </head>')
  .replace('<script type="module" src="/src/main.tsx"></script>',
    () => '<script>' + javascript.replace(/<\/script/gi, '<\\/script') + '</script>');
await mkdir(path('docs'), { recursive: true });
await writeFile(path('docs/index.html'), html);
await writeFile(path('docs/.nojekyll'), '');
