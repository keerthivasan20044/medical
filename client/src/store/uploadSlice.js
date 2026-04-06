import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const uploadToCloudinary = createAsyncThunk('upload/cloudinary', async (file, thunkAPI) => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !preset) throw new Error('Cloudinary env not configured');
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: form
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Cloudinary upload failed');
    return { url: data.secure_url, publicId: data.public_id };
  } catch (e) {
    return thunkAPI.rejectWithValue(e.message || 'Upload failed');
  }
});

export const uploadPrescription = createAsyncThunk('upload/prescription', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/prescriptions', payload);
    return res.data.item;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Upload failed');
  }
});

export const uploadAvatar = createAsyncThunk('upload/avatar', async (payload, thunkAPI) => {
  try {
    const res = await api.put('/api/users/avatar', payload);
    return res.data.user;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Avatar upload failed');
  }
});

const uploadSlice = createSlice({
  name: 'upload',
  initialState: { status: 'idle', error: null, lastUpload: null },
  reducers: {
    resetUpload(state) {
      state.status = 'idle';
      state.error = null;
      state.lastUpload = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadToCloudinary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadToCloudinary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastUpload = action.payload;
      })
      .addCase(uploadToCloudinary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(uploadPrescription.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(uploadAvatar.fulfilled, (state) => {
        state.status = 'succeeded';
      });
  }
});

export const { resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
