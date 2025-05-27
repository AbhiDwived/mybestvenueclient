import { configureStore } from '@reduxjs/toolkit';

// Import slices
import authReducer from '../features/auth/authSlice';
import vendorReducer from '../features/vendors/vendorSlice'; // ✅ Vendor slice
import adminReducer from '../features/admin/adminSlice'; // ✅ Admin slice

// Import RTK Query APIs
import { apiSlice } from '../services/api';               // optional
import { vendorApi } from '../features/vendors/vendorAPI';
import { authApi } from '../features/auth/authAPI';
import { adminApi } from '../features/admin/adminAPI';    // ✅ Admin API

export default configureStore({
  reducer: {
    auth: authReducer,
   vendor: vendorReducer, // ✅ Changed from vendorAuth to vendor
    adminAuth: adminReducer,                             // ✅ Add admin reducer

    // RTK Query reducers
    [apiSlice.reducerPath]: apiSlice.reducer,            // optional
    [vendorApi.reducerPath]: vendorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,            // ✅ Add admin API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(apiSlice.middleware)                       // optional
      .concat(vendorApi.middleware)
      .concat(authApi.middleware)
      .concat(adminApi.middleware),                      // ✅ Add admin API middleware
});
