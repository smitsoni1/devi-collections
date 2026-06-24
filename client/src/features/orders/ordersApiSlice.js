import { apiSlice } from '../api/apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    getMyOrders: builder.query({
      query: () => '/orders/mine',
      providesTags: [{ type: 'Order', id: 'MINE' }],
    }),

    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: '/orders/razorpay/create',
        method: 'POST',
        body: data,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ id, ...paymentResult }) => ({
        url: `/orders/${id}/pay`,
        method: 'PUT',
        body: paymentResult,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),

    // Admin
    getAllOrders: builder.query({
      query: (params) => ({ url: '/admin/orders', params }),
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    deliverOrder: builder.mutation({
      query: ({ id, trackingNumber }) => ({
        url: `/admin/orders/${id}/deliver`,
        method: 'PUT',
        body: { trackingNumber },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetMyOrdersQuery,
  useCreateRazorpayOrderMutation,
  usePayOrderMutation,
  useGetAllOrdersQuery,
  useDeliverOrderMutation,
} = ordersApiSlice;
