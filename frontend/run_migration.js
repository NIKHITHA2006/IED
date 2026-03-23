import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /\btext-white\b/g, replacement: 'text-slate-900 dark:text-white' },
  { regex: /text-slate-300/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { regex: /text-slate-400/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /bg-\[\#0d0f14\]/g, replacement: 'bg-slate-50 dark:bg-[#0d0f14]' },
  { regex: /bg-\[\#10131a\]/g, replacement: 'bg-white dark:bg-[#10131a]' },
  { regex: /bg-\[\#1a1d24\]/g, replacement: 'bg-white dark:bg-[#1a1d24]' },
  { regex: /border-white\/\[0\.05\]/g, replacement: 'border-slate-200 dark:border-white/[0.05]' },
  { regex: /border-white\/\[0\.07\]/g, replacement: 'border-slate-200 dark:border-white/[0.07]' },
  { regex: /border-white\/\[0\.1\]/g, replacement: 'border-slate-200 dark:border-white/[0.1]' },
  { regex: /border-white\/10/g, replacement: 'border-slate-200 dark:border-white/10' },
  { regex: /bg-slate-800/g, replacement: 'bg-slate-100 dark:bg-slate-800' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }

      // Cleanup any duplicate dark classes if run multiple times
      content = content.replace(/dark:dark:/g, 'dark:');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Migration complete.');
