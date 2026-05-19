const fs = require('fs');
const path = require('path');

const replacements = {
  'client/src/pages/public/Checkout.jsx': [
    [/import { useState } from 'react';/, "import { useState } from 'react';\nimport { useLanguage } from '../../context/LanguageContext';"],
    [/export default function Checkout\(\) {/, "export default function Checkout() {\n  const { t } = useLanguage();"],
    [/name: 'LOGIN'/, "name: t('login')"],
    [/name: 'ADDRESS'/, "name: t('step3')"], // Step 3 in register is Location
    [/name: 'ORDER SUMMARY'/, "name: t('payloadSummary')"],
    [/name: 'PAYMENT'/, "name: t('paymentMethod')"],
    [/Secure Checkout/g, "{t('secureLogin')}"],
    [/Step Completed/g, "{t('syncedStatusLabel')}"],
    [/Change/g, "{t('editAction')}"],
    [/Home Address/g, "{t('geographicalNode')}"],
    [/DELIVER TO THIS ADDRESS/g, "{t('deliverTo').toUpperCase()}"],
    [/Add New Address/g, "{t('proceedLoc')}"],
    [/Quantity: /g, "{t('qty')}: "],
    [/CONFIRM ORDER/g, "{t('confirmAndPay')}"],
    [/PAY NOW/g, "{t('payNow')}"],
    [/PROCESSING.../g, "{t('processing')}"],
    [/Order Summary/g, "{t('payloadSummary')}"],
    [/Delivery/g, "{t('deliveryLabel')}"],
    [/TOTAL/g, "{t('grandTotal')}"],
    [/Order Status/g, "{t('statusLabel')}"],
    [/Verified <br \/> Delivery/g, "{t('verified')} <br /> {t('deliveryLabel')}"],
    [/Security <br \/> SECURE PAYMENT/g, "{t('secureLogin')} <br /> {t('securePayments')}"]
  ],
  'client/src/pages/public/Medicines.jsx': [
    [/import { useState, useMemo, useEffect } from 'react';/, "import { useState, useMemo, useEffect } from 'react';\nimport { useLanguage } from '../../context/LanguageContext';"],
    [/export default function MedicinesListPage\(\) {/, "export default function MedicinesListPage() {\n  const { t } = useLanguage();"],
    [/Search name or brand.../, "{t('searchPlaceholder')}"],
    [/Filters/g, "{t('settingsTitle')}"],
    [/Category/g, "{t('shopCategoryTitleSub')}"],
    [/Price Limit/g, "{t('priceLabel')}"],
    [/Available at Pharmacies/g, "{t('pharmaciesNear')}"],
    [/Availability/g, "{t('statusLabel')}"],
    [/In Stock Only/g, "{t('availableNow')}"],
    [/RESET FILTERS/g, "{t('resetSearch').toUpperCase()}"],
    [/Medicines Found/g, "{t('medicines')} {t('synced')}"],
    [/Most Popular/g, "{t('popularMeds')}"],
    [/Price ↑/g, "{t('priceLabel')} ↑"],
    [/Price ↓/g, "{t('priceLabel')} ↓"],
    [/Rating/g, "{t('rating')}"],
    [/Loading Medicines.../g, "{t('loadingStatus')}"],
    [/No Medicines Found/g, "{t('noMatches')}"],
    [/Reset All Filters/g, "{t('resetSearch')}"]
  ]
};

Object.entries(replacements).forEach(([file, list]) => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file} - not found`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    
    list.forEach(([find, replace]) => {
        content = content.replace(find, replace);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
