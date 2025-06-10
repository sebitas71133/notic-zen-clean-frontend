// api/notesApi.js

import { apiSlice } from "../src/store/slices/apiSlice";

export const notesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: ({
        page = 1,
        limit = 10,
        categoryId,
        tagId,
        statusFilter,
        sortTitle,
        sortDate,
      }) => {
        let url = `/note/notes?page=${page}&limit=${limit}`;
        if (categoryId) {
          url += `&categoryId=${categoryId}`;
        }
        if (tagId) {
          url += `&tagId=${tagId}`;
        }
        if (statusFilter === "pinned") {
          url += `&isPinned=${"true"}`;
        }
        if (statusFilter === "archived") {
          url += `&isArchived=${"true"}`;
        }
        if (statusFilter === "all") {
          url += `&isArchived=${"false"}`;
        }

        if (sortTitle === "asc" || sortTitle === "desc") {
          url += `&sortTitle=${sortTitle}`;
        }

        if (sortDate === "asc" || sortDate === "desc") {
          url += `&sortDate=${sortDate}`;
        }
        return url;
      },

      providesTags: ["Notes"],
    }),
    addNote: builder.mutation({
      query: (note) => ({
        url: "/note/create",
        method: "POST",
        body: note,
      }),
      invalidatesTags: ["Notes"],
    }),
    updateNote: builder.mutation({
      query: ({ id, ...note }) => ({
        url: `/note/save/${id}`,
        method: "PUT",
        body: note,
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteNote: builder.mutation({
      query: (id) => ({
        url: `note/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
    getAllImages: builder.query({
      query: () => ({
        url: `/note/admin/images/all`,
        method: "GET",
      }),
      providesTags: ["Images"],
    }),
    cleanOrphanImages: builder.mutation({
      query: () => ({
        url: "/note/admin/images/cleanup",
        method: "POST",
      }),
      invalidatesTags: ["Images", "SubImages"],
    }),
  }),
});

export const {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useUpdateNoteMutation,
  useGetNotesQuery,
  useLazyGetNotesQuery,
  useGetAllImagesQuery,
  useCleanOrphanImagesMutation,
} = notesApi;
