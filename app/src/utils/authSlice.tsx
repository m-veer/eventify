import { configureStore, createSlice } from "@reduxjs/toolkit";

// Create authSlice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Configure store
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

// Export actions
export const { setUser, logout } = authSlice.actions;
