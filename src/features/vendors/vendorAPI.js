import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const vendorApi = createApi({
  reducerPath: 'vendorApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL ,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().vendor.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Register Vendor
    registerVendor: builder.mutation({
      query: (vendorData) => ({
        url: '/vendor/register',
        method: 'POST',
        body: vendorData,
      }),
    }),

    // Verify OTP after registration
    verifyOtp: builder.mutation({
      query: ({ vendorId, otp }) => ({
        url: '/vendor/vendorverify-otp',
        method: 'POST',
        body: { vendorId, otp },
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation({
      query: ({ vendorId }) => ({
        url: '/vendor/resend-otp',
        method: 'POST',
        body: { vendorId },
      }),
    }),

    // Vendor Login
    loginVendor: builder.mutation({
      query: (credentials) => ({
        url: '/vendor/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Forgot Password (send OTP)
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: '/vendor/forgot-password',
        method: 'POST',
        body: emailData,
      }),
    }),

    // Verify OTP for Password Reset
    verifyPasswordReset: builder.mutation({
      query: ({ vendorId, otp }) => ({
        url: '/vendor/forgot_password_otp',
        method: 'POST',
        body: { vendorId, otp },
      }),
    }),


    // Reset Password
    resetPassword: builder.mutation({
      query: ({ vendorId, newPassword }) => ({
        url: '/vendor/reset_password',
        method: 'POST',
        body: { vendorId, newPassword },
      }),
    }),


    // Update Vendor Profile
    updateProfile: builder.mutation({
      query: ({ vendorId, profileData }) => ({
        url: `/vendor/update/${vendorId}`,
        method: 'PUT',
        body: profileData,
      }),
    }),

    // Delete Vendor
    deleteVendor: builder.mutation({
      query: ({ vendorId }) => ({
        url: `/vendor/delete/${vendorId}`,
        method: 'DELETE',
      }),
    }),

    // Logout Vendor
    logoutVendor: builder.mutation({
      query: () => ({
        url: '/vendor/logout',
        method: 'POST',
      }),
    }),

    // Get Vendor BY Id
    getVendorById: builder.query({
      query: (vendorId) => ({
        url: `/vendor/vendor/${vendorId}`,
        method: 'GET',
      }),
    }),

    // Get vendor inquiry list
    userInquiryList: builder.query({
      query: (vendorId) => ({
        url: `/vendor/replied-inquiries`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['Inquiries'],
    }),

    // Handle user inquiry reply
    userInquiryReply: builder.mutation({
      query: ({ userId, messageId, vendorId, message }) => ({
        url: `/vendor/inquiry-reply/${vendorId}`,
        method: 'POST',
        body: { message, userId, messageId },
      }),
      invalidatesTags: ['Inquiries'],
    }),
    
    addservicesPackage: builder.mutation({
      query: ({ vendorId, packageName, services, description, price, offerPrice }) => ({
        url: `/vendor/addservicesPackage`,
        method: 'POST',
        body: { vendorId, packageName, services, description, price, offerPrice },
      }),
    }),


    updateservicesPackage: builder.mutation({
      query: ({ packageId, ...data }) => ({
        url: `/vendor/updateservicesPackage/${packageId}`,
        method: 'PUT',
        body: data,
      }),
    }),


    vendorservicesPackageList: builder.mutation({
      query: ({ vendorId }) => ({
        url: `/vendor/vendorservicesPackageList/${vendorId}`,
        method: 'GET',

      }),
    }),
     deleteServicePackages: builder.mutation({
      query: ({ packageId }) => ({
        url: `/vendor/updateservicesPackage/${packageId}`,
        method: 'DELETE',

      }),
    }),
    addFaq: builder.mutation({
      query: ({ vendorId, question, answer}) => ({
        url: `/vendor/addfaq`,
        method: 'POST',
        body: { vendorId, question, answer},
      }),
    }),
    getVendorsFaqs: builder.mutation({
      query: ({ vendorId,}) => ({
        url: `/vendor/getfaqsbyVendor/${vendorId}`,
        method: 'GET',
        
      }),
    }),
    
    // Get vendor bookings list
    getVendorBookingsList: builder.query({
      query: (vendorId) => ({
        url: `/booking/getvendorBookings/${vendorId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['Bookings'],
    }),
    
  })
});



// Export hooks for usage in components
export const {
  useRegisterVendorMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginVendorMutation,
  useForgotPasswordMutation,
  useVerifyPasswordResetMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useDeleteVendorMutation,
  useLogoutVendorMutation,
  useGetVendorByIdQuery,
  useUserInquiryListQuery,
  useUserInquiryReplyMutation,
  useAddFaqMutation,
  useGetVendorsFaqsMutation,
  useAddservicesPackageMutation,
  useUpdateservicesPackageMutation,
  useVendorservicesPackageListMutation,
  useDeleteServicePackagesMutation,
  useGetVendorBookingsListQuery,
} = vendorApi;