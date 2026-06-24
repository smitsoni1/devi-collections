import { apiSlice } from '../api/apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ id, name, inNavbar }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: { name, inNavbar },
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          categoriesApiSlice.util.updateQueryData('getCategories', undefined, (draft) => {
            const category = draft.categories.find((c) => c._id === id);
            if (category) {
              if (patch.name !== undefined) category.name = patch.name;
              if (patch.inNavbar !== undefined) category.inNavbar = patch.inNavbar;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
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
