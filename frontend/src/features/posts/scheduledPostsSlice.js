import { createSlice } from '@reduxjs/toolkit';

const scheduledPostsSlice = createSlice({
  name: 'scheduledPosts',
  initialState: {
    schedules: [],
    pagination: { page: 1, limit: 5, total: 0, hasMore: false },
    status: 'idle',
  },
  reducers: {
    // 1. Bulk Set (Initial Fetch / Refresh)
    setScheduledPosts: (state, action) => {
      state.schedules = action.payload.data;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
      state.status = 'success';
    },

    // 2. Append (Load More) - NEW REDUCER
    appendScheduledPosts: (state, action) => {
      // Filter out duplicates based on ID to be safe
      const newSchedules = action.payload.data.filter(
        newSch => !state.schedules.some(existing => existing.id === newSch.id)
      );
      
      // Add to the end of the list
      state.schedules = [...state.schedules, ...newSchedules];
      
      // Optional: Keep them sorted by time if your UI relies on strict order
      // state.schedules.sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

      // Update pagination info (current page, hasMore)
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
      state.status = 'success';
    },

    // 3. Add One (Create)
    addScheduledPost: (state, action) => {
      state.schedules.push(action.payload);
      state.schedules.sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));
    },

    // 4. Remove One (Delete)
    removeScheduledPost: (state, action) => {
      state.schedules = state.schedules.filter((sch) => sch.id !== action.payload);
    },

    setSchedulesLoading: (state) => {
      state.status = 'loading';
    }
  },
});

export const { 
  setScheduledPosts, 
  appendScheduledPosts, // <--- Export this
  addScheduledPost, 
  removeScheduledPost, 
  setSchedulesLoading 
} = scheduledPostsSlice.actions;

export default scheduledPostsSlice.reducer;