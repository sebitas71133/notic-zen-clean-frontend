// api/notesApi.js

import { apiSlice } from "../src/store/slices/apiSlice";

export const subNoteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubNotes: builder.query({
      query: ({
        page = 1,
        limit = 10,
        noteId,
        tagId,
        statusFilter,
        sortTitle,
        sortDate,
      }) => {
        let url = `/note/${noteId}/subnotes?page=${page}&limit=${limit}`;
        console.log(url);
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

      providesTags: ["SubNotes"],
    }),
    addSubNote: builder.mutation({
      query: ({ subNote, noteId }) => ({
        url: `/note/${noteId}/subnotes`,
        method: "POST",
        body: subNote,
      }),
      invalidatesTags: ["SubNotes"],
    }),
    updateSubNote: builder.mutation({
      query: ({ subNoteId, noteId, subNote }) => ({
        url: `/note/${noteId}/subnotes/${subNoteId}`,
        method: "PUT",
        body: subNote,
      }),
      invalidatesTags: ["SubNotes"],
    }),
    deleteSubNote: builder.mutation({
      query: ({ subNoteId, noteId }) => ({
        url: `/note/${noteId}/subnotes/${subNoteId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SubNotes"],
    }),
    getAllSubImages: builder.query({
      query: () => ({
        url: `/note/admin/sub-images/all`,
        method: "GET",
      }),
      providesTags: ["SubImages"],
    }),
    cleanOrphanSubImages: builder.mutation({
      query: () => ({
        url: "/note/admin/sub-images/cleanup",
        method: "POST",
      }),
      invalidatesTags: ["SubImages", "Images"],
    }),
  }),
});

export const {
  useGetSubNotesQuery,
  useAddSubNoteMutation,
  useUpdateSubNoteMutation,
  useDeleteSubNoteMutation,
  useCleanOrphanSubImagesMutation,
  useGetAllSubImagesQuery,
} = subNoteApi;
