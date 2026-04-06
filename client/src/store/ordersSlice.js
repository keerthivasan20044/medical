import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchOrders = createAsyncThunk('orders/fetch', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/orders/my-orders');
    return res.data.items || [];
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to load orders');
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await api.get(`/api/orders/${id}`);
    return res.data.item;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to load order');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status, riderId, otp }, thunkAPI) => {
  try {
    const res = await api.patch(`/api/orders/${id}/status`, { status, riderId, otp });
    return res.data.item || res.data.order;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Protocol update failed');
  }
});

export const addIncomingOrder = (order) => (dispatch) => {
  dispatch({ type: 'orders/addOrder', payload: order });
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], currentItem: null, status: 'idle', error: null },
  reducers: {
    addOrder(state, action) {
      state.items.unshift(action.payload);
    },
    updateOrderInList(state, action) {
      const idx = state.items.findIndex(i => (i.id === action.payload.id || i._id === action.payload.id));
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentItem = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex(i => (i.id === action.payload.id || i._id === action.payload._id));
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.currentItem && (state.currentItem.id === action.payload.id || state.currentItem._id === action.payload._id)) {
          state.currentItem = action.payload;
        }
      });
  }
});

export const { addOrder, updateOrderInList } = ordersSlice.actions;
export default ordersSlice.reducer;
