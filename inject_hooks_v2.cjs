/**
 * Precision hook injector v2 - uses exact string matching, NOT global regex
 * to safely inject useLanguage into specific files.
 */
const fs = require('fs');
const path = require('path');

const TARGETS = [
  {
    file: 'client/src/pages/customer/Orders.jsx',
    afterImport: "import useInfiniteScroll from '../../hooks/useInfiniteScroll';",
    hookImport: "import { useLanguage } from '../../context/LanguageContext';",
    afterFn: "export default function MyOrdersPage() {",
    hookCall: "  const { t } = useLanguage();"
  },
  {
    file: 'client/src/pages/customer/Emergency.jsx',
    afterImport: null, // no imports - will prepend
    hookImport: "import { useLanguage } from '../../context/LanguageContext';",
    afterFn: "export default function Emergency() {",
    hookCall: "  const { t } = useLanguage();"
  },
];

TARGETS.forEach(({ file, afterImport, hookImport, afterFn, hookCall }) => {
  const absPath = path.join(__dirname, file);
  if (!fs.existsSync(absPath)) {
    console.log(`SKIP (not found): ${file}`);
    return;
  }

  let content = fs.readFileSync(absPath, 'utf8');

  if (content.includes('useLanguage') || content.includes('useLang')) {
    console.log(`SKIP (already has hook): ${file}`);
    return;
  }

  // Inject import
  if (afterImport && content.includes(afterImport)) {
    content = content.replace(afterImport, afterImport + '\n' + hookImport);
  } else if (!afterImport) {
    // Prepend import at top
    content = hookImport + '\n\n' + content;
  } else {
    console.log(`WARN: afterImport not found in ${file}, prepending import`);
    content = hookImport + '\n\n' + content;
  }

  // Inject hook call inside function
  if (content.includes(afterFn)) {
    content = content.replace(afterFn, afterFn + '\n' + hookCall);
  } else {
    console.log(`WARN: function signature not found in ${file}`);
  }

  fs.writeFileSync(absPath, content, 'utf8');
  console.log(`INJECTED: ${file}`);
});

console.log('\nDone!');
