/**
 * fetchAllPharmacyPhotos.js
 * Run once to seed Google Places photos for every pharmacy in the DB.
 *
 * Usage:
 *   node server/scripts/fetchAllPharmacyPhotos.js
 *   node server/scripts/fetchAllPharmacyPhotos.js --force   (re-fetch even cached)
 *   node server/scripts/fetchAllPharmacyPhotos.js --dry-run (no writes, just log)
 *
 * Prerequisites: GOOGLE_PLACES_API_KEY in server/.env
 */

import '../config/env.js';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Pharmacy from '../models/Pharmacy.js';
import { fetchPhotosForPharmacy } from '../controllers/pharmacyPhotoController.js';

const DELAY_MS = 350;          // Respect Google's rate limit (< 3 req/sec)
const CACHE_DAYS = 30;
const FORCE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const isStale = (pharmacy) => {
  if (FORCE) return true;
  if (!pharmacy.photos?.length || !pharmacy.photoFetchedAt) return true;
  const ageMs = Date.now() - new Date(pharmacy.photoFetchedAt).getTime();
  return ageMs > CACHE_DAYS * 24 * 60 * 60 * 1000;
};

async function run() {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.error('❌  GOOGLE_PLACES_API_KEY is not set. Add it to server/.env');
    process.exit(1);
  }

  await connectDB();
  const pharmacies = await Pharmacy.find({});
  console.log(`\n🔍  Found ${pharmacies.length} pharmacies in DB.\n`);

  let success = 0, skipped = 0, failed = 0;

  for (let i = 0; i < pharmacies.length; i++) {
    const p = pharmacies[i];
    const prefix = `[${String(i + 1).padStart(2, '0')}/${pharmacies.length}] ${p.name}`;

    if (!isStale(p)) {
      console.log(`⏭   ${prefix} — cached, skipping`);
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`🔎  ${prefix} — would fetch (dry-run)`);
      skipped++;
      continue;
    }

    try {
      const result = await fetchPhotosForPharmacy(p);
      if (result.isFallback) {
        console.log(`⚠️   ${prefix} — no Google listing, fallback assigned`);
      } else {
        console.log(`✅  ${prefix} — ${result.photos.length} photo(s) fetched`);
      }
      success++;
    } catch (err) {
      console.error(`❌  ${prefix} — ERROR: ${err.message}`);
      failed++;
    }

    await delay(DELAY_MS);
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅  Success:  ${success}`);
  console.log(`⏭   Skipped:  ${skipped}`);
  console.log(`❌  Failed:   ${failed}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
