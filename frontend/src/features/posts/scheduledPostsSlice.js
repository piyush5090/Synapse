import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getScheduledPosts, createSchedule } from './postsApiService';

const initialState = {
  scheduledPosts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchScheduledPosts = createAsyncThunk('posts/fetchScheduledPosts', async () => {
  const data = await getScheduledPosts();
  return data;
});

export const scheduleNewPost = createAsyncThunk('posts/scheduleNewPost', async (scheduleData, { dispatch }) => {
  const data = await createSchedule(scheduleData);
  dispatch(fetchScheduledPosts());
  return data;
});


const scheduledPostsSlice = createSlice({
  name: 'scheduledPosts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScheduledPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScheduledPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.scheduledPosts = action.payload;
      })
      .addCase(fetchScheduledPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(scheduleNewPost.pending, (state) => {
        // Optionally handle scheduling status
      })
      .addCase(scheduleNewPost.fulfilled, (state, action) => {
        // Optionally handle scheduled status
      })
      .addCase(scheduleNewPost.rejected, (state, action) => {
        // Optionally handle schedule error
      });
  },
});

export default scheduledPostsSlice.reducer;
