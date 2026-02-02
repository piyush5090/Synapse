import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getGeneratedPosts, generateAd, saveGeneratedPost } from './postsApiService';

const initialState = {
  posts: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  generationStatus: 'idle',
  generationError: null,
};

export const fetchGeneratedPosts = createAsyncThunk('posts/fetchGeneratedPosts', async () => {
  const data = await getGeneratedPosts();
  return data;
});

export const generateNewAd = createAsyncThunk('posts/generateNewAd', async (promptData) => {
  const data = await generateAd(promptData);
  return data.data;
});

export const savePost = createAsyncThunk('posts/savePost', async (postData, { dispatch }) => {
  const data = await saveGeneratedPost(postData);
  dispatch(fetchGeneratedPosts());
  return data.data;
});


const generatedPostsSlice = createSlice({
  name: 'generatedPosts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneratedPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGeneratedPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchGeneratedPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(generateNewAd.pending, (state) => {
        state.generationStatus = 'loading';
      })
      .addCase(generateNewAd.fulfilled, (state, action) => {
        state.generationStatus = 'succeeded';
        state.posts.unshift(action.payload);
      })
      .addCase(generateNewAd.rejected, (state, action) => {
        state.generationStatus = 'failed';
        state.generationError = action.error.message;
      })
      .addCase(savePost.pending, (state) => {
        // Optionally handle saving status
      })
      .addCase(savePost.fulfilled, (state, action) => {
        // Optionally handle saved status
      })
      .addCase(savePost.rejected, (state, action) => {
        // Optionally handle save error
      });
  },
});

export default generatedPostsSlice.reducer;
