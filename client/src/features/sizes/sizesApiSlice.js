import { apiSlice } from '../api/apiSlice';

export const sizesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query({
      query: () => '/sizes',
      providesTags: ['Size'],
    }),
    createSize: builder.mutation({
      query: (data) => ({
        url: '/sizes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Size'],
    }),
    updateSize: builder.mutation({
      query: ({ id, name }) => ({
        url: `/sizes/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Size'],
    }),
    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/sizes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Size'],
    }),
  }),
});

export const {
  useGetSizesQuery,
  useCreateSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
} = sizesApiSlice;
