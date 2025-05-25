import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice';
import { logoutVendor } from '../features/vendors/vendorSlice';

// Base query setup
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  credentials: 'include', // if cookies are used
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const userToken = state.auth?.token;
    const vendorToken = state.vendorAuth?.token;

    const token = userToken || vendorToken;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

// Extended base query with refresh/reauth logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const state = api.getState();

    if (state.vendorAuth?.isAuthenticated) {
      api.dispatch(logoutVendor());
      window.location.href = '/vendor/login';
    } else {
      api.dispatch(logout());
      window.location.href = '/user/login';
    }
  }

  return result;
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