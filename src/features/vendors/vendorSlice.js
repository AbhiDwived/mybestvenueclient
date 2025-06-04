
import { createSlice } from '@reduxjs/toolkit';


const loadVendorFromStorage = () => {
  try {
    const vendorStr = localStorage.getItem('vendor');
    const parsed = vendorStr ? JSON.parse(vendorStr) : null;
    if (parsed?._id && !parsed.id) {
      parsed.id = parsed._id;
    }
    // console.log("parsed",parsed)
    return parsed;
  } catch (e) {
    console.error("Failed to parse vendor data:", e);
    return null;
  }
};


const loadToken = () => localStorage.getItem('vendorToken') || null;

const initialVendor = loadVendorFromStorage();
const initialToken = loadToken();
// ##############################
const initialState = {
  vendor: initialVendor,
  token: initialToken,
  isAuthenticated: !!(initialVendor && initialToken),
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setVendorCredentials: (state, action) => {
      let { token, vendor } = action.payload;

      if (vendor && vendor.role !== 'vendor') {
        vendor = { ...vendor, role: 'vendor' };
      }

      state.token = token;
      state.vendor = vendor;
      state.isAuthenticated = true;

      localStorage.setItem('vendorToken', token);
      localStorage.setItem('vendor', JSON.stringify(vendor));
    },
    logoutVendor: (state) => {
      state.vendor = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendor');
    },
    clearVendorError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setVendorCredentials,
  logoutVendor,
  clearVendorError,
} = vendorSlice.actions;

export default vendorSlice.reducer;
