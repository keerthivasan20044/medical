import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

// Thunks
export const fetchAllOrders = createAsyncThunk(
  'pharmacistOrders/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/api/pharmacist/orders');
      return res.data.items || [];
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to fetch clinical manifests');
    }
  }
);

export const confirmOrder = createAsyncThunk(
  'pharmacistOrders/confirm',
  async (orderId, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: 'confirmed' });
      return res.data.order;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Protocol confirmation failed');
    }
  }
);

export const rejectOrder = createAsyncThunk(
  'pharmacistOrders/reject',
  async ({ orderId, reason }, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: 'rejected', reason });
      return res.data.order;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Rejection handshake failed');
    }
  }
);

export const markPreparing = createAsyncThunk(
  'pharmacistOrders/preparing',
  async (orderId, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: 'preparing' });
      return res.data.order;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Redline cycle initialization failed');
    }
  }
);

export const assignAgent = createAsyncThunk(
  'pharmacistOrders/assignAgent',
  async ({ orderId, agentId }, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/rider`, { riderId: agentId });
      return res.data.order;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Logistics agent assignment failed');
    }
  }
);

export const dispatchOrder = createAsyncThunk(
  'pharmacistOrders/dispatch',
  async (orderId, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: 'dispatched' });
      return res.data.order; // Server should generate OTP and emit to patient node
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Logistics departure protocol failed');
    }
  }
);

export const verifyPrescription = createAsyncThunk(
  'pharmacistOrders/verifyRx',
  async ({ orderId, verdict }, thunkAPI) => {
    try {
      const res = await api.patch(`/api/orders/${orderId}/rx-status`, { verdict });
      return res.data.order;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Clinical manifest verification failed');
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
       if (action.payload.needsPrescription) {
          state.pendingRx.unshift(action.payload);
       }
    },
    updateOrderStatus(state, action) {
       const { orderId, status } = action.payload;
       // Find and update in all lists
       const lists = ['incomingOrders', 'preparingOrders', 'dispatchedOrders', 'deliveredToday', 'pendingRx'];
       lists.forEach(list => {
          const item = state[list].find(o => (o.id === orderId || o._id === orderId));
          if (item) item.status = status;
       });
       if (state.selectedOrder && (state.selectedOrder.id === orderId || state.selectedOrder._id === orderId)) {
          state.selectedOrder.status = status;
       }
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
        state.incomingOrders = orders.filter(o => o.status === 'new' || o.status === 'pending');
        state.preparingOrders = orders.filter(o => o.status === 'preparing');
        state.dispatchedOrders = orders.filter(o => o.status === 'dispatched');
        state.deliveredToday = orders.filter(o => o.status === 'delivered');
        state.pendingRx = orders.filter(o => o.status === 'awaiting_rx_verification');
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        const order = action.payload;
        state.incomingOrders = state.incomingOrders.filter(o => (o.id !== order.id && o._id !== order.id));
        state.preparingOrders.unshift(order);
      })
      .addCase(markPreparing.fulfilled, (state, action) => {
        const order = action.payload;
        const idx = state.preparingOrders.findIndex(o => (o.id === order.id || o._id === order.id));
        if (idx !== -1) state.preparingOrders[idx] = order;
      })
      .addCase(dispatchOrder.fulfilled, (state, action) => {
        const order = action.payload;
        state.preparingOrders = state.preparingOrders.filter(o => (o.id !== order.id && o._id !== order.id));
        state.dispatchedOrders.unshift(order);
      })
      .addCase(verifyPrescription.fulfilled, (state, action) => {
        const order = action.payload;
        state.pendingRx = state.pendingRx.filter(o => (o.id !== order.id && o._id !== order.id));
        // Update status in other lists too
        const target = state.incomingOrders.find(o => (o.id === order.id || o._id === order.id));
        if (target) target.status = order.status;
      });
  }
});

export const { newOrderReceived, updateOrderStatus } = pharmacistOrderSlice.actions;

export default pharmacistOrderSlice.reducer;
