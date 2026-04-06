import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchPrescriptions = createAsyncThunk('prescriptions/fetch', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/prescriptions/me');
    return res.data.items || [];
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to load prescriptions');
  }
});

const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default prescriptionsSlice.reducer;
