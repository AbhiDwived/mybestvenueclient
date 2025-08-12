import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// Utility function to validate JWT token
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp && payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

const loginRedirects = {
  user: '/user/login',
  vendor: '/vendor/login',
  admin: '/admin/login',
};

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  // Get auth slices from Redux
  const userAuth = useSelector((state) => state.auth || {});
  const vendorAuth = useSelector((state) => state.vendor || {});
  const adminAuth = useSelector((state) => state.adminAuth || {});

  // Check for admin edit mode
  const adminEditData = localStorage.getItem('adminEditingVendor');
  const isAdminEditMode = adminEditData && JSON.parse(adminEditData)?.isAdminEdit;

  let isAuthenticated = false;
  let currentRole = null;

  // Check admin first (highest priority)
  if (adminAuth.isAuthenticated && adminAuth.admin && isTokenValid(adminAuth.token)) {
    isAuthenticated = true;
    currentRole = adminAuth.admin.role || 'admin';
  }
  // Then check vendor
  else if (vendorAuth.isAuthenticated && vendorAuth.vendor && isTokenValid(vendorAuth.token)) {
    isAuthenticated = true;
    currentRole = vendorAuth.vendor.role || 'vendor';

    // Check if vendor is approved
    if (allowedRoles.includes('vendor') && !vendorAuth.vendor.isApproved) {
      return <Navigate to="/not-approved" replace />;
    }
  }
  // Then check user
  else if (userAuth.isAuthenticated && userAuth.user && isTokenValid(userAuth.token)) {
    isAuthenticated = true;
    currentRole = userAuth.user.role || 'user';
  }

  // Not authenticated, redirect to login page based on first allowed role or default to user login
  if (!isAuthenticated) {
    // Clear any stale data from localStorage to prevent confusion
    const hasStaleTokens = localStorage.getItem('token') || 
                          localStorage.getItem('adminToken') || 
                          localStorage.getItem('vendorToken');
    
    if (hasStaleTokens) {
      localStorage.clear();
      sessionStorage.clear();
    }
    
    const redirectTo = loginRedirects[allowedRoles[0]] || '/user/login';
    return <Navigate to={redirectTo} replace />;
  }

  // Special case: Allow admin to access vendor routes when in admin edit mode
  if (allowedRoles.includes('vendor') && currentRole === 'admin' && isAdminEditMode) {
    return children ? children : <Outlet />;
  }

  // Authenticated but role not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Authorized — render children or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
