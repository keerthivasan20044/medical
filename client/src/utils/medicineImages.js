import {
  getMedicineImage as getMappedMedicineImage,
  getMedicineVisualType as getMappedMedicineVisualType
} from '../data/medicineImages';

export const medicineImages = {
  default: '/assets/medicine_default.png',
};

export function resolveMedicineImageSource(image) {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.url || image.src || image.path || null;
}

export function getMedicineImage(medicine) {
  const image = resolveMedicineImageSource(medicine?.image) || resolveMedicineImageSource(medicine?.images?.[0]);
  const isPlaceholder = !image || image === '/assets/medicine_default.png';

  if (!isPlaceholder) return image;

  return getMappedMedicineImage(medicine?.name, medicine?.category);
}

export function getMedicineVisualType(medicine) {
  return getMappedMedicineVisualType(medicine?.name, medicine?.category);
}
