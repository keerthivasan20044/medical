import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchDoctors = createAsyncThunk('doctors/fetch', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/users?role=doctor');
    return res.data.items || [];
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to load doctors');
  }
});

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default doctorsSlice.reducer;
