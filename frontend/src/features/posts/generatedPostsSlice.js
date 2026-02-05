import { createSlice } from '@reduxjs/toolkit';

const generatedPostsSlice = createSlice({
  name: 'generatedPosts',
  initialState: {
    posts: [],
    pagination: { page: 1, limit: 20, total: 0, hasMore: false },
    status: 'idle',
  },
  reducers: {
    setGeneratedPosts: (state, action) => {
      state.posts = action.payload.data;
      state.pagination = action.payload.pagination;
      state.status = 'success';
    },
    // --- NEW REDUCER FOR LOAD MORE ---
    appendGeneratedPosts: (state, action) => {
      // 1. Add new posts to the end
      // (Optional: Filter duplicates to be safe)
      const newPosts = action.payload.data.filter(
        newPost => !state.posts.some(existing => existing.id === newPost.id)
      );
      state.posts = [...state.posts, ...newPosts];
      
      // 2. Update pagination info (current page, hasMore, etc)
      state.pagination = action.payload.pagination;
    },
    // ---------------------------------
    addGeneratedPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    removeGeneratedPost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    setPostsLoading: (state) => {
      state.status = 'loading';
    }
  },
});

export const { setGeneratedPosts, appendGeneratedPosts, addGeneratedPost, removeGeneratedPost, setPostsLoading } = generatedPostsSlice.actions;
export default generatedPostsSlice.reducer;