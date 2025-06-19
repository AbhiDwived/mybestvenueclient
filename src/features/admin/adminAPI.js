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

    // ✅ Get All Users
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

    // ✅ Get All Vendors
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
    getPendingVendors: builder.query({
      query: () => '/admin/pending_vendor',
    }),

    // Delete Vendor
    deleteVendorByAdmin: builder.mutation({
      query: ({ vendorId }) => ({
        url: `/admin/delete-vendor/${vendorId}`,
        method: 'DELETE',
      }),
    }),

    // ✅ Activity Endpoints — UPDATED to use /activity instead of /admin
    getRecentActivities: builder.query({
      query: () => '/activity/recent', // ✅ Updated
    }),

    getActivityStats: builder.query({
      query: () => '/activity/stats', // ✅ Updated
    }),

    searchActivities: builder.query({
      query: (query) => `/activity/search?query=${encodeURIComponent(query)}`, // ✅ Updated
    }),

    deleteActivity: builder.mutation({
      query: ({ id }) => ({
        url: `/activity/activity/${id}`, // ✅ Use consistent naming
        method: 'DELETE',
      }),
    }),

    bulkDeleteActivities: builder.mutation({
      query: (body) => ({
        url: '/activity/bulk-delete', // ✅ Updated
        method: 'POST',
        body,
      }),
    }),

       //UserContact---Get
       getAllMessage: builder.query({
        query: ({ page = 1, limit = 10 }) => ({
          url: "/user/contacts",
          method: "GET",
          params: { page, limit },
        }),
      }),

  }),
});

// Export hooks
export const {
  useRegisterAdminMutation,
  useGetAllMessageQuery,
  useLoginAdminMutation,
  useVerifyAdminOtpMutation,
  useResendAdminOtpMutation,
  useUpdateAdminProfileMutation,

  useGetAllUsersQuery,
  useDeleteUserByAdminMutation,

  useGetAllVendorsQuery,
  useGetPendingVendorsQuery,
  useApproveVendorMutation,
  useDeleteVendorByAdminMutation,

  // ✅ Activity Hooks
  useGetRecentActivitiesQuery,
  useGetActivityStatsQuery,
  useSearchActivitiesQuery,
  useDeleteActivityMutation,
  useBulkDeleteActivitiesMutation,
} = adminApi;