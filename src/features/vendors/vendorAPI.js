import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

export const vendorApi = createApi({
  reducerPath: 'vendorApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('vendorToken');  // Change to vendorToken
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
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
      query: ({ email, otp }) => ({
        url: '/vendor/forgot_password_otp',
        method: 'POST',
        body: { email, otp },
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ email, newPassword }) => ({
        url: '/vendor/reset_password',
        method: 'POST',
        body: { email, newPassword },
      }),
    }),

    // Update Vendor Profile
    updateProfile: builder.mutation({
      query: ({ vendorId, profileData }) => ({
        url: `/vendor/update/${vendorId}`,
        method: 'PUT',
        body: profileData,
        // Add proper headers for multipart form data
        formData: true,
      }),
      // Transform the response to ensure we get the updated vendor data
      transformResponse: (response) => {
        if (response.success && response.vendor) {
          return response.vendor;
        }
        return response;
      },
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
      query: (vendorId) => {
        // Validate the ID before making the request
        if (!vendorId || vendorId === 'undefined' || vendorId === 'null') {
          throw new Error('Invalid vendor ID');
        }
        return {
          url: `/vendor/vendorbyId/${vendorId}`,
          method: 'GET',
        };
      },
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
    
    // update vendor Booking
    updateVendorBooking: builder.mutation({
      query: ({ bookingId, bookingData }) => ({
        url: `/booking/updateVendorBooking/${bookingId}`,
        method: 'PUT',
        body: bookingData,
      }),
      invalidatesTags: ['Bookings'],
    }),

    // Add the new public vendors endpoint
    getAllPublicVendors: builder.query({
      query: () => '/admin/all_vendors',
      transformResponse: (response) => {
        if (response.vendors) {
          // Extract unique categories
          const categories = [...new Set(response.vendors.map(vendor => vendor.vendorType))];
          return {
            vendors: response.vendors,
            categories: categories,
            locations: response.locations || []
          };
        }
        return response;
      },
    }),
    // getUser list by UserId
    getUserListById: builder.query({
      query: (userId) => ({
        url: `/vendor/getUserListByUserId/${userId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      // providesTags: ['Bookings'],
    }),
    createuserBookingByVendor: builder.mutation({
      query: (bookingData) => ({
        url: `/vendor/createuserBookingbyVendor`,
        method: 'POST',
        body:  bookingData,
      }),
    }),

    // Portfolio management endpoints
    uploadPortfolioImage: builder.mutation({
      query: (formData) => {
        // Retrieve token from multiple sources
        let token = null;
        
        // Try Redux store (if available)
        try {
          const store = require('../../app/store').default;
          token = store.getState().vendor?.token || 
                  store.getState().auth?.token;
        } catch (storeError) {
          // Silently handle store access error
        }
        
        // Fallback to localStorage
        token = token || 
                localStorage.getItem('vendorToken') || 
                localStorage.getItem('adminToken') || 
                localStorage.getItem('token');

        // Prepare headers
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        return {
          url: '/vendor/portfolio/image',
          method: 'POST',
          body: formData,
          formData: true,
          headers,
        };
      },
    }),

    getPortfolioImages: builder.query({
      query: (vendorId) => ({
        url: `/vendor/portfolio/images/${vendorId}`,
        method: 'GET',
      }),
      providesTags: ['PortfolioImages'],
    }),

    deletePortfolioImage: builder.mutation({
      query: (imageId) => ({
        url: `/vendor/portfolio/image/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PortfolioImages'],
    }),

    // Upload Portfolio Video
    uploadPortfolioVideo: builder.mutation({
      query: (videoData) => {
        // If videoData is a FormData object (file upload)
        if (videoData instanceof FormData) {
          return {
        url: '/vendor/portfolio/video',
        method: 'POST',
        body: videoData,
            // Important: let fetch set the correct Content-Type for FormData
            headers: {
              // No explicit Content-Type to allow browser to set with boundary
              'Accept': 'application/json'
            }
          };
        }
        
        // If videoData is a regular object (URL upload)
        return {
          url: '/vendor/portfolio/video',
          method: 'POST',
          body: videoData
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),

    // Get Portfolio Videos
    getPortfolioVideos: builder.query({
      query: (vendorId) => {
        return {
        url: `/vendor/portfolio/videos/${vendorId}`,
        method: 'GET',
        };
      },
    }),

    // Delete Portfolio Video
    deletePortfolioVideo: builder.mutation({
      query: (videoId) => ({
        url: `/vendor/portfolio/video/${videoId}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => {
        return response;
      },
    }),

    // Resend Password Reset OTP
    resendPasswordResetOtp: builder.mutation({
      query: ({ email }) => ({
        url: '/vendor/resend-forgot-password-otp',
        method: 'POST',
        body: { email },
      }),
    }),

    // Resend Vendor OTP
    resendVendorOtp: builder.mutation({
      query: (vendorId) => ({
        url: '/vendor/resendvendor-otp',
        method: 'POST',
        body: { vendorId },
      }),
    }),

  //get latest vendor type Data
    getlatestVendorTypeData: builder.query({
      query: () => ({
        url: `/vendor/getlatestvendorType`,
        method: 'GET',
      }),
      // providesTags: ['PortfolioImages'],
    }),
  })
});

export const resendVendorOtpAPI = (vendorId) => {
  return axios.post(`/api/v1/vendor/resendvendor-otp`, { vendorId });
};


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
  useUpdateVendorBookingMutation,
  useGetAllPublicVendorsQuery,
  useGetUserListByIdQuery,
  useCreateuserBookingByVendorMutation,
  useUploadPortfolioImageMutation,
  useGetPortfolioImagesQuery,
  useDeletePortfolioImageMutation,
  useUploadPortfolioVideoMutation,
  useGetPortfolioVideosQuery,
  useDeletePortfolioVideoMutation,
  useResendPasswordResetOtpMutation,
  useResendVendorOtpMutation,
  useGetlatestVendorTypeDataQuery
} = vendorApi;