import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const loginRedirects = {
  user: '/user/login',
  vendor: '/vendor/login',
  admin: '/admin/login',
};

const ProtectedRoute = ({ allowedRoles = [] }) => {
  // Get auth slices from Redux
  const userAuth = useSelector((state) => state.auth || {});
  const vendorAuth = useSelector((state) => state.vendor || {});
  const adminAuth = useSelector((state) => state.adminAuth || {});

  let isAuthenticated = false;
  let currentRole = null;
  let currentUser = null;

  // Check admin first (highest priority)
  if (adminAuth.isAuthenticated && adminAuth.admin) {
    isAuthenticated = true;
    currentRole = 'admin';
    currentUser = adminAuth.admin;
  }
  // Then check vendor
  else if (vendorAuth.isAuthenticated && vendorAuth.vendor) {
    isAuthenticated = true;
    currentRole = 'vendor';
    currentUser = vendorAuth.vendor;

    // Check if vendor is approved
    if (allowedRoles.includes('vendor') && !vendorAuth.vendor.isApproved) {
      return <Navigate to="/not-approved" replace />;
    }
  }
  // Then check user
  else if (userAuth.isAuthenticated && userAuth.user) {
    isAuthenticated = true;
    currentRole = 'user';
    currentUser = userAuth.user;
  }

  // Not authenticated, redirect to login page based on first allowed role or default to user login
  if (!isAuthenticated) {
    const redirectTo = loginRedirects[allowedRoles[0]] || '/user/login';
    return <Navigate to={redirectTo} replace />;
  }

  // Authenticated but role not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    // Redirect to their respective dashboard instead of a generic unauthorized page
    switch (currentRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      case 'user':
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Authorized — render children or nested routes
  return <Outlet />;
};

export default ProtectedRoute;
