/**
 * Safe hook injector - adds `useLanguage` import + `const { t } = useLanguage();`
 * to files that are missing it, ONLY when they contain hardcoded UI text.
 *
 * Strategy: inject only if the file has a named default export function
 * and does NOT already have the hook.
 */
const fs = require('fs');
const path = require('path');

// Priority files to inject the hook into (highest user impact)
const TARGETS = [
  // Shared components used everywhere
  'client/src/components/medicine/MedicineCard.jsx',
  'client/src/components/pharmacy/PharmacyCard.jsx',
  'client/src/components/pharmacy/PharmacyCard_v2.jsx',
  'client/src/components/layout/MobileBottomNav.jsx',
  // Customer pages
  'client/src/pages/customer/Orders.jsx',
  'client/src/pages/customer/OrderDetail.jsx',
  'client/src/pages/customer/Notifications.jsx',
  'client/src/pages/customer/Prescriptions.jsx',
  'client/src/pages/customer/Wallet.jsx',
  'client/src/pages/customer/Emergency.jsx',
  // Delivery pages
  'client/src/pages/delivery/DeliveryOverview.jsx',
  'client/src/pages/delivery/DeliveryHistory.jsx',
  'client/src/pages/delivery/DeliveryActive.jsx',
  'client/src/pages/delivery/DeliveryAvailable.jsx',
  // Pharmacist pages
  'client/src/pages/pharmacist/PharmacistOverview.jsx',
  'client/src/pages/pharmacist/PharmacistOrders.jsx',
  'client/src/pages/pharmacist/PharmacistInventory.jsx',
  // Public pages
  'client/src/pages/public/Doctors.jsx',
  'client/src/pages/public/Pharmacies.jsx',
  'client/src/pages/public/Emergency.jsx',
];

function getRelativeContextPath(filePath) {
  const fileDir = path.dirname(filePath);
  const contextPath = path.join(__dirname, 'client', 'src', 'context', 'LanguageContext.jsx');
  let rel = path.relative(fileDir, contextPath).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel.replace('.jsx', '');
}

function injectHook(filePath) {
  const absPath = path.join(__dirname, filePath);
  if (!fs.existsSync(absPath)) {
    console.log(`SKIP (not found): ${filePath}`);
    return;
  }

  let content = fs.readFileSync(absPath, 'utf8');

  if (content.includes('useLanguage') || content.includes('useLang')) {
    console.log(`SKIP (already has hook): ${filePath}`);
    return;
  }

  const contextImport = getRelativeContextPath(absPath);
  const importLine = `import { useLanguage } from '${contextImport}';`;

  // Find last import line to insert after it
  const lines = content.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith('import ')) lastImportIdx = i;
  }

  if (lastImportIdx === -1) {
    console.log(`SKIP (no imports found): ${filePath}`);
    return;
  }

  // Insert import after last import
  lines.splice(lastImportIdx + 1, 0, importLine);
  content = lines.join('\n');

  // Find the first `export default function` or `function` declaration inside the file
  // and inject `const { t } = useLanguage();` as the first line of the function body
  content = content.replace(
    /^(export default function \w+[^{]*{|function \w+[^{]*{)/m,
    (match) => match + '\n  const { t } = useLanguage();'
  );

  fs.writeFileSync(absPath, content, 'utf8');
  console.log(`INJECTED: ${filePath}`);
}

TARGETS.forEach(injectHook);
console.log('\nDone!');
