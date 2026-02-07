import { createSlice } from '@reduxjs/toolkit';

// Reading the token from localStorage 
const token = localStorage.getItem('token');

// Initializing the Initial state
const initialState = {
  token: token || null,
  isLoading: !!token, 
  isAuthenticated: false, 
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