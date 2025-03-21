import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice.js";
import { journalReducer } from "./slices/journalSlice";
import { usersReducer } from "./slices/userSlice";
import { themeReducer } from "./slices/themeSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    journal: journalReducer,
    users: usersReducer,
    theme: themeReducer,
  },
});
