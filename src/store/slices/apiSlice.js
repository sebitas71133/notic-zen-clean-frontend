import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // o desde redux si prefieres

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "Notes",
    "Auth",
    "Users",
    "Categories",
    "Tags",
    "Images",
    "SubNotes",
    "SubImages",
    "AllSubNotes",
  ],
  endpoints: () => ({}), // vacío al inicio
});
