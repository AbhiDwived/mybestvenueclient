import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const authApi = createApi({
  reducerPath: 'authApi',
baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Verify OTP after registration
    verifyOtp: builder.mutation({
      query: ({ userId, otp }) => ({
        url: '/user/verify-otp',
        method: 'POST',
        body: { userId, otp },
      }),
    }),

    // Resend OTP for registration
    resendOtp: builder.mutation({
      query: ({ userId }) => ({
        url: '/user/resend-otp',
        method: 'POST',
        body: { userId },
      }),
    }),

    // Login User
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation({
      query: (emailData) => ({
        url: '/user/forgot_password',
        method: 'POST',
        body: emailData,
      }),
    }),

    // Verify OTP for password reset
    verifyPasswordReset: builder.mutation({
      query: ({ userId, otp }) => ({
        url: '/user/verify_password_reset',
        method: 'POST',
        body: { userId, otp },
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ userId, newPassword }) => ({
        url: '/user/reset_password',
        method: 'POST',
        body: { userId, newPassword },
      }),
    }),

    // Update Profile
    updateProfile: builder.mutation({
      query: ({ userId, profileData }) => ({
        url: `/user/update-profile/${userId}`,
        method: 'PUT',
        body: profileData,
      }),
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/user/delete-user/${userId}`,
        method: 'DELETE',
      }),
    }),

    // Logout User
    logoutUser: builder.mutation({
      query: () => ({
        url: '/user/logout',
        method: 'POST'
      })
    })
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
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useLogoutUserMutation,
} = authApi;