// api/notesApi.js

import { apiSlice } from "../src/store/slices/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createNotification: builder.mutation({
      query: ({ noteId, message, email, type }) => ({
        url: `/notifications`,
        method: "POST",
        body: { noteId, message, email, type },
      }),
      invalidatesTags: ["Notifications"],
    }),
    getMyNotifications: builder.query({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Notifications"],
    }),
    markAsRead: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    markAllAsRead: builder.mutation({
      query: () => ({
        url: `/notifications/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useCreateNotificationMutation,
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useDeleteNotificationMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
