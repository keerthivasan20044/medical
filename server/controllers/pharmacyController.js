import Pharmacy from '../models/Pharmacy.js';

export async function getAllPharmacies(req, res) {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const skip = (page - 1) * limit;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    
    const [items, total] = await Promise.all([
      Pharmacy.find(query).limit(Number(limit)).skip(Number(skip)).sort('-rating'),
      Pharmacy.countDocuments(query)
    ]);
    res.json({ 
      items, 
      pagination: { total, pages: Math.ceil(total / limit), currentPage: page }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve pharmacy nodes.', error: err.message });
  }
}

export async function getPharmacyById(req, res) {
  try {
    const item = await Pharmacy.findById(req.params.id).populate('medicines');
    if (!item) return res.status(404).json({ message: 'Pharmacy node not found.' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Error establishing connection to node.', error: err.message });
  }
}

export async function getPharmacyMedicines(req, res) {
  try {
    const item = await Pharmacy.findById(req.params.id).populate('medicines');
    if (!item) return res.status(404).json({ message: 'Node offline or not found.' });
    res.json({ items: item?.medicines || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch node inventory.', error: err.message });
  }
}

export async function createPharmacy(req, res) {
  const item = await Pharmacy.create(req.body);
  res.status(201).json({ item });
}

export async function updatePharmacy(req, res) {
  const item = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ item });
}

export async function getKaraikalPharmacies(req, res) {
  const items = await Pharmacy.find({ 'address.city': 'Karaikal' });
  res.json({ items });
}
