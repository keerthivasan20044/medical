import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

// Thunks
export const uploadPrescription = createAsyncThunk(
  'orderFlow/uploadPrescription',
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'medireach_prescriptions');
      // Mocking Cloudinary/Backend upload
      const res = await api.post('/api/prescriptions/upload', formData);
      return res.data; // { url, publicId }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Upload failed');
    }
  }
);

export const applyPromoCode = createAsyncThunk(
  'orderFlow/applyPromo',
  async (code, thunkAPI) => {
    try {
      const res = await api.post('/api/promo/validate', { code });
      return res.data; // { discount, code }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Invalid code');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orderFlow/placeOrder',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState().orderFlow;
    try {
      const payload = {
        items: state.cart.items,
        pharmacyId: state.selectedPharmacy?.id,
        prescription: state.prescription.url,
        deliveryAddress: state.deliveryAddress,
        paymentMethod: state.paymentMethod,
        useWallet: state.useWallet,
        total: state.cart.total
      };
      const res = await api.post('/api/orders', payload);
      return res.data.order;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Placement failed');
    }
  }
);

const initialState = {
  currentStep: 1,
  selectedPharmacy: null,
  cart: {
    items: [],
    subtotal: 0,
    deliveryCharge: 30,
    discount: 0,
    total: 0,
    promoCode: null,
    pharmacyId: null,
    pharmacyName: ''
  },
  prescription: {
    file: null,
    url: null,
    publicId: null,
    status: 'none' // none|uploading|uploaded|verified|rejected
  },
  deliveryAddress: {
    savedAddressId: null,
    street: '',
    area: '',
    city: 'Karaikal',
    pincode: '609602',
    coordinates: { lat: null, lng: null }
  },
  paymentMethod: 'upi',
  useWallet: false,
  useLoyaltyPoints: false,
  appliedPromo: null,
  placedOrder: null,
  loading: false,
  error: null
};

const orderFlowSlice = createSlice({
  name: 'orderFlow',
  initialState,
  reducers: {
    setStep(state, action) {
      state.currentStep = action.payload;
    },
    selectPharmacy(state, action) {
      state.selectedPharmacy = action.payload;
      state.cart.pharmacyId = action.payload.id;
      state.cart.pharmacyName = action.payload.name;
    },
    addToCart(state, action) {
       const { medicine, qty } = action.payload;
       const existing = state.cart.items.find(i => i.id === medicine.id);
       if (existing) {
          existing.qty += qty;
       } else {
          state.cart.items.push({ ...medicine, qty });
       }
       // Update Totals
       state.cart.subtotal = state.cart.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
       state.cart.total = state.cart.subtotal + state.cart.deliveryCharge - state.cart.discount;
    },
    removeFromCart(state, action) {
       state.cart.items = state.cart.items.filter(i => i.id !== action.payload);
       state.cart.subtotal = state.cart.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
       state.cart.total = state.cart.subtotal + state.cart.deliveryCharge - state.cart.discount;
    },
    updateCartQty(state, action) {
       const { medicineId, qty } = action.payload;
       const item = state.cart.items.find(i => i.id === medicineId);
       if (item) {
          item.qty = qty;
          if (item.qty <= 0) {
             state.cart.items = state.cart.items.filter(i => i.id !== medicineId);
          }
       }
       state.cart.subtotal = state.cart.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
       state.cart.total = state.cart.subtotal + state.cart.deliveryCharge - state.cart.discount;
    },
    clearCart(state) {
       state.cart.items = [];
       state.cart.subtotal = 0;
       state.cart.total = 0;
    },
    setPrescriptionStatus(state, action) {
       state.prescription.status = action.payload;
    },
    setDeliveryAddress(state, action) {
       state.deliveryAddress = { ...state.deliveryAddress, ...action.payload };
    },
    setPaymentMethod(state, action) {
       state.paymentMethod = action.payload;
    },
    toggleWallet(state) {
       state.useWallet = !state.useWallet;
    },
    toggleLoyaltyPoints(state) {
       state.useLoyaltyPoints = !state.useLoyaltyPoints;
    },
    resetOrderFlow(state) {
       return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPrescription.pending, (state) => {
        state.prescription.status = 'uploading';
      })
      .addCase(uploadPrescription.fulfilled, (state, action) => {
        state.prescription.status = 'uploaded';
        state.prescription.url = action.payload.url;
        state.prescription.publicId = action.payload.publicId;
      })
      .addCase(uploadPrescription.rejected, (state) => {
        state.prescription.status = 'none';
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.appliedPromo = action.payload;
        state.cart.discount = action.payload.discount;
        state.cart.total = state.cart.subtotal + state.cart.deliveryCharge - state.cart.discount;
      })
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.placedOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectCurrentStep = (state) => state.orderFlow.currentStep;
export const selectSelectedPharmacy = (state) => state.orderFlow.selectedPharmacy;
export const selectCartItems = (state) => state.orderFlow.cart.items;
export const selectCartTotal = (state) => state.orderFlow.cart.total;
export const selectRxItemsInCart = (state) => state.orderFlow.cart.items.filter(i => i.requiresRx);
export const selectOrderSummary = (state) => ({
  subtotal: state.orderFlow.cart.subtotal,
  delivery: state.orderFlow.cart.deliveryCharge,
  discount: state.orderFlow.cart.discount,
  total: state.orderFlow.cart.total
});
export const selectNeedsRx = (state) => state.orderFlow.cart.items.some(i => i.requiresRx);

export const { 
  setStep, selectPharmacy, addToCart, removeFromCart, 
  updateCartQty, clearCart, setPrescriptionStatus, 
  setDeliveryAddress, setPaymentMethod, toggleWallet, 
  toggleLoyaltyPoints, resetOrderFlow 
} = orderFlowSlice.actions;

export default orderFlowSlice.reducer;
