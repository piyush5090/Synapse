import { createSlice } from '@reduxjs/toolkit';

// Only read TOKEN. Never trust user data from localStorage.
const token = localStorage.getItem('token');

const initialState = {
  token: token || null,
  // If a token exists, we assume we are "loading" until the API verifies it.
  // If no token, we are definitely not loaded and not authenticated.
  isLoading: !!token, 
  isAuthenticated: false, 
  email: null,
  business: null,        
  social_accounts: [],   
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Call this when Login API succeeds OR /me endpoint succeeds
    loginSuccess: (state, action) => {
      const { email, token, business, social_accounts } = action.payload;
      
      state.token = token;
      state.email = email;
      state.isAuthenticated = true;
      state.isLoading = false; // Verification complete
      state.business = business || null;
      state.social_accounts = social_accounts || [];

      // Only store the Token
      localStorage.setItem('token', token);
    },

    // Call this if /me fails (token expired/invalid)
    authFailed: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
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
      state.email = null;
      state.business = null;
      state.social_accounts = [];
      
      localStorage.removeItem('token');
      // No email removal needed because we never stored it
    },
  },
});

export const { loginSuccess, authFailed, setBusiness, setSocialAccounts, logout } = userSlice.actions;
export default userSlice.reducer;