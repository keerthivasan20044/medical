import mongoose from 'mongoose';
import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';

export async function getAllPharmacies(req, res) {
  try {
    const { page = 1, limit = 20, search = '', isOpen, lat, lng } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (isOpen !== undefined) query.isOpen = isOpen === 'true';

    let items;
    if (lat && lng) {
       // Sort by distance (simplified version)
       items = await Pharmacy.find(query);
       items.sort((a, b) => {
         const coordsA = a.address?.coordinates || { lat: 0, lng: 0 };
         const coordsB = b.address?.coordinates || { lat: 0, lng: 0 };
         const distA = Math.sqrt(Math.pow(coordsA.lat - lat, 2) + Math.pow(coordsA.lng - lng, 2));
         const distB = Math.sqrt(Math.pow(coordsB.lat - lat, 2) + Math.pow(coordsB.lng - lng, 2));
         return distA - distB;
       });
       items = items.slice(skip, skip + Number(limit));
    } else {
       items = await Pharmacy.find(query).limit(Number(limit)).skip(Number(skip)).sort('-rating');
    }
    
    const total = await Pharmacy.countDocuments(query);
    res.json({ 
      items, 
      pagination: { total, pages: Math.ceil(total / limit), currentPage: Number(page) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve pharmacies.', error: err.message });
  }
}

export async function getPharmacyById(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Invalid pharmacy identifier.' });
    }
    const item = await Pharmacy.findById(req.params.id).populate('medicines');
    if (!item) return res.status(404).json({ message: 'Pharmacy not found.' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pharmacy details.', error: err.message });
  }
}

export async function getPharmacyMedicines(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Invalid pharmacy identifier.' });
    }
    const items = await Medicine.find({ pharmacyId: req.params.id, isActive: { $ne: false } });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory.', error: err.message });
  }
}

export async function createPharmacy(req, res) {
  try {
    const data = { ...req.body };
    if (req.user) {
      data.pharmacistId = req.user.id;
    }
    data.isVerified = false;
    
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => ({
        url: f.path,
        publicId: f.filename
      }));
      data.image = data.images[0].url;
    }
    const item = await Pharmacy.create(data);
    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create pharmacy.', error: err.message });
  }
}

export async function updatePharmacy(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Invalid pharmacy identifier.' });
    }
    
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });
    
    if (req.user.role !== 'admin' && pharmacy.pharmacistId?.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Permission denied: Ownership mismatch' });
    }

    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => ({
        url: f.path,
        publicId: f.filename
      }));
      data.image = data.images[0].url;
    }
    const item = await Pharmacy.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update pharmacy.', error: err.message });
  }
}

export async function getKaraikalPharmacies(req, res) {
  try {
    const items = await Pharmacy.find({ 'address.city': 'Karaikal' });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve regional pharmacies.', error: err.message });
  }
}
