// api/notesApi.js

import { apiSlice } from "../src/store/slices/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/category/categories?page=${page}&limit=${limit}`,
      providesTags: ["Categories"],
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
  useLazyGetCategoriesQuery,
  // useAddNoteMutation,
  // useDeleteNoteMutation,
  // useUpdateNoteMutation,
  // useGetNotesQuery,
  // useLazyGetNotesQuery,
} = categoryApi;
