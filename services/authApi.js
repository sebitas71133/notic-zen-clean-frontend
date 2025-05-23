// services/authApi.js

import { apiSlice } from "../src/store/slices/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "/auth/register",
        method: "POST",
        body: { name, email, password },
      }),
    }),
    renewToken: builder.query({
      query: () => ({
        url: "/auth/new",
        method: "GET",
      }),
    }),
  }),
});

// Hooks auto‑generados
export const { useLoginMutation, useRegisterMutation, useLazyRenewTokenQuery } =
  authApi;
