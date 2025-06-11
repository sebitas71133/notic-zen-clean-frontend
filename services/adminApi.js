// services/authApi.js

import { apiSlice } from "../src/store/slices/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConfig: builder.query({
      query: () => ({
        url: "/admin/config",
        method: "GET",
      }),
    }),
    toggleModeration: builder.mutation({
      query: () => ({
        url: "/admin/moderation/toggle",
        method: "POST",
      }),
    }),
    toggleSendEmail: builder.mutation({
      query: () => ({
        url: "/admin/send-email/toggle",
        method: "POST",
      }),
    }),
  }),
});

// Hooks auto‑generados
export const {
  useGetConfigQuery,
  useToggleModerationMutation,
  useToggleSendEmailMutation,
} = adminApi;
