// api/notesApi.js

import { apiSlice } from "../src/store/slices/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/category/categories?page=${page}&limit=${limit}`,
      providesTags: ["Categories"],
    }),
    addCategory: builder.mutation({
      query: (category) => ({
        url: "/category/create",
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...category }) => ({
        url: `/category/categories/${id}`,
        method: "PUT",
        body: category,
      }),
      invalidatesTags: ["Categories", "Notes"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories", "Notes"],
    }),
  }),
});

export const {
  useLazyGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useGetCategoriesQuery,
} = categoryApi;
