import cron from 'node-cron';
import Medicine from '../models/Medicine.js';
import { sendEmail } from '../utils/notify.js';

const DEFAULT_CRON_SCHEDULE = '0 8 * * *';
const EXPIRY_WINDOW_DAYS = Number(process.env.EXPIRY_ALERT_DAYS || 30);

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date).replace(/\//g, '-');
}

function getDaysRemaining(expiryDate, today) {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  const end = new Date(expiryDate);
  end.setHours(0, 0, 0, 0);

  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

function groupByOwner(medicines, today) {
  const grouped = new Map();

  medicines.forEach((medicine) => {
    const pharmacy = medicine.pharmacyId;
    const owner = pharmacy?.owner;
    const email = owner?.email || pharmacy?.email;

    if (!email) return;

    const key = owner?._id ? String(owner._id) : `pharmacy:${pharmacy._id}`;
    const group = grouped.get(key) || {
      email,
      pharmacistName: owner?.name || 'Pharmacist',
      pharmacyNames: new Set(),
      items: []
    };

    group.pharmacyNames.add(pharmacy?.name || 'Pharmacy');
    group.items.push({
      name: medicine.name,
      batchNumber: medicine.batchNumber || 'N/A',
      expiryDate: formatDate(medicine.expiryDate),
      daysRemaining: getDaysRemaining(medicine.expiryDate, today),
      stock: medicine.stock
    });

    grouped.set(key, group);
  });

  return grouped;
}

function buildEmailBody(group) {
  const pharmacyList = [...group.pharmacyNames].join(', ');
  const rows = group.items
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .map((item, index) => (
      `${index + 1}. ${item.name}
   Batch Number: ${item.batchNumber}
   Expiry Date: ${item.expiryDate} (${item.daysRemaining} days remaining)
   Current Stock Quantity: ${item.stock}`
    ))
    .join('\n\n');

  return `Dear ${group.pharmacistName},

The following medicines in ${pharmacyList} will expire within the next ${EXPIRY_WINDOW_DAYS} days:

${rows}

Please review this stock for restocking, return, or safe disposal action.

Regards,
MediReach Inventory Alerts`;
}

export async function runExpiryAlertJob() {
  const today = new Date();
  const expiryStart = startOfDay(today);
  const expiryLimit = endOfDay(addDays(today, EXPIRY_WINDOW_DAYS));

  const expiringMedicines = await Medicine.find({
    expiryDate: { $gte: expiryStart, $lte: expiryLimit },
    isActive: { $ne: false },
    stock: { $gt: 0 }
  })
    .populate({
      path: 'pharmacyId',
      select: 'name email owner',
      populate: {
        path: 'owner',
        select: 'name email role isActive'
      }
    })
    .lean();

  const groupedAlerts = groupByOwner(
    expiringMedicines.filter((medicine) => medicine.pharmacyId),
    today
  );

  for (const group of groupedAlerts.values()) {
    await sendEmail(
      group.email,
      `Medicine Expiry Alert: ${group.items.length} item(s) expiring soon`,
      buildEmailBody(group)
    );
  }

  console.log(`[ExpiryAlertJob] Processed ${expiringMedicines.length} medicine(s), sent ${groupedAlerts.size} alert email(s).`);
}

export function scheduleExpiryAlertJob() {
  const schedule = process.env.CRON_SCHEDULE || DEFAULT_CRON_SCHEDULE;
  const options = process.env.CRON_TIMEZONE ? { timezone: process.env.CRON_TIMEZONE } : undefined;

  if (!cron.validate(schedule)) {
    console.warn(`[ExpiryAlertJob] Invalid CRON_SCHEDULE "${schedule}". Expiry alert job was not scheduled.`);
    return null;
  }

  try {
    return cron.schedule(schedule, () => {
      runExpiryAlertJob().catch((err) => {
        console.error('[ExpiryAlertJob] Failed:', err);
      });
    }, options);
  } catch (err) {
    console.warn(`[ExpiryAlertJob] Could not schedule expiry alert job: ${err.message}`);
    return null;
  }
}
