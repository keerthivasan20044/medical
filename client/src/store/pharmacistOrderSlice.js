import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

// Thunks
export const fetchAllOrders = createAsyncThunk(
  'pharmacistOrders/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/orders/pharmacy');
      return res.data.items || [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const confirmOrder = createAsyncThunk(
  'pharmacistOrders/confirm',
  async (orderId, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: 'confirmed' });
      return res.data.item;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Confirmation failed');
    }
  }
);

export const rejectOrder = createAsyncThunk(
  'pharmacistOrders/reject',
  async ({ orderId, reason }, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: 'cancelled', reason });
      return res.data.item;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Rejection failed');
    }
  }
);

export const markPreparing = createAsyncThunk(
  'pharmacistOrders/preparing',
  async (orderId, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: 'preparing' });
      return res.data.item;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to update to preparing');
    }
  }
);

export const dispatchOrder = createAsyncThunk(
  'pharmacistOrders/dispatch',
  async (orderId, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: 'out for delivery' });
      return res.data.item;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to dispatch');
    }
  }
);

export const approvePrescription = createAsyncThunk(
  'pharmacistOrders/approveRx',
  async ({ prescriptionId }, thunkAPI) => {
    try {
      const res = await api.put(`/api/prescriptions/${prescriptionId}/approve`);
      return res.data.item;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Prescription approval failed');
    }
  }
);

const initialState = {
  incomingOrders: [],
  preparingOrders: [],
  dispatchedOrders: [],
  deliveredToday: [],
  pendingRx: [],
  selectedOrder: null,
  loading: false,
  error: null
};

const pharmacistOrderSlice = createSlice({
  name: 'pharmacistOrders',
  initialState,
  reducers: {
    newOrderReceived(state, action) {
       state.incomingOrders.unshift(action.payload);
    },
    updateOrderStatus(state, action) {
       const { orderId, status } = action.payload;
       const lists = ['incomingOrders', 'preparingOrders', 'dispatchedOrders', 'deliveredToday'];
       lists.forEach(list => {
          const item = state[list].find(o => (o.id === orderId || o._id === orderId));
          if (item) item.status = status;
       });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        const orders = action.payload;
        state.incomingOrders = orders.filter(o => o.status === 'pending');
        state.preparingOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing');
        state.dispatchedOrders = orders.filter(o => o.status === 'out for delivery');
        state.deliveredToday = orders.filter(o => o.status === 'delivered');
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        const order = action.payload;
        state.incomingOrders = state.incomingOrders.filter(o => (o.id !== order._id && o._id !== order._id));
        state.preparingOrders.unshift(order);
      })
      .addCase(markPreparing.fulfilled, (state, action) => {
        const order = action.payload;
        const idx = state.preparingOrders.findIndex(o => (o.id === order._id || o._id === order._id));
        if (idx !== -1) state.preparingOrders[idx] = order;
      })
      .addCase(dispatchOrder.fulfilled, (state, action) => {
        const order = action.payload;
        state.preparingOrders = state.preparingOrders.filter(o => (o.id !== order._id && o._id !== order._id));
        state.dispatchedOrders.unshift(order);
      });
  }
});

export const { newOrderReceived, updateOrderStatus } = pharmacistOrderSlice.actions;
export default pharmacistOrderSlice.reducer;

