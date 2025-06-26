import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
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
  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
    }),

    //getUserProfile
    getUserProfile: builder.query({
      query: () => `user/UserProfile`,
    }),

    // Get specific user profile by ID
    getUserProfileById: builder.query({
      query: (userId) => ({
        url: `user/profile/${userId}`,
        method: 'GET',
      }),
    }),

    // Verify OTP after registration
    verifyOtp: builder.mutation({
      query: ({ userId, otp }) => ({
        url: "/user/verify-otp",
        method: "POST",
        body: { userId, otp },
      }),
    }),

    // Resend OTP for registration
    resendOtp: builder.mutation({
      query: ({ userId }) => ({
        url: "/user/resend-otp",
        method: "POST",
        body: { userId },
      }),
    }),

    // Login User
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: "/user/forgot_password",
        method: "POST",
        body: emailData,
      }),
    }),

    // Verify OTP for password reset
    verifyPasswordReset: builder.mutation({
      query: ({ userId, otp }) => ({
        url: "/user/verify_password_reset",
        method: "POST",
        body: { userId, otp },
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ userId, newPassword }) => ({
        url: "/user/reset_password",
        method: "POST",
        body: { userId, newPassword },
      }),
    }),

    // Update Password
    updatePassword: builder.mutation({
      query: ({ userId, currentPassword, newPassword }) => ({
        url: `/user/update-password/${userId}`,
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
    }),

    // Update Profile
    updateProfile: builder.mutation({
      query: ({ userId, profileData }) => ({
        url: `/user/update-profile/${userId}`,
        method: "PUT",
        body: profileData,
      }),
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/user/delete/${userId}`,
        method: "DELETE",
      }),
    }),

    // Logout User
    logoutUser: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),
    // User Inquiries
    getUserInquiries: builder.mutation({
      query: (userId) => ({
        url: "/user/getuser_inquiryList",
        method: "POST",
        body: { userId },
      }),
    }),

    //add user Inquiry
    addUserInquiryMessage: builder.mutation({
      query: ({userId,vendorId,message,name,phone,email,weddingDate}) => ({
     url: `/user/userInquiryMessage`,
     method: "POST",
     body: {userId, vendorId,message,name,phone,email,weddingDate },
   }),
   }),

    //UserContact---POST
    submitContactForm: builder.mutation({
      query: (userData) => ({
        url: "/user/contact",
        method: "POST",
        body: userData,
      }),
    }),

    // Send User Reply
    sendUserReply: builder.mutation({
      query: ({ userId, vendorId, message }) => ({
        url: `/user/userInquiryMessage`,
        method: "POST",
        body: { userId, vendorId, message },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useRegisterUserMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useVerifyPasswordResetMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useLogoutUserMutation,
  useGetUserInquiriesMutation,
  useSendUserReplyMutation,
  useSubmitContactFormMutation,
  useGetUserProfileQuery,
  useGetUserProfileByIdQuery,
  useAddUserInquiryMessageMutation,
} = authApi;
