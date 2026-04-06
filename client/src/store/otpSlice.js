import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const confirmDeliveryOtp = createAsyncThunk('otp/confirm', async ({ orderId, code }, thunkAPI) => {
  try {
    const res = await api.put(`/api/orders/${orderId}/verify-otp`, { code });
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'OTP verification failed');
  }
});

export const verifyAccountOtp = createAsyncThunk('otp/verifyAccount', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/verify-otp', payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'OTP verification failed');
  }
});

export const resendOtp = createAsyncThunk('otp/resend', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/resend-otp', payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Resend failed');
  }
});

const otpSlice = createSlice({
  name: 'otp',
  initialState: { status: 'idle', error: null, verified: false, resendStatus: 'idle' },
  reducers: {
    resetOtp(state) {
      state.status = 'idle';
      state.error = null;
      state.verified = false;
      state.resendStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmDeliveryOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(confirmDeliveryOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        state.verified = true;
      })
      .addCase(confirmDeliveryOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyAccountOtp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyAccountOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        state.verified = true;
      })
      .addCase(verifyAccountOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resendOtp.pending, (state) => {
        state.resendStatus = 'loading';
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendStatus = 'succeeded';
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetOtp } = otpSlice.actions;
export default otpSlice.reducer;
