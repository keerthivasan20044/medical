const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, 'client', 'src');

function walkDir(dir, exts = ['.jsx', '.js']) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.includes('node_modules')) {
      results = results.concat(walkDir(fullPath, exts));
    } else if (exts.some(e => item.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walkDir(srcDir, ['.jsx']);
const noHook = [];
const hasHook = [];

for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const hasLanguageHook = content.includes('useLanguage') || content.includes('useLang');
  const hasHardcoded = />[A-Z][a-z]/.test(content); // rough check for hardcoded text
  
  if (!hasLanguageHook) {
    noHook.push(path.relative(__dirname, f));
  } else {
    hasHook.push(path.relative(__dirname, f));
  }
}

console.log('\n=== FILES WITHOUT useLanguage HOOK ===');
noHook.sort().forEach(f => console.log(' -', f));

console.log('\n=== FILES WITH useLanguage HOOK ===');
hasHook.sort().forEach(f => console.log(' +', f));

console.log('\nTotal without hook:', noHook.length);
console.log('Total with hook:', hasHook.length);
