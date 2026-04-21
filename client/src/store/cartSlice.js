import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';
import { loadState } from '../utils/storage.js';

const COUPONS = {
  MEDI10: { type: 'percent', value: 10, max: 150, min: 299 },
  WELCOME50: { type: 'flat', value: 50, min: 199 },
  FREEDEL: { type: 'delivery', value: 0, min: 249 }
};

const TAX_RATE = 0.05;
const BASE_DELIVERY_FEE = 30;
const FREE_DELIVERY_THRESHOLD = 500;
const PACKAGING_FEE = 9;

const defaultState = {
  items: [],
  totalQty: 0,
  subtotal: 0,
  deliveryFee: 0,
  packagingFee: 0,
  tax: 0,
  discount: 0,
  tip: 0,
  totalAmount: 0,
  coupon: null,
  couponError: null,
  couponStatus: 'idle',
  note: '',
  prescription: null // { file, status, url }
};

function calcDiscount(subtotal, deliveryFee, coupon) {
  if (!coupon) return 0;
  if (coupon.type === 'percent') {
    const raw = Math.round((subtotal * coupon.value) / 100);
    return coupon.max ? Math.min(raw, coupon.max) : raw;
  }
  if (coupon.type === 'flat') {
    return Math.min(subtotal, coupon.value);
  }
  if (coupon.type === 'delivery') {
    return deliveryFee;
  }
  return 0;
}

function recalc(state) {
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  state.subtotal = subtotal;
  state.totalQty = state.items.reduce((sum, item) => sum + item.qty, 0);

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : BASE_DELIVERY_FEE;
  const packagingFee = subtotal === 0 ? 0 : PACKAGING_FEE;
  state.deliveryFee = deliveryFee;
  state.packagingFee = packagingFee;

  const discount = calcDiscount(subtotal, deliveryFee, state.coupon);
  state.discount = discount;

  const taxable = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxable * TAX_RATE);
  state.tax = tax;

  const total = Math.max(0, taxable + deliveryFee + packagingFee + tax + (state.tip || 0));
  state.totalAmount = total;
}

const persisted = loadState('medireach_cart_v1');
const initialState = {
  ...defaultState,
  items: Array.isArray(persisted?.items) ? persisted.items : defaultState.items,
  coupon: persisted?.coupon || null,
  tip: Number.isFinite(persisted?.tip) ? persisted.tip : defaultState.tip,
  note: typeof persisted?.note === 'string' ? persisted.note : defaultState.note
};
recalc(initialState);

export const validateCoupon = createAsyncThunk(
  'cart/validateCoupon',
  async ({ code, subtotal }, thunkAPI) => {
    const cleaned = (code || '').trim().toUpperCase();
    if (!cleaned) {
      return thunkAPI.rejectWithValue('Enter a coupon code.');
    }
    try {
      const res = await api.post('/api/coupons/validate', { code: cleaned, subtotal });
      return res.data.coupon;
    } catch (e) {
      const message = e.response?.data?.message || 'Coupon validation failed.';
      const local = COUPONS[cleaned];
      if (!local) return thunkAPI.rejectWithValue(message);
      if (local.min && subtotal < local.min) {
        return thunkAPI.rejectWithValue('Minimum order value not met for this coupon.');
      }
      return { code: cleaned, ...local, fallback: true };
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { _id, id, qty = 1, ...rest } = action.payload;
      const itemId = _id || id;
      const existing = state.items.find((i) => (i._id || i.id) === itemId);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ _id: itemId, id: itemId, qty, ...rest });
      }
      recalc(state);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((i) => (i._id || i.id) !== id);
      recalc(state);
    },
    incrementQty(state, action) {
      const id = action.payload;
      const existing = state.items.find((i) => (i._id || i.id) === id);
      if (existing) existing.qty += 1;
      recalc(state);
    },
    decrementQty(state, action) {
      const id = action.payload;
      const existing = state.items.find((i) => (i._id || i.id) === id);
      if (existing) {
        existing.qty -= 1;
        if (existing.qty <= 0) {
          state.items = state.items.filter((i) => (i._id || i.id) !== id);
        }
      }
      recalc(state);
    },
    clearCart() {
      return { ...defaultState };
    },
    clearCoupon(state) {
      state.coupon = null;
      state.couponError = null;
      state.couponStatus = 'idle';
      recalc(state);
    },
    setTip(state, action) {
      state.tip = action.payload || 0;
      recalc(state);
    },
    setNote(state, action) {
      state.note = action.payload || '';
    },
    setPrescription(state, action) {
      state.prescription = action.payload;
    },
    clearPrescription(state) {
      state.prescription = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.couponStatus = 'loading';
        state.couponError = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.couponStatus = 'succeeded';
        state.coupon = action.payload;
        state.couponError = null;
        recalc(state);
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.couponStatus = 'failed';
        state.couponError = action.payload || 'Coupon validation failed.';
      });
  }
});

export const {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
  clearCoupon,
  setTip,
  setNote,
  setPrescription,
  clearPrescription
} = cartSlice.actions;
export const selectCartPersist = (state) => ({
  items: state.items,
  coupon: state.coupon,
  tip: state.tip,
  note: state.note,
  prescription: state.prescription
});
export default cartSlice.reducer;
