import { createSlice } from '@reduxjs/toolkit';

// 1. READ FROM STORAGE (Load saved email if it exists)
const token = localStorage.getItem('token');
const storedEmail = localStorage.getItem('email'); // <--- ADD THIS

const initialState = {
  token: token || null,
  isAuthenticated: !!token,
  email: storedEmail || null, // <--- UPDATE THIS (Use storedEmail instead of null)
  business: null,        
  social_accounts: [],   
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { email, token, business, social_accounts } = action.payload;
      
      state.token = token;
      state.email = email;
      state.isAuthenticated = true;
      state.business = business || null;
      state.social_accounts = social_accounts || [];

      // 2. WRITE TO STORAGE (Save email on login)
      localStorage.setItem('token', token);
      localStorage.setItem('email', email); // <--- ADD THIS
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
      state.email = null;
      state.business = null;
      state.social_accounts = [];
      
      // 3. CLEAR FROM STORAGE (Remove email on logout)
      localStorage.removeItem('token');
      localStorage.removeItem('email'); // <--- ADD THIS
    },
  },
});

export const { loginSuccess, setBusiness, setSocialAccounts, logout } = userSlice.actions;
export default userSlice.reducer;