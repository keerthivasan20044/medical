const IMAGE = {
  tablet: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=900&auto=format&fit=crop',
  capsules: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=900&auto=format&fit=crop',
  blister: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=900&auto=format&fit=crop',
  syrup: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=900&auto=format&fit=crop',
  drops: 'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=900&auto=format&fit=crop',
  cream: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=900&auto=format&fit=crop',
  device: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=900&auto=format&fit=crop',
  vaccine: 'https://images.unsplash.com/photo-1618015358954-344302f421a4?q=80&w=900&auto=format&fit=crop',
  injection: 'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=900&auto=format&fit=crop',
  wellness: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=900&auto=format&fit=crop',
  ayurvedic: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=900&auto=format&fit=crop',
  firstAid: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=900&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=900&auto=format&fit=crop',
};

const IMAGE_SETS = {
  tablet: [
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?q=80&w=900&auto=format&fit=crop'
  ],
  capsules: [
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550572017-edb724584620?q=80&w=900&auto=format&fit=crop'
  ],
  syrup: [
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584017442709-df8775f53e07?q=80&w=900&auto=format&fit=crop'
  ],
  drops: [
    'https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=900&auto=format&fit=crop'
  ],
  cream: [
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556229167-731388839088?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=900&auto=format&fit=crop'
  ],
  device: [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=900&auto=format&fit=crop'
  ],
  vaccine: [
    'https://images.unsplash.com/photo-1618015358954-344302f421a4?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=900&auto=format&fit=crop'
  ],
  injection: [
    'https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=900&auto=format&fit=crop'
  ],
  wellness: [
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584017442709-df8775f53e07?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550572017-edb724584620?q=80&w=900&auto=format&fit=crop'
  ],
  ayurvedic: [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551001734-d4f1e1279d2d?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=900&auto=format&fit=crop'
  ],
  firstAid: [
    'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=900&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=900&auto=format&fit=crop'
  ]
};

const DIRECT_IMAGE_MATCHES = [
  { terms: ['paracetamol', 'dolo', 'combiflam', 'ibuprofen', 'naproxen'], image: IMAGE_SETS.tablet[0] },
  { terms: ['amoxicillin', 'omeprazole', 'loperamide'], image: IMAGE_SETS.capsules[0] },
  { terms: ['azithromycin', 'cetirizine', 'metformin', 'amlodipine', 'atorvastatin'], image: IMAGE_SETS.tablet[2] },
  { terms: ['cough syrup', 'benadryl', 'ambroxol', 'digene', 'oral drops'], image: IMAGE_SETS.syrup[1] },
  { terms: ['eye drops', 'ear drops'], image: IMAGE_SETS.drops[1] },
  { terms: ['insulin', 'syringe', 'injection', 'nebules'], image: IMAGE_SETS.injection[2] },
  { terms: ['thermometer', 'bp monitor', 'oximeter', 'glucometer', 'pregnancy test'], image: IMAGE_SETS.device[0] },
  { terms: ['betadine', 'bandage', 'antiseptic', 'mask', 'sanitizer'], image: IMAGE_SETS.firstAid[1] },
  { terms: ['clotrimazole', 'mupirocin', 'sunscreen', 'gel', 'ointment'], image: IMAGE_SETS.cream[0] },
  { terms: ['vitamin', 'zincovit', 'calcium', 'protein', 'multivitamin', 'supradyn'], image: IMAGE_SETS.wellness[1] },
  { terms: ['himalaya', 'hajmola', 'ayurvedic', 'herbal', 'koflet'], image: IMAGE_SETS.ayurvedic[1] },
  { terms: ['sanitary', 'baby'], image: IMAGE_SETS.wellness[2] },
  { terms: ['vaccine', 'covishield'], image: IMAGE_SETS.vaccine[0] }
];

const contains = (value, terms) => terms.some((term) => value.includes(term));
const hashText = (value) => [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);

export const getMedicineVisualType = (name = '', category = '') => {
  const text = `${name} ${category}`.toLowerCase().replace(/\+/g, ' plus ');

  if (contains(text, ['vaccine', 'immunization', 'vaccination'])) return 'vaccine';
  if (contains(text, ['injection', 'injectable', 'syringe', 'insulin penfill', 'insulin', 'nebules'])) return 'injection';
  if (contains(text, ['drops', 'oral drops', 'eye drops', 'ear drops', 'nasal drops'])) return 'drops';
  if (contains(text, ['syrup', 'liquid', 'suspension', 'tonic'])) return 'syrup';
  if (contains(text, ['cream', 'gel', 'ointment', 'lotion', 'sunscreen', 'skin care', 'clotrimazole'])) return 'cream';
  if (contains(text, ['thermometer', 'bp monitor', 'pulse oximeter', 'glucometer', 'pregnancy test', 'device'])) return 'device';
  if (contains(text, ['bandage', 'mask', 'sanitizer', 'antiseptic', 'first aid'])) return 'firstAid';
  if (contains(text, ['protein powder', 'nutrition', 'vitamin', 'calcium', 'wellness', 'multivitamin', 'supplement'])) return 'wellness';
  if (contains(text, ['ayurvedic', 'herbal', 'hajmola'])) return 'ayurvedic';
  if (contains(text, ['capsule', 'capsules', 'amoxicillin', 'omeprazole', 'loperamide'])) return 'capsules';
  if (contains(text, ['tablet', 'tablets', 'tab ', 'mg', 'mcg', 'antibiotic', 'heart', 'diabetes', 'allergy', 'fever', 'pain', 'stomach'])) return 'tablet';

  return 'tablet';
};

export const getMedicineImage = (name = '', category = '') => {
  const text = `${name} ${category}`.toLowerCase().replace(/\+/g, ' plus ');
  const direct = DIRECT_IMAGE_MATCHES.find((item) => contains(text, item.terms));
  if (direct) return direct.image;

  const type = getMedicineVisualType(name, category);
  const set = IMAGE_SETS[type] || [IMAGE[type] || IMAGE.default];
  return set[hashText(text) % set.length];
};

export const medicineImages = IMAGE;
