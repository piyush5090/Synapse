import { createSlice } from '@reduxjs/toolkit';

// Reading the token from localStorage 
const token = localStorage.getItem('token');

// Initializing the Initial state
const initialState = {
  token: token || null,
  isLoading: !!token, 
  isAuthenticated: false, 
  user: null, // Stores full user object (id, role, is_banned)
  email: null,
  business: null,        
  social_accounts: [],   
};

// Creating the user slice 
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Call this when Login API succeeds OR /me endpoint succeeds
    loginSuccess: (state, action) => {
      // payload: { token, user: { id, email, role, ... }, business, social_accounts }
      const { email, token, business, social_accounts, ...userData } = action.payload;
      
      state.token = token;
      state.email = email;
      state.isAuthenticated = true;
      state.isLoading = false; 
      
      // Store the full user object (including role)
      state.user = userData; 
      
      state.business = business || null;
      state.social_accounts = social_accounts || [];

      localStorage.setItem('token', token);
    },

    // Call this if /me fails (token expired/invalid)
    authFailed: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.email = null;
      state.business = null;
      state.social_accounts = [];
      localStorage.removeItem('token');
    },

    setBusiness: (state, action) => {
      state.business = action.payload;
    },

    setSocialAccounts: (state, action) => {
      state.social_accounts = action.payload;
    },

    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.email = null;
      state.business = null;
      state.social_accounts = [];
      
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, authFailed, setBusiness, setSocialAccounts, logOut } = userSlice.actions;
export default userSlice.reducer;