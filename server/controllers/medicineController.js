import Medicine from '../models/Medicine.js';

export async function getAllMedicines(req, res) {
  try {
    const { 
      q, category, pharmacyId, minPrice, maxPrice, 
      requiresPrescription, sort, page = 1, limit = 20 
    } = req.query;
    
    const query = {};
    if (q) query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } }
    ];
    if (category) query.category = category;
    if (pharmacyId) query.pharmacyId = pharmacyId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (requiresPrescription !== undefined) query.requiresPrescription = requiresPrescription === 'true';

    let sortOption = 'name';
    if (sort === 'price_asc') sortOption = 'price';
    if (sort === 'price_desc') sortOption = '-price';
    if (sort === 'popularity') sortOption = '-rating'; // Using rating as popularity proxy

    const [items, total] = await Promise.all([
      Medicine.find(query)
        .populate('pharmacyId', 'name address phone')
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort(sortOption),
      Medicine.countDocuments(query)
    ]);

    res.json({ 
      items, 
      pagination: { total, pages: Math.ceil(total / limit), currentPage: Number(page) }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to synchronize medicine catalog.', error: err.message });
  }
}

export async function getMedicineById(req, res) {
  try {
    const item = await Medicine.findById(req.params.id).populate('pharmacyId');
    if (!item) return res.status(404).json({ message: 'Medicine SKU not found.' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving inventory data.', error: err.message });
  }
}

export async function createMedicine(req, res) {
  try {
    const data = { ...req.body };
    // Attach pharmacist/admin ID
    if (req.user) {
      data.pharmacistId = req.user.id;
    }
    
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => ({
        url: f.path,
        publicId: f.filename
      }));
      data.image = data.images[0].url; // Flatten for legacy support
    }
    const item = await Medicine.create(data);
    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create medicine.', error: err.message });
  }
}

export async function updateMedicine(req, res) {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => ({
        url: f.path,
        publicId: f.filename
      }));
      data.image = data.images[0].url;
    }
    
    // Ownership check (simplified)
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    
    if (req.user.role !== 'admin' && medicine.pharmacistId?.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Permission denied: Ownership mismatch' });
    }

    const item = await Medicine.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update medicine.', error: err.message });
  }
}

export async function deleteMedicine(req, res) {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    
    if (req.user.role !== 'admin' && medicine.pharmacistId?.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Permission denied: Ownership mismatch' });
    }

    await Medicine.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ ok: true, message: 'Medicine deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
}

export async function getMedicinesByCategory(req, res) {
  const items = await Medicine.find({ category: req.params.cat, isActive: { $ne: false } });
  res.json({ items });
}

export async function getSearchSuggestions(req, res) {
  const { q } = req.query;
  if (!q) return res.json({ suggestions: [] });
  const suggestions = await Medicine.find({ 
    name: { $regex: q, $options: 'i' },
    isActive: { $ne: false }
  })
    .select('name _id category')
    .limit(5);
  res.json({ suggestions });
}
