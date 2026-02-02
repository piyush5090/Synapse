import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAdminDashboardData } from './adminApiService';

const initialState = {
  users: [],
  posts: [],
  metrics: {},
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchAdminDashboard = createAsyncThunk('admin/fetchAdminDashboard', async () => {
  const data = await getAdminDashboardData();
  return data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
        state.posts = action.payload.posts;
        state.metrics = action.payload.metrics;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;
