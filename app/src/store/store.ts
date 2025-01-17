// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";



// Create and export the Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Define and export RootState type
export type RootState = ReturnType<typeof store.getState>;

// Optionally, define and export AppDispatch type for dispatch
export type AppDispatch = typeof store.dispatch;
