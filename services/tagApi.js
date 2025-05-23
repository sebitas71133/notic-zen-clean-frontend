// api/notesApi.js

import { apiSlice } from "../src/store/slices/apiSlice";

export const tagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query({
      query: ({ page = 1, limit = 10 }) => `/tag?page=${page}&limit=${limit}`,
      providesTags: ["Tags"],
    }),
    // addNote: builder.mutation({
    //   query: (note) => ({
    //     url: "/note/notes",
    //     method: "POST",
    //     body: note,
    //   }),
    //   invalidatesTags: ["Notes"],
    // }),
    // updateNote: builder.mutation({
    //   query: ({ id, ...note }) => ({
    //     url: `/note/notes/${id}`,
    //     method: "PUT",
    //     body: note,
    //   }),
    //   invalidatesTags: ["Notes"],
    // }),
    // deleteNote: builder.mutation({
    //   query: (id) => ({
    //     url: `/notes/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Notes"],
    // }),
  }),
});

export const {
  useLazyGetTagsQuery,
  // useAddNoteMutation,
  // useDeleteNoteMutation,
  // useUpdateNoteMutation,
  // useGetNotesQuery,
  // useLazyGetNotesQuery,
} = tagApi;
