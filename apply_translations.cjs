const fs = require('fs');
const path = require('path');

const replacements = {
  'client/src/pages/customer/Orders.jsx': [
    [/<h1 className="text-2xl md:text-4xl font-bold text-slate-900">My Orders<\/h1>/, "{t('myOrdersTitle')}"],
    [/<p className="text-sm text-slate-400 mt-1">Track and manage your orders<\/p>/, "{t('trackManageOrders')}"],
    [/placeholder="Search by order ID or pharmacy..."/, "placeholder={t('searchOrdersPlaceholder')}"],
    [/Protocol ID/g, "{t('protocolId')}"],
    [/Sync Date/g, "{t('syncDate')}"],
    [/Source Node/g, "{t('sourceNode')}"],
    [/Payload Meta/g, "{t('payloadMeta')}"],
    [/{o.items\?.length || 1} Categories/g, "{t('modulesCount', { count: o.items?.length || 1 })}"],
    [/Transmission Timeline/g, "{t('transmissionTimeline')}"],
    [/Track Link/g, "{t('trackLink')}"],
    [/Invert Invoice/g, "{t('invertInvoice')}"],
    [/Null Enclave Detected/g, "{t('nullEnclaveDetected')}"],
    [/No {activeTab.toLowerCase()} logistics synchronizations found in the clinical registry./, "{t('noLogisticsFound', { status: activeTab.toLowerCase() })}"],
    [/Initialize Procurement/g, "{t('initializeProcurement')}"]
  ],
  'client/src/pages/customer/Checkout.jsx': [
    [/Estimated Delivery:/g, "{t('estimatedDelivery')}:"],
    [/Item List/g, "{t('itemList')}"],
    [/{items.length} Modules/g, "{t('modulesCount', { count: items.length })}"],
    [/<span>Qty: {i.qty}<\/span>/, "<span>{t('qtyCount', { qty: i.qty })}</span>"],
    [/<span>Subtotal<\/span>/, "<span>{t('subtotal')}</span>"],
    [/<span>Delivery Fee<\/span>/, "<span>{t('deliveryFee')}</span>"],
    [/<span>Discount<\/span>/, "<span>{t('discount')}</span>"],
    [/Grand Total/g, "{t('grandTotal')}"],
    [/Delivery Address/g, "{t('deliveryAddress')}"],
    [/Payment Method/g, "{t('paymentMethod')}"],
    [/'PROCESSING...'/g, "t('processing')"],
    [/'PAY NOW'/g, "t('payNow')"],
    [/Secure 256-bit AES Encryption Node/g, "{t('secureEncryption')}"],
    [/Back to Cart/g, "{t('backToCart')}"]
  ],
  'client/src/pages/public/Login.jsx': [
    [/label="Email Address"/, "label={t('emailAddress')}"],
    [/label="Password"/, "label={t('password')}"],
    [/Remember Me/g, "{t('rememberMe')}"],
    [/Forgot Password\?/g, "{t('forgotPassword')}"],
    [/OR LOGIN WITH/g, "{t('orLoginWith')}"],
    [/New here\?/g, "{t('newHere')}"],
    [/Create Account &rarr;/g, "{t('createAccount')} &rarr;"],
    [/Continue browsing without an account/g, "{t('continueBrowsing')}"],
    [/Demo Accounts/g, "{t('demoAccounts')}"]
  ]
};

Object.entries(replacements).forEach(([file, list]) => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    list.forEach(([find, replace]) => {
        content = content.replace(find, replace);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
});
