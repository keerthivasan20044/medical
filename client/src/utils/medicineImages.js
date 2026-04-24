export const medicineImages = {
  'Heart': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=800&auto=format&fit=crop',
  'Antibiotics': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
  'Diabetes': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
  'Pain Relief': 'https://images.unsplash.com/photo-1550572017-ed200f545dec?q=80&w=800&auto=format&fit=crop',
  'Vitamins': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=800&auto=format&fit=crop',
  'default': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'
};

export function getMedicineImage(medicine) {
  if (medicine.image && medicine.image !== '/assets/medicine_default.png') return medicine.image;
  return medicineImages[medicine.category] || medicineImages.default;
}
