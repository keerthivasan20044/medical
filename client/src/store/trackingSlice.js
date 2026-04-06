import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchOrderTrack = createAsyncThunk('tracking/fetch', async (orderId, thunkAPI) => {
  try {
    const res = await api.get(`/api/orders/${orderId}/track`);
    return res.data.item;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Tracking failed');
  }
});

const trackingSlice = createSlice({
  name: 'tracking',
  initialState: { status: 'idle', error: null, location: null, eta: null, statusText: null },
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
    setEta(state, action) {
      state.eta = action.payload;
    },
    setStatusText(state, action) {
      state.statusText = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderTrack.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderTrack.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.statusText = action.payload?.status || null;
        state.location = action.payload?.liveLocation || null;
        state.eta = action.payload?.estimatedDelivery || null;
      })
      .addCase(fetchOrderTrack.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setLocation, setEta, setStatusText } = trackingSlice.actions;
export default trackingSlice.reducer;
