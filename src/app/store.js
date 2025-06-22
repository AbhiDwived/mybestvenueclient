import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import slices
import authReducer from '../features/auth/authSlice';
import vendorReducer from '../features/vendors/vendorSlice'; // ✅ Vendor slice
import adminReducer from '../features/admin/adminSlice'; // ✅ Admin slice
import budgetReducer from '../features/budget/budgetSlice'; // Budget slice
import bookingReducer from '../features/bookings/bookingSlice'; // Booking slice
import checklistReducer from '../features/checklist/checklistSlice'; // Checklist slice
import savedVendorReducer from '../features/savedVendors/savedVendorSlice'; // Saved Vendor slice
import guestReducer from '../features/guests/guestSlice'; // Guest slice

// Import RTK Query APIs
import { apiSlice } from '../services/api';               // optional
import { vendorApi } from '../features/vendors/vendorAPI';
import { authApi } from '../features/auth/authAPI';
import { adminApi } from '../features/admin/adminAPI';    // ✅ Admin API
import { blogsApi } from '../features/blogs/blogsAPI';  // Added blogsApi import
import { budgetApi } from '../features/budget/budgetAPI';  // Budget API
import { bookingApi } from '../features/bookings/bookingAPI';  // Booking API
import { checklistApi } from '../features/checklist/checklistAPI';  // Checklist API
import { savedVendorApi } from '../features/savedVendors/savedVendorAPI';  // Saved Vendor API
import { guestApi } from '../features/guests/guestAPI';  // Guest API
import { subscriberApi } from '../features/subscribers/subscriberAPI';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vendor: vendorReducer, // ✅ Changed from vendorAuth to vendor
    adminAuth: adminReducer,                             // ✅ Add admin reducer
    budget: budgetReducer,                               // Budget reducer
    booking: bookingReducer,                             // Booking reducer
    checklist: checklistReducer,                         // Checklist reducer
    savedVendor: savedVendorReducer,                     // Saved Vendor reducer
    guest: guestReducer,                                 // Guest reducer

    // RTK Query reducers
    [apiSlice.reducerPath]: apiSlice.reducer,            // optional
    [vendorApi.reducerPath]: vendorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,            // ✅ Add admin API reducer
    [blogsApi.reducerPath]: blogsApi.reducer,            // Added blogsApi reducer
    [budgetApi.reducerPath]: budgetApi.reducer,          // Budget API reducer
    [bookingApi.reducerPath]: bookingApi.reducer,        // Booking API reducer
    [checklistApi.reducerPath]: checklistApi.reducer,    // Checklist API reducer
    [savedVendorApi.reducerPath]: savedVendorApi.reducer, // Saved Vendor API reducer
    [guestApi.reducerPath]: guestApi.reducer,            // Guest API reducer
    [subscriberApi.reducerPath]: subscriberApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(apiSlice.middleware)                       // optional
      .concat(vendorApi.middleware)
      .concat(authApi.middleware)
      .concat(adminApi.middleware)                      // ✅ Add admin API middleware
      .concat(blogsApi.middleware)                      // Added blogsApi middleware
      .concat(budgetApi.middleware)                     // Budget API middleware
      .concat(bookingApi.middleware)                    // Booking API middleware
      .concat(checklistApi.middleware)                  // Checklist API middleware
      .concat(savedVendorApi.middleware)                // Saved Vendor API middleware
      .concat(guestApi.middleware)                     // Guest API middleware
      .concat(subscriberApi.middleware),
});

setupListeners(store.dispatch);
