import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "checking", // 'checking', 'authenticated', 'not-authenticated'
    user: null,
    token: null,
    errorMessage: null,
  },
  reducers: {
    checkingReducer: (state, action) => {
      state.status = "checking";
      state.user = null;
      state.token = null;
    },
    loginReducer: (state, action) => {
      state.status = "authenticated";

      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logoutReducer: (state, action) => {
      state.status = "not-authenticated";
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.errorMessage = action.payload?.errorMessage || null;
    },
    setErrorReducer(state, action) {
      state.errorMessage = action.payload;
    },
    clearErrorMessageReducer: (state, action) => {
      state.errorMessage = null;
    },
    registerReducer: (state, action) => {
      state.status = "authenticated";
      state.user = action.payload;
      state.errorMessage = null;
    },
    dsdd: (state, action) => {
      state.events = state.events.map((event) =>
        event._id === action.payload._id ? action.payload : event
      );
    },
    deleteEventReducer: (state, action) => {
      if (state.activeEvent) {
        state.events = state.events.filter(
          (event) => event._id !== state.activeEvent._id
        );
        state.activeEvent = null;
      }
    },
  },
});

export const {
  checkingReducer,
  loginReducer,
  logoutReducer,
  clearErrorMessageReducer,
  registerReducer,
  setErrorReducer,
} = authSlice.actions;
