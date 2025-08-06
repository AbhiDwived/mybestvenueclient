import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../features/auth/authSlice';
import { setVendorCredentials, logoutVendor } from '../features/vendors/vendorSlice';
import { setCredentials as setAdminCredentials, logout as logoutAdmin } from '../features/admin/adminSlice';

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  credentials: 'include', // Required for cookies
  prepareHeaders: (headers, { getState }) => {
    // Add required headers for CORS
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    // Get tokens based on user type
    const userToken = getState().auth.token;
    const vendorToken = getState().vendor.token;
    const adminToken = getState().adminAuth.token;

    // Set the appropriate token
    if (userToken) {
      headers.set('Authorization', `Bearer ${userToken}`);
    } else if (vendorToken) {
      headers.set('Authorization', `Bearer ${vendorToken}`);
    } else if (adminToken) {
      headers.set('Authorization', `Bearer ${adminToken}`);
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
  let result = await baseQuery(args, api, extraOptions);
  const state = api.getState();

  if (result.error && result.error.status === 401) {
    console.log('🔒 401 Unauthorized - attempting token refresh');
    
    const refreshEndpoint = determineRefreshEndpoint(state);
    const refreshToken = getRefreshToken(state);
    
    if (refreshEndpoint && refreshToken) {
      // Try to get a new token
      const refreshResult = await baseQuery(
        { 
          url: refreshEndpoint,
          method: 'POST',
          body: { refreshToken }
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        console.log('✅ Token refreshed successfully');
        // Store the new token
        const userType = determineUserType(state);
        switch (userType) {
          case 'user':
            api.dispatch(setCredentials(refreshResult.data));
            break;
          case 'vendor':
            api.dispatch(setVendorCredentials(refreshResult.data));
            break;
          case 'admin':
            api.dispatch(setAdminCredentials(refreshResult.data));
            break;
        }

        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log('❌ Token refresh failed - logging out');
        // Logout based on user type
        switch (determineUserType(state)) {
          case 'user':
            api.dispatch(logout());
            break;
          case 'vendor':
            api.dispatch(logoutVendor());
            break;
          case 'admin':
            api.dispatch(logoutAdmin());
            break;
        }
      }
    } else {
      console.log('❌ No refresh token available - logging out');
      // No refresh token available, logout immediately
      switch (determineUserType(state)) {
        case 'user':
          api.dispatch(logout());
          break;
        case 'vendor':
          api.dispatch(logoutVendor());
          break;
        case 'admin':
          api.dispatch(logoutAdmin());
          break;
      }
    }
  }
  return result;
};

// Helper functions
const determineUserType = (state) => {
  if (state.auth.isAuthenticated) return 'user';
  if (state.vendor.isAuthenticated) return 'vendor';
  if (state.adminAuth.isAuthenticated) return 'admin';
  return null;
};

const determineRefreshEndpoint = (state) => {
  const userType = determineUserType(state);
  switch (userType) {
    case 'user':
      return '/user/refresh-token';
    case 'vendor':
      return '/vendor/refresh-token';
    case 'admin':
      return '/admin/refresh-token';
    default:
      return null;
  }
};

const getRefreshToken = (state) => {
  const userType = determineUserType(state);
  switch (userType) {
    case 'user':
      return localStorage.getItem('refreshToken');
    case 'vendor':
      return localStorage.getItem('vendorRefreshToken');
    case 'admin':
      return localStorage.getItem('adminRefreshToken');
    default:
      return null;
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

// Export the api instance for use in other files
export const api = apiSlice;
