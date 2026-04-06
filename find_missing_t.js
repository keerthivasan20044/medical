const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = getFiles('client/src');
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('t(') && !content.includes('useLanguage') && !content.includes('const t =') && !content.includes('function t(')) {
        // Double check if t is actually the translation function (it might be a local var)
        if (content.includes('t(\'') || content.includes('t("') || content.includes('t(`')) {
            console.log(`Potential missing t in: ${file}`);
        }
    }
});
