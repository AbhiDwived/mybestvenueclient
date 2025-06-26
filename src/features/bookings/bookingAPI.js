import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Booking', 'Vendors'],
  endpoints: (builder) => ({
    // Get all bookings (Admin)
    getAllBookings: builder.query({
      query: () => ({
        url: '/booking/all',
        method: 'GET',
      }),
      providesTags: ['Booking'],
    }),

    // Get user's bookings
    getUserBookings: builder.query({
      query: () => ({
        url: '/booking',
        method: 'GET',
      }),
      providesTags: ['Booking'],
    }),

    // Get a single booking by ID
    getBookingById: builder.query({
      query: (bookingId) => ({
        url: `/booking/${bookingId}`,
        method: 'GET',
      }),
      providesTags: (result, error, bookingId) => [{ type: 'Booking', id: bookingId }],
    }),

    // Create a new booking
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: '/booking',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),

    // Update a booking
    updateBooking: builder.mutation({
      query: ({ bookingId, bookingData }) => ({
        url: `/booking/${bookingId}`,
        method: 'PUT',
        body: bookingData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: 'Booking', id: bookingId },
        'Booking',
      ],
    }),

    // Delete a booking
    deleteBooking: builder.mutation({
      query: (bookingId) => ({
        url: `/booking/${bookingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking'],
    }),

    // Get available vendors for booking
    getAvailableVendors: builder.query({
      query: (category) => ({
        url: '/booking/vendors',
        method: 'GET',
        params: category ? { category } : undefined,
      }),
      providesTags: ['Vendors'],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useGetAvailableVendorsQuery,
} = bookingApi; 