const fs = require('fs');
const content = fs.readFileSync('client/src/context/LanguageContext.jsx', 'utf8');

const analyzeSection = (langCode) => {
    const sectionStart = content.indexOf(`${langCode}: {`);
    let depth = 1;
    let i = sectionStart + `${langCode}: {`.length;
    while (depth > 0 && i < content.length) {
        if (content[i] === '{' && content[i-1] !== '$' && content[i-2] !== '{') depth++; // Simple depth tracker, ignoring strings and such
        if (content[i] === '}') depth--;
        i++;
    }
    const section = content.substring(sectionStart, i);
    const regex = /^\s+([a-zA-Z0-9_]+):/gm;
    const keyCounts = {};
    let match;
    while ((match = regex.exec(section)) !== null) {
        const key = match[1];
        keyCounts[key] = (keyCounts[key] || 0) + 1;
    }
    return keyCounts;
};

const enResult = analyzeSection('en');
const taResult = analyzeSection('ta');

console.log('--- EN Duplicates ---');
for (const k in enResult) { if (enResult[k] > 1) console.log(`${k}: ${enResult[k]}`); }
console.log('--- TA Duplicates ---');
for (const k in taResult) { if (taResult[k] > 1) console.log(`${k}: ${taResult[k]}`); }

// Also check overall keys consistency?
const enKeys = Object.keys(enResult);
const taKeys = Object.keys(taResult);
console.log('Keys in EN but not in TA:', enKeys.filter(k => !taKeys.includes(k)));
console.log('Keys in TA but not in EN:', taKeys.filter(k => !enKeys.includes(k)));
