import { apiSlice } from '../api/apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/api/categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: '/api/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `/api/categories/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;
