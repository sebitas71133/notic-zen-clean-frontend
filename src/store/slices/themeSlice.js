import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "darkMode",
  initialState: {
    darkMode: JSON.parse(localStorage.getItem("darkMode") ?? "false"),
  },

  reducers: {
    toggleDarkMode: (state, action) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
    },
  },
});

export const themeReducer = themeSlice.reducer;
export const { toggleDarkMode } = themeSlice.actions;
