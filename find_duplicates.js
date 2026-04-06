const fs = require('fs');
const content = fs.readFileSync('client/src/context/LanguageContext.jsx', 'utf8');

const findDuplicates = (langCode) => {
    const sectionStart = content.indexOf(`${langCode}: {`);
    let sectionEnd = content.indexOf('},', sectionStart);
    // Find the matching close brace correctly
    let depth = 1;
    let i = sectionStart + `${langCode}: {`.length;
    while (depth > 0 && i < content.length) {
        if (content[i] === '{') depth++;
        if (content[i] === '}') depth--;
        i++;
    }
    sectionEnd = i;
    
    const section = content.substring(sectionStart, sectionEnd);
    const regex = /^\s+([a-zA-Z0-9_]+):/gm;
    let match;
    const keys = {};
    const duplicates = [];
    while ((match = regex.exec(section)) !== null) {
        const key = match[1];
        if (keys[key]) {
            duplicates.push(key);
        } else {
            keys[key] = true;
        }
    }
    return duplicates;
};

console.log('Duplicated keys in EN:', findDuplicates('en'));
console.log('Duplicated keys in TA:', findDuplicates('ta'));
