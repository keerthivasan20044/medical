export function formatCurrency(value) {
  const amount = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(value) {
  const amount = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('en-IN').format(amount);
}
