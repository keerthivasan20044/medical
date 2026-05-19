const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'context', 'LanguageContext.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

function checkSection(sectionName) {
    const startTag = sectionName + ': {';
    const startIdx = content.indexOf(startTag);
    if (startIdx === -1) return;
    
    // Find the closing brace of the section
    let braceCount = 1;
    let endIdx = -1;
    for (let i = startIdx + startTag.length; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') braceCount--;
        if (braceCount === 0) {
            endIdx = i;
            break;
        }
    }
    
    const sectionLines = content.substring(startIdx, endIdx).split('\n');
    const startLineNum = content.substring(0, startIdx).split('\n').length;
    
    const keys = {};
    const duplicates = [];
    
    sectionLines.forEach((line, index) => {
        const match = line.match(/^\s+([\w]+):/);
        if (match) {
            const key = match[1];
            if (keys[key]) {
                duplicates.push({ key, line: startLineNum + index });
            } else {
                keys[key] = { line: startLineNum + index };
            }
        }
    });
    
    return duplicates;
}

console.log('EN Duplicates:', JSON.stringify(checkSection('en'), null, 2));
console.log('TA Duplicates:', JSON.stringify(checkSection('ta'), null, 2));
