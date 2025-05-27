import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Register Admin
    registerAdmin: builder.mutation({
      query: (data) => ({
        url: '/admin/register',
        method: 'POST',
        body: data,
      }),
    }),

    // Login Admin
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: '/admin/login',
        method: 'POST',
        body: data,
      }),
    }),

    // Verify Admin OTP
    verifyAdminOtp: builder.mutation({
      query: ({ adminId, otp }) => ({
        url: '/admin/admin_verify_otp',
        method: 'POST',
        body: { adminId, otp },
      }),
    }),

    // Resend Admin OTP
    resendAdminOtp: builder.mutation({
      query: ({ adminId }) => ({
        url: '/admin/resend_admin_otp',
        method: 'POST',
        body: { adminId },
      }),
    }),

    // Update Admin Profile
    updateAdminProfile: builder.mutation({
      query: ({ adminId, profileData }) => ({
        url: `/admin/update/${adminId}`,
        method: 'PUT',
        body: profileData,
      }),
    }),

     // ✅ New: Get All Users
    getAllUsers: builder.query({
      query: () => '/admin/all_users',
    }),

    // ✅ Delete User by Admin
    deleteUserByAdmin: builder.mutation({
      query: ({ userId }) => ({
        url: `/admin/delete-user/${userId}`,
        method: 'DELETE',
      }),
    }),

   // ✅ New: Get All Vendors
    getAllVendors: builder.query({
      query: () => '/admin/all_vendors',
    }),

    // Approve Vendor
    approveVendor: builder.mutation({
      query: ({ vendorId }) => ({
        url: `/admin/approve/${vendorId}`,
        method: 'PUT',
      }),
    }),

  // Get Pending Vendors
     // ✅ Add this endpoint:
    getPendingVendors: builder.query({
      query: () => '/admin/pending_vendor', // Make sure this matches your backend route
    }),

    // Delete Vendor
    deleteVendorByAdmin: builder.mutation({
      query: ({ vendorId }) => ({
        url: `/admin/delete-vendor/${vendorId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export RTK Query hooks
export const {
  useRegisterAdminMutation,
  useLoginAdminMutation,
  useVerifyAdminOtpMutation,
  useResendAdminOtpMutation,
  useUpdateAdminProfileMutation,
  useGetPendingVendorsQuery, // <- Make sure this line is present
  useGetAllVendorsQuery, // ✅ Added export for use in components
  useGetAllUsersQuery,
  useApproveVendorMutation,
  useDeleteVendorByAdminMutation,
  useDeleteUserByAdminMutation, // ✅ New hook
} = adminApi;
