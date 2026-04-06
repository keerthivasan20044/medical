import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const createOrder = createAsyncThunk('payments/createOrder', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/orders', payload);
    return res.data.order;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Order failed');
  }
});

export const createPaymentIntent = createAsyncThunk('payments/intent', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/payments/intent', payload);
    return res.data.intent;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Payment intent failed');
  }
});

export const confirmPayment = createAsyncThunk('payments/confirm', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/payments/confirm', payload);
    return res.data.order;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Payment failed');
  }
});

export const fetchReceipts = createAsyncThunk('payments/receipts', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/payments/receipts');
    return res.data.items || [];
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Receipts failed');
  }
});

export const logPaymentRetry = createAsyncThunk('payments/retry', async (payload, thunkAPI) => {
  try {
    await api.post('/api/payments/retry', payload);
    return true;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Retry log failed');
  }
});

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: { lastOrder: null, receipts: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.lastOrder = action.payload;
      })
      .addCase(fetchReceipts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.receipts = action.payload;
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default paymentsSlice.reducer;
