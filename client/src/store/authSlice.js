import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';
import { loadState } from '../utils/storage.js';

export const selectAuthPersist = (state) => ({
  user: state.user,
  role: state.role
});

export const loginUser = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/login', payload);
    return res.data.user;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.error || e.response?.data?.message || 'Login failed');
  }
});

export const googleOAuth = createAsyncThunk('auth/google', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/google', payload);
    return res.data.user;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.error || e.response?.data?.message || 'Google login failed');
  }
});

export const requestLoginOtp = createAsyncThunk('auth/loginOtp/request', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/login-otp/request', payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'OTP request failed');
  }
});

export const verifyLoginOtp = createAsyncThunk('auth/loginOtp/verify', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/login-otp/verify', payload);
    return res.data.user;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'OTP verification failed');
  }
});

export const requestPasswordReset = createAsyncThunk('auth/passwordReset/request', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/forgot-password', payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Password reset request failed');
  }
});

export const resetPassword = createAsyncThunk('auth/passwordReset/reset', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/reset-password', payload);
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Password reset failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const res = await api.post('/api/auth/register', payload);
    return res.data.user;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.error || e.response?.data?.message || 'Register failed');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return thunkAPI.rejectWithValue('No token');
    
    const res = await api.get('/api/users/me');
    return res.data.user;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Auth check failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/api/auth/logout');
  } catch (e) {
    // Even if server call fails, we still log out locally
  }
  // Always clear local storage
  localStorage.removeItem('medireach_auth_v1');
  localStorage.removeItem('medireach_cart_v1');
  return true;
});

const persisted = loadState('medireach_auth_v1');
const initialState = {
  user: persisted?.user || null,
  role: persisted?.role || null,
  isAuthenticated: !!persisted?.user,
  status: 'idle',
  error: null,
  oauthStatus: 'idle',
  otpStatus: 'idle',
  resetRequestStatus: 'idle',
  resetStatus: 'idle'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.role = action.payload?.role || 'customer';
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(googleOAuth.pending, (state) => {
        state.oauthStatus = 'loading';
        state.error = null;
      })
      .addCase(googleOAuth.fulfilled, (state, action) => {
        state.oauthStatus = 'succeeded';
        state.user = action.payload;
        state.role = action.payload?.role || 'customer';
        state.isAuthenticated = true;
      })
      .addCase(googleOAuth.rejected, (state, action) => {
        state.oauthStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(requestLoginOtp.pending, (state) => {
        state.otpStatus = 'loading';
        state.error = null;
      })
      .addCase(requestLoginOtp.fulfilled, (state) => {
        state.otpStatus = 'succeeded';
      })
      .addCase(requestLoginOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.otpStatus = 'loading';
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.otpStatus = 'succeeded';
        state.user = action.payload;
        state.role = action.payload?.role || 'customer';
        state.isAuthenticated = true;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.resetRequestStatus = 'loading';
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.resetRequestStatus = 'succeeded';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.resetRequestStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetStatus = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetStatus = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload?.role || 'customer';
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload?.role || 'customer';
        state.isAuthenticated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.status = 'failed';
        localStorage.removeItem('medireach_auth_v1');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear auth even if server call failed
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      });
  }
});

export const { setAuth, clearAuth, logout } = authSlice.actions;
export default authSlice.reducer;
