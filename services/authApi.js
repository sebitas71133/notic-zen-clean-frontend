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
    getUsers: builder.query({
      query: () => ({
        url: "/auth/users",
        method: "GET",
      }),
    }),
    updateRole: builder.mutation({
      query: ({ userId, roleId }) => ({
        url: "/auth/users/update-role",
        method: "POST",
        body: { userId, roleId },
      }),
    }),
  }),
});

// Hooks auto‑generados
export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyRenewTokenQuery,
  useGetUsersQuery,
  useUpdateRoleMutation,
} = authApi;
