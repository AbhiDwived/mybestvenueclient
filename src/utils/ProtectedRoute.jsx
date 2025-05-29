import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

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

  // Log vendor approval status for debugging
  console.log('vendorAuth.vendor:', vendorAuth.vendor);
  console.log('vendorAuth.vendor.isApproved:', vendorAuth.vendor?.isApproved);

  let isAuthenticated = false;
  let currentRole = null;

  // Check admin first (highest priority)
  if (adminAuth.isAuthenticated && adminAuth.admin) {
    isAuthenticated = true;
    currentRole = adminAuth.admin.role || 'admin';
  }
  // Then check vendor
  else if (vendorAuth.isAuthenticated && vendorAuth.vendor) {
    isAuthenticated = true;
    currentRole = vendorAuth.vendor.role || 'vendor';

    // Check if vendor is approved
    if (allowedRoles.includes('vendor') && !vendorAuth.vendor.isApproved) {
      console.log('Vendor is not approved. Redirecting to /not-approved');
      return <Navigate to="/not-approved" replace />;
    }
  }
  // Then check user
  else if (userAuth.isAuthenticated && userAuth.user) {
    isAuthenticated = true;
    currentRole = userAuth.user.role || 'user';
  }

  // Debug logs
  console.log('userAuth:', userAuth);
  console.log('vendorAuth:', vendorAuth);
  console.log('adminAuth:', adminAuth);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('currentRole:', currentRole);

  // Not authenticated, redirect to login page based on first allowed role or default to user login
  if (!isAuthenticated) {
    const redirectTo = loginRedirects[allowedRoles[0]] || '/user/login';
    return <Navigate to={redirectTo} replace />;
  }

  // Authenticated but role not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Authorized — render children or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
