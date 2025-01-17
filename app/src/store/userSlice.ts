// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  role: string;
  isAuthenticated: boolean;
  // registeredAt: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  profilePhotoURL: string;
  token: string;
}

const initialState: UserState = {
  firstName: '',
  lastName: '',
  email: '',
  isAdmin: false,
  role: 'user',
  isAuthenticated: false,
  // registeredAt: '',
  createdAt: "",
  updatedAt: "",
  location: "",
  profilePhotoURL: "",
  token: ""
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.isAdmin;
      state.role = action.payload.role;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
      state.location = action.payload.location;
      state.profilePhotoURL = action.payload.profilePhotoURL;
      state.token = action.payload.token;
      // state.registeredAt = action.payload.registeredAt;
    },
    clearUser: () => {
      // Reset state to initial values
      return initialState;
    },
  },
});

// Export the actions
export const { setUser, clearUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
