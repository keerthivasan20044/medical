import axios from 'axios';
import Pharmacy from '../models/Pharmacy.js';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

/**
 * Fetch and cache pharmacy photos from Google Places API
 */
export const syncPharmacyPhotos = async (pharmacyId) => {
  try {
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) return null;

    // Skip if recently fetched (cache for 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (pharmacy.photoFetchedAt && pharmacy.photoFetchedAt > thirtyDaysAgo && pharmacy.photos?.length > 0) {
      return pharmacy.photos;
    }

    console.log(`[GooglePlaces] Syncing photos for: ${pharmacy.name}`);

    // 1. Search for the place to get place_id if not present
    let placeId = pharmacy.googlePlaceId;
    if (!placeId) {
      const searchRes = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, {
        params: {
          input: `${pharmacy.name} ${pharmacy.city}`,
          inputtype: 'textquery',
          fields: 'place_id',
          key: GOOGLE_MAPS_API_KEY
        }
      });
      placeId = searchRes.data.candidates?.[0]?.place_id;
    }

    if (!placeId) {
      console.warn(`[GooglePlaces] No placeId found for ${pharmacy.name}`);
      return null;
    }

    // 2. Get Place Details for photos
    const detailRes = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: placeId,
        fields: 'photos',
        key: GOOGLE_MAPS_API_KEY
      }
    });

    const photoRefs = detailRes.data.result?.photos?.slice(0, 5) || [];
    const photoUrls = photoRefs.map(p => 
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${p.photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
    );

    // 3. Update Pharmacy Record
    pharmacy.googlePlaceId = placeId;
    pharmacy.photos = photoUrls;
    pharmacy.mainPhoto = photoUrls[0] || pharmacy.mainPhoto;
    pharmacy.photoFetchedAt = new Date();
    await pharmacy.save();

    return photoUrls;
  } catch (err) {
    console.error('[GooglePlaces] Sync Error:', err.message);
    return null;
  }
};
