import { apiSlice } from "../src/store/slices/apiSlice";

export const tagApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query({
      query: ({ page = 1, limit = 100 }) => `/tag?page=${page}&limit=${limit}`,
      providesTags: ["Tags"],
    }),
    addTag: builder.mutation({
      query: (tag) => ({
        url: "/tag/create",
        method: "POST",
        body: tag,
      }),
      invalidatesTags: ["Tags"],
    }),
    updateTag: builder.mutation({
      query: ({ id, ...tag }) => ({
        url: `/tag/${id}`,
        method: "PUT",
        body: tag,
      }),
      invalidatesTags: ["Tags", "Notes"],
    }),
    deleteTag: builder.mutation({
      query: (id) => ({
        url: `/tag/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tags", "Notes"],
    }),
  }),
});

export const {
  useLazyGetTagsQuery,
  useGetTagsQuery,
  useAddTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagApi;
