import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import generatedPostsReducer from '../features/posts/generatedPostsSlice';
import scheduledPostsReducer from '../features/posts/scheduledPostsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    generatedPosts: generatedPostsReducer,
    scheduledPosts: scheduledPostsReducer,
  },
});