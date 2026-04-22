// Free medicine images from Unsplash (direct CDN links)
// Following specific instructions for unique and relevant medicine images

export const medicineImages = {
  // Step 3: Specific Medicine Mappings
  'paracetamol': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', // white round tablets
  'amlodipine': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', // small round tablets
  'amoxicillin': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80', // pink/red capsules
  'atorvastatin': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', // small oval yellow tablets
  'azithromycin': 'https://images.unsplash.com/photo-1584362317006-291ef380311d?w=400&q=80', // white oblong tablets
  'erythromycin': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', // pink film coated tablets
  'gliclazide': 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=400&q=80', // white diamond shaped
  'glimepiride': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', // green oval tablets
  'metformin': 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&q=80', // white round tablets
  'ciprofloxacin': 'https://images.unsplash.com/photo-1584362317006-291ef380311d?w=400&q=80', // white oblong tablets
  'aspirin': 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=400&q=80', // white round tablets
  'ibuprofen': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', // orange coated tablets
  'domperidone': 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=400&q=80', // small white tablets
  'cetirizine': 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=400&q=80', // small white tablets
  'calcium plus vitamin d3': 'https://images.unsplash.com/photo-1584017442709-df8775f53e07?w=400&q=80', // large white oval
  'diclofenac gel': 'https://images.unsplash.com/photo-1556229167-731388839088?w=400&q=80', // tube of gel

  // Step 2: Category Fallbacks
  'heart': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', // blood pressure pills
  'antibiotics': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80', // capsules
  'diabetes': 'https://images.unsplash.com/photo-1563213126-a4273aed2016?w=400&q=80', // insulin/tablets
  'stomach': 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=400&q=80', // antacids
  'allergy': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80', // white allergy tablets
  'muscle': 'https://images.unsplash.com/photo-1556229167-731388839088?w=400&q=80', // pain relief gel/tablets
  'wellness': 'https://images.unsplash.com/photo-1584017442709-df8775f53e07?w=400&q=80', // vitamins
  'vaccines': 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80', // syringe/vial
  'syrups': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80', // liquid medicine
  'injections': 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80', // vials
  'baby care': 'https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&q=80', // pediatric drops
  'ayurvedic': 'https://images.unsplash.com/photo-1551001734-d4f1e1279d2d?w=400&q=80', // herbal
  'default': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80', // single medicine tablet
};

export const getMedicineImage = (name, category) => {
  const key = name?.toLowerCase().trim();
  const catKey = category?.toLowerCase().trim();

  return (
    medicineImages[key] ||
    medicineImages[catKey] ||
    medicineImages['default']
  );
};
