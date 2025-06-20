import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  totalPlanned: 0,
  totalSpent: 0,
  totalBookingsCount: 0,
  loading: false,
  error: null,
  selectedBooking: null,
  availableVendors: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Set all bookings
    setBookings: (state, action) => {
      state.bookings = action.payload.bookings || [];
      state.totalPlanned = action.payload.totalPlanned || 0;
      state.totalSpent = action.payload.totalSpent || 0;
      state.totalBookingsCount = action.payload.totalBookingsCount || 0;
      state.loading = false;
      state.error = null;
    },
    
    // Set selected booking
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    
    // Add a booking locally (optimistic update)
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
      state.totalPlanned += action.payload.plannedAmount;
      state.totalSpent += action.payload.spentAmount || 0;
      state.totalBookingsCount += 1;
    },
    
    // Update a booking locally (optimistic update)
    updateBooking: (state, action) => {
      const { _id, plannedAmount, spentAmount } = action.payload;
      const bookingIndex = state.bookings.findIndex(booking => booking._id === _id);
      
      if (bookingIndex !== -1) {
        const oldPlanned = state.bookings[bookingIndex].plannedAmount;
        const oldSpent = state.bookings[bookingIndex].spentAmount || 0;
        
        state.bookings[bookingIndex] = action.payload;
        
        // Update totals
        state.totalPlanned = state.totalPlanned - oldPlanned + plannedAmount;
        state.totalSpent = state.totalSpent - oldSpent + (spentAmount || 0);
      }
    },
    
    // Remove a booking locally (optimistic update)
    removeBooking: (state, action) => {
      const bookingId = action.payload;
      const bookingIndex = state.bookings.findIndex(booking => booking._id === bookingId);
      
      if (bookingIndex !== -1) {
        state.totalPlanned -= state.bookings[bookingIndex].plannedAmount;
        state.totalSpent -= state.bookings[bookingIndex].spentAmount || 0;
        state.bookings.splice(bookingIndex, 1);
        state.totalBookingsCount -= 1;
      }
    },
    
    // Set available vendors
    setAvailableVendors: (state, action) => {
      state.availableVendors = action.payload;
    },
    
    // Set loading state
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Set error state
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetBookingState: () => initialState,
  },
});

export const {
  setBookings,
  setSelectedBooking,
  addBooking,
  updateBooking,
  removeBooking,
  setAvailableVendors,
  setLoading,
  setError,
  clearError,
  resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer; 