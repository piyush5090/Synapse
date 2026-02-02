import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, signup, getBusiness, createOrUpdateBusiness } from './userApiService';

const initialState = {
  user: null,
  business: null,
  token: localStorage.getItem('token') || null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const loginUser = createAsyncThunk('user/loginUser', async (credentials, { dispatch }) => {
  const data = await login(credentials);
  localStorage.setItem('token', data.token);
  dispatch(fetchBusiness());
  return data;
});

export const signupUser = createAsyncThunk('user/signupUser', async (credentials) => {
  const data = await signup(credentials);
  return data;
});

export const fetchBusiness = createAsyncThunk('user/fetchBusiness', async () => {
  const data = await getBusiness();
  return data.business;
});

export const saveBusiness = createAsyncThunk('user/saveBusiness', async (businessData) => {
  const data = await createOrUpdateBusiness(businessData);
  return data.business;
});


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.business = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBusiness.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.business = action.payload;
        state.error = null;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveBusiness.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveBusiness.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.business = action.payload;
        state.error = null;
      })
      .addCase(saveBusiness.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
