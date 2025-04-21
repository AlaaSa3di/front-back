import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      state.token = null;
    },
  },
});

export const { setCredentials, clearCredentials } = userSlice.actions;
export default userSlice.reducer;