import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchMedicines = createAsyncThunk('medicines/fetch', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/medicines');
    return res.data.items || [];
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to load medicines');
  }
});

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default medicinesSlice.reducer;
