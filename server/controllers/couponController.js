const COUPONS = {
  MEDI10: { type: 'percent', value: 10, max: 150, min: 299 },
  WELCOME50: { type: 'flat', value: 50, min: 199 },
  FREEDEL: { type: 'delivery', value: 0, min: 249 }
};

export async function validateCoupon(req, res) {
  const { code, subtotal } = req.body;
  const cleaned = String(code || '').trim().toUpperCase();
  if (!cleaned) return res.status(400).json({ message: 'Coupon code required' });

  const coupon = COUPONS[cleaned];
  if (!coupon) return res.status(404).json({ message: 'Coupon not recognized' });

  const amount = Number(subtotal || 0);
  if (coupon.min && amount < coupon.min) {
    return res.status(400).json({ message: 'Minimum order value not met for this coupon' });
  }

  return res.json({ coupon: { code: cleaned, ...coupon } });
}
