import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "darkMode",
  initialState: {
    darkMode: false,
  },

  reducers: {
    toggleDarkMode: (state, action) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const themeReducer = themeSlice.reducer;
export const { toggleDarkMode } = themeSlice.actions;
