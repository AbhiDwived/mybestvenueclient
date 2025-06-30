import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const vendorApi = createApi({
  reducerPath: 'vendorApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1', // Updated URL with v1 prefix
    prepareHeaders: (headers, { getState, endpoint }) => {
      // List of public endpoints that don't require authentication
      const publicEndpoints = [
        'forgotPassword',
        'verifyOtp',
        'resendOtp',
        'loginVendor',
        'registerVendor',
        'verifyPasswordReset',
        'resendPasswordResetOtp'
      ];

      // Skip adding token for public endpoints
      if (publicEndpoints.includes(endpoint)) {
        return headers;
      }

      // Try to get token from Redux state first
      const token = getState().vendor?.token;
      // Try vendor token from localStorage
      const vendorToken = localStorage.getItem('vendorToken');
      // Try admin token from localStorage (for admin operations on vendors)
      const adminToken = localStorage.getItem('adminToken');
      // Regular user token as last resort
      const userToken = localStorage.getItem('token');
      
      // Use the first available token
      const finalToken = token || vendorToken || adminToken || userToken;
      
      if (finalToken) {
        console.log('Using token for vendor API call:', finalToken.substring(0, 10) + '...');
        headers.set('Authorization', `Bearer ${finalToken}`);
      } else {
        console.warn('No token found for vendor API call');
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
        console.log('Fetching vendor profile for ID:', vendorId);
        return {
          url: `/vendor/vendorbyId/${vendorId}`,
          method: 'GET',
        };
      },
      transformResponse: (response, meta, arg) => {
        console.log('Vendor profile API response:', response);
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error('Vendor profile API error:', response);
        return response;
      }
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
      query: (formData) => ({
        url: '/vendor/portfolio/image',
        method: 'POST',
        body: formData,
        formData: true,
      }),
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
        console.log('Video Upload Response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Video Upload Error:', response);
        return response;
      }
    }),

    // Get Portfolio Videos
    getPortfolioVideos: builder.query({
      query: (vendorId) => {
        console.log('Fetching portfolio videos for vendor:', vendorId);
        return {
        url: `/vendor/portfolio/videos/${vendorId}`,
        method: 'GET',
        };
      },
      transformResponse: (response) => {
        console.log('Portfolio Videos API response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Portfolio Videos API error:', response);
        return response;
      }
    }),

    // Delete Portfolio Video
    deletePortfolioVideo: builder.mutation({
      query: (videoId) => ({
        url: `/vendor/portfolio/video/${videoId}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => {
        console.log('Video Delete Response:', response);
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Video Delete Error:', response);
        return response;
      }
    }),

    // Resend Password Reset OTP
    resendPasswordResetOtp: builder.mutation({
      query: ({ email }) => ({
        url: '/vendor/resend-forgot-password-otp',
        method: 'POST',
        body: { email },
      }),
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
  useResendPasswordResetOtpMutation
} = vendorApi;