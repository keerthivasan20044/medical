/**
 * Safe targeted replacements for Orders.jsx - using EXACT string matching only
 * No global regex - each replacement targets a unique string in the file.
 */
const fs = require('fs');
const path = require('path');

function safeReplace(content, find, replace, label) {
  if (!content.includes(find)) {
    console.log(`  WARN [${label}]: target string not found`);
    return content;
  }
  const count = content.split(find).length - 1;
  if (count > 1) {
    console.log(`  WARN [${label}]: found ${count} occurrences, replacing first only`);
  }
  return content.replace(find, replace);
}

// Orders.jsx translations
const ordersPath = path.join(__dirname, 'client/src/pages/customer/Orders.jsx');
let orders = fs.readFileSync(ordersPath, 'utf8');

orders = safeReplace(orders,
  `<h1 className="text-2xl md:text-4xl font-bold text-slate-900">My Orders</h1>`,
  `<h1 className="text-2xl md:text-4xl font-bold text-slate-900">{t('myOrdersTitle')}</h1>`,
  'myOrdersTitle'
);

orders = safeReplace(orders,
  `<p className="text-sm text-slate-400 mt-1">Track and manage your orders</p>`,
  `<p className="text-sm text-slate-400 mt-1">{t('trackManageOrders')}</p>`,
  'trackManageOrders'
);

orders = safeReplace(orders,
  `placeholder="Search by order ID or pharmacy..."`,
  `placeholder={t('searchOrdersPlaceholder')}`,
  'searchOrdersPlaceholder'
);

orders = safeReplace(orders,
  `<div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Protocol ID</div>`,
  `<div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{t('protocolId')}</div>`,
  'protocolId'
);

orders = safeReplace(orders,
  `<div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Sync Date</div>`,
  `<div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{t('syncDate')}</div>`,
  'syncDate'
);

orders = safeReplace(orders,
  `<div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Source Node</div>`,
  `<div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">{t('sourceNode')}</div>`,
  'sourceNode'
);

orders = safeReplace(orders,
  `<div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Payload Meta</div>`,
  `<div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">{t('payloadMeta')}</div>`,
  'payloadMeta'
);

orders = safeReplace(orders,
  `{o.items?.length || 1} Categories`,
  `{t('modulesCount', { count: o.items?.length || 1 })}`,
  'modulesCount'
);

orders = safeReplace(orders,
  `<span className="text-[10px] font-black text-[#0a1628] uppercase italic tracking-[0.2em]">Transmission Timeline</span>`,
  `<span className="text-[10px] font-black text-[#0a1628] uppercase italic tracking-[0.2em]">{t('transmissionTimeline')}</span>`,
  'transmissionTimeline'
);

orders = safeReplace(orders,
  `<Truck size={18}/> Track Link`,
  `<Truck size={18}/> {t('trackLink')}`,
  'trackLink'
);

orders = safeReplace(orders,
  `<Download size={18}/> Invert Invoice`,
  `<Download size={18}/> {t('invertInvoice')}`,
  'invertInvoice'
);

orders = safeReplace(orders,
  `<h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">Null Enclave Detected</h3>`,
  `<h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">{t('nullEnclaveDetected')}</h3>`,
  'nullEnclaveDetected'
);

orders = safeReplace(orders,
  `No {activeTab.toLowerCase()} logistics synchronizations found in the clinical registry.`,
  `{t('noLogisticsFound', { status: activeTab.toLowerCase() })}`,
  'noLogisticsFound'
);

orders = safeReplace(orders,
  `Initialize Procurement &rarr;`,
  `{t('initializeProcurement')} &rarr;`,
  'initializeProcurement'
);

fs.writeFileSync(ordersPath, orders, 'utf8');
console.log('Orders.jsx translations applied successfully.');
