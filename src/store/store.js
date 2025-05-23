import { configureStore } from "@reduxjs/toolkit";

import { usersReducer } from "./slices/userSlice";
import { themeReducer } from "./slices/themeSlice.js";

import { authSlice } from "./slices/authSlice.js";
import { authApi } from "../../services/authApi.js";
import { notesSlice } from "./slices/noteSlice.js";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    note: notesSlice.reducer,
    // journal: journalReducer,
    [authApi.reducerPath]: authApi.reducer,
    users: usersReducer,
    theme: themeReducer,
  },
  middleware: (gdm) => gdm().concat(authApi.middleware),
});
