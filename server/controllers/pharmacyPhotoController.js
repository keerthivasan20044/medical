import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import Pharmacy from '../models/Pharmacy.js';

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PHOTO_CACHE_DAYS = 30;

// ── Curated fallback pool (10 Unsplash pharmacy/medical store photos) ─────────
// Used when Google Places finds no listing for a local pharmacy.
// Each has a distinct look so pharmacies don't all appear identical.
const FALLBACK_POOL = [
  'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80', // pharmacy interior
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80', // medicine shelves
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80', // pharmacy counter
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80', // drugstore exterior
  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=80', // medical shop
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', // chemist shelves
  'https://images.unsplash.com/photo-1612776572997-76cc42e058c3?w=800&q=80', // pharmacist
  'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80', // pill bottles
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80', // store exterior
  'https://images.unsplash.com/photo-1628363602988-4afbe3573b33?w=800&q=80', // indian medical
];

const pickFallback = (pharmacyId) => {
  // Deterministic pick so the same pharmacy always shows the same fallback
  const idx = pharmacyId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % FALLBACK_POOL.length;
  return FALLBACK_POOL[idx];
};

// ── Cache a Google photo URL on Cloudinary for permanence ─────────────────────
const cacheOnCloudinary = async (googlePhotoUrl, pharmacyName) => {
  try {
    const safeName = pharmacyName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const result = await cloudinary.uploader.upload(googlePhotoUrl, {
      folder: 'medireach/pharmacies',
      public_id: `${safeName}_${Date.now()}`,
      overwrite: false,
      resource_type: 'image',
    });
    return result.secure_url;
  } catch {
    // If Cloudinary upload fails, fall back to the original Google URL
    return googlePhotoUrl;
  }
};

// ── Build a Google Places photo URL from a photo_reference ────────────────────
const buildPhotoUrl = (ref, maxwidth = 800) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photoreference=${ref}&key=${PLACES_API_KEY}`;

// ── Search Google Places for a pharmacy and return photo refs ─────────────────
const searchGooglePlaces = async (query) => {
  const url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const res = await axios.get(url, {
    params: { query, key: PLACES_API_KEY, type: 'pharmacy' },
    timeout: 8000,
  });
  return res.data.results || [];
};

// ── Verify the result is in the correct city ──────────────────────────────────
const resultMatchesCity = (result, expectedCity) => {
  const addr = (result.formatted_address || '').toLowerCase();
  return addr.includes(expectedCity.toLowerCase());
};

// ── Core photo-fetch logic (used by both single and bulk endpoints) ────────────
export const fetchPhotosForPharmacy = async (pharmacy) => {
  const city = pharmacy.address?.city || 'Karaikal';
  const state = pharmacy.address?.state || 'Puducherry';
  const query = `${pharmacy.name} ${city} ${state}`;

  let results = await searchGooglePlaces(query);

  // Filter to results in the correct city
  let matched = results.filter((r) => resultMatchesCity(r, city));

  // If city-specific search yields nothing, try broader query
  if (!matched.length && results.length) {
    const broaderQuery = pharmacy.name;
    const broaderResults = await searchGooglePlaces(broaderQuery);
    matched = broaderResults.filter((r) => resultMatchesCity(r, city));
  }

  const best = matched[0];

  if (!best || !best.photos?.length) {
    // No Google result — assign deterministic fallback
    const fallback = pickFallback(pharmacy._id.toString());
    pharmacy.mainPhoto = fallback;
    pharmacy.photos = [fallback];
    pharmacy.isFallback = true;
    pharmacy.photoFetchedAt = new Date();
    await pharmacy.save();
    return { photos: [fallback], isFallback: true };
  }

  // Store the Google Place ID
  pharmacy.googlePlaceId = best.place_id;

  // Fetch up to 5 photos — cache each on Cloudinary for permanence
  const photoRefs = best.photos.slice(0, 5);
  const photoUrls = await Promise.all(
    photoRefs.map(async (p) => {
      const googleUrl = buildPhotoUrl(p.photo_reference, 800);
      return cacheOnCloudinary(googleUrl, pharmacy.name);
    })
  );

  pharmacy.photos = photoUrls;
  pharmacy.mainPhoto = photoUrls[0];
  pharmacy.isFallback = false;
  pharmacy.photoFetchedAt = new Date();
  await pharmacy.save();

  return { photos: photoUrls, placeId: best.place_id, isFallback: false };
};

// ── POST /api/pharmacies/:id/fetch-photo ──────────────────────────────────────
export const fetchPharmacyPhoto = async (req, res) => {
  try {
    if (!PLACES_API_KEY) {
      return res.status(503).json({ message: 'GOOGLE_PLACES_API_KEY not configured on server.' });
    }

    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found.' });

    // Return cached photos if fresh (< 30 days old)
    if (
      pharmacy.photos?.length &&
      pharmacy.photoFetchedAt &&
      Date.now() - pharmacy.photoFetchedAt.getTime() < PHOTO_CACHE_DAYS * 24 * 60 * 60 * 1000
    ) {
      return res.json({
        photos: pharmacy.photos,
        mainPhoto: pharmacy.mainPhoto,
        isFallback: pharmacy.isFallback,
        cached: true,
      });
    }

    const result = await fetchPhotosForPharmacy(pharmacy);
    res.json({ ...result, mainPhoto: result.photos[0], cached: false });
  } catch (err) {
    console.error('[PhotoFetch] Error:', err.message);
    res.status(500).json({ message: 'Photo fetch failed.', error: err.message });
  }
};

// ── PUT /api/pharmacies/:id/set-main-photo ────────────────────────────────────
export const setMainPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) return res.status(400).json({ message: 'photoUrl is required.' });
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { mainPhoto: photoUrl },
      { new: true }
    );
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found.' });
    res.json({ mainPhoto: pharmacy.mainPhoto });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/pharmacies/:id/photos ─────────────────────────────────────────
export const deletePhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found.' });

    pharmacy.photos = (pharmacy.photos || []).filter((p) => p !== photoUrl);
    pharmacy.customPhotos = (pharmacy.customPhotos || []).filter((p) => p !== photoUrl);
    if (pharmacy.mainPhoto === photoUrl) {
      pharmacy.mainPhoto = pharmacy.customPhotos[0] || pharmacy.photos[0] || null;
    }
    await pharmacy.save();
    res.json({ photos: pharmacy.photos, customPhotos: pharmacy.customPhotos, mainPhoto: pharmacy.mainPhoto });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
