import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, thunkAPI) => {
  try {
    const res = await api.get('/api/notifications');
    return res.data.items || [];
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to load notifications');
  }
});

export const markNotificationRead = createAsyncThunk('notifications/read', async (id, thunkAPI) => {
  try {
    const res = await api.put(`/api/notifications/${id}/read`);
    return res.data.item;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to update');
  }
});

export const markAllNotificationsRead = createAsyncThunk('notifications/readAll', async (_, thunkAPI) => {
  try {
    await api.put('/api/notifications/read/all');
    return true;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || 'Failed to update');
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    addNotification(state, action) {
      state.items.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, isRead: true }));
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
