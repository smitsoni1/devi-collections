import { apiSlice } from '../api/apiSlice';

export const sizesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSizes: builder.query({
      query: () => '/api/sizes',
      providesTags: ['Size'],
    }),
    createSize: builder.mutation({
      query: (data) => ({
        url: '/api/sizes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Size'],
    }),
    updateSize: builder.mutation({
      query: ({ id, name }) => ({
        url: `/api/sizes/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Size'],
    }),
    deleteSize: builder.mutation({
      query: (id) => ({
        url: `/api/sizes/${id}`,
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
