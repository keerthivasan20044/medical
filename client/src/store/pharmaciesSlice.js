import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchPharmacies = createAsyncThunk('pharmacies/fetch', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/pharmacies');
    return res.data.items || [];
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to load pharmacies');
  }
});

const pharmaciesSlice = createSlice({
  name: 'pharmacies',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPharmacies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPharmacies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPharmacies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default pharmaciesSlice.reducer;
