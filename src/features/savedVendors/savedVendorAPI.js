import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const savedVendorApi = createApi({
  reducerPath: 'savedVendorApi',
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
  tagTypes: ['SavedVendors'],
  endpoints: (builder) => ({
    // Get all saved vendors
    getSavedVendors: builder.query({
      query: () => ({
        url: '/saved-vendors',
        method: 'GET',
      }),
      providesTags: ['SavedVendors'],
    }),

    // Save a vendor
    saveVendor: builder.mutation({
      query: (vendorId) => ({
        url: `/saved-vendors/${vendorId}`,
        method: 'POST',
      }),
      invalidatesTags: ['SavedVendors'],
    }),

    // Unsave a vendor
    unsaveVendor: builder.mutation({
      query: (vendorId) => ({
        url: `/saved-vendors/${vendorId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedVendors'],
    }),

    // Check if a vendor is saved
    checkVendorSaved: builder.query({
      query: (vendorId) => ({
        url: `/saved-vendors/check/${vendorId}`,
        method: 'GET',
      }),
      providesTags: (result, error, vendorId) => [{ type: 'SavedVendors', id: vendorId }],
    }),
  }),
});

export const {
  useGetSavedVendorsQuery,
  useSaveVendorMutation,
  useUnsaveVendorMutation,
  useCheckVendorSavedQuery,
} = savedVendorApi; 