import { api } from '../../services/api';

export const reviewAPI = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendorReviews: builder.query({
      query: (vendorId) => `/reviews/vendor/${vendorId}`,
    }),
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData,
      }),
    }),
    updateReview: builder.mutation({
      query: ({ reviewId, ...reviewData }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PUT',
        body: reviewData,
      }),
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetVendorReviewsQuery, useCreateReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } = reviewAPI;
