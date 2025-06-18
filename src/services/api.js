import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice';
import { logoutVendor } from '../features/vendors/vendorSlice';

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  credentials: 'include', // Required for cookies
  prepareHeaders: (headers, { getState }) => {
    // Add required headers for CORS
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    const state = getState();
    const userToken = state.auth?.token;
    const vendorToken = state.vendor?.token;

    const token = userToken || vendorToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    // Add origin for CORS validation
    if (typeof window !== 'undefined') {
      headers.set('Origin', window.location.origin);
    }

    return headers;
  },
});

// Extended base query with refresh/reauth logic and error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  try {
    let result = await baseQuery(args, api, extraOptions);

    // Handle various error cases
    if (result?.error) {
      // Handle 401 Unauthorized
      if (result.error.status === 401) {
        const state = api.getState();
        if (state.vendor?.isAuthenticated) {
          api.dispatch(logoutVendor());
          window.location.href = '/vendor/login';
        } else {
          api.dispatch(logout());
          window.location.href = '/user/login';
        }
      }
      
      // Handle CORS errors
      if (result.error.status === 'FETCH_ERROR' || result.error.status === 403) {
        console.error('API Error:', {
          status: result.error.status,
          message: result.error.message,
          data: result.error.data
        });
      }
    }

    return result;
  } catch (error) {
    console.error('API Request Failed:', error);
    return {
      error: {
        status: 'FETCH_ERROR',
        message: 'Failed to connect to the server. Please check your connection.',
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Vendor',
    'Auth',
    'Inquiry',
    'Review',
    'Blog',
    'Community',
    'WeddingVenue',
    'WeddingVendor',
    'Bride',
    'Groom',
    'Budget',
    'Checklist',
    'Guest',
    'Subscription',
  ],
  endpoints: () => ({}),
});
