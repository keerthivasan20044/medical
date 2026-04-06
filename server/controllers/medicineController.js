import Medicine from '../models/Medicine.js';

export async function getAllMedicines(req, res) {
  try {
    const { q, category, requiresPrescription, isVaccine, page = 1, limit = 20 } = req.query;
    const query = {};
    if (q) query.name = { $regex: q, $options: 'i' };
    if (category) query.category = category;
    if (requiresPrescription !== undefined) query.requiresPrescription = requiresPrescription === 'true';
    if (isVaccine !== undefined) query.isVaccine = isVaccine === 'true';

    const [items, total] = await Promise.all([
      Medicine.find(query)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort('name'),
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
    const item = await Medicine.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Medicine SKU not found.' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving inventory data.', error: err.message });
  }
}

export async function createMedicine(req, res) {
  const item = await Medicine.create(req.body);
  res.status(201).json({ item });
}

export async function updateMedicine(req, res) {
  const item = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ item });
}

export async function deleteMedicine(req, res) {
  await Medicine.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}

export async function getMedicinesByCategory(req, res) {
  const items = await Medicine.find({ category: req.params.cat });
  res.json({ items });
}

export async function getSearchSuggestions(req, res) {
  const { q } = req.query;
  if (!q) return res.json({ suggestions: [] });
  const suggestions = await Medicine.find({ name: { $regex: q, $options: 'i' } })
    .select('name _id category')
    .limit(5);
  res.json({ suggestions });
}
