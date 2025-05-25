import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const loginRedirects = {
  user: '/user/login',
  vendor: '/vendor/login',
  admin: '/admin/login',
};

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  // Get auth states from Redux
  const userAuth = useSelector((state) => state.auth || {});
  const vendorAuth = useSelector((state) => state.vendor || {});
  const adminAuth = useSelector((state) => state.adminAuth || {});

  let isAuthenticated = false;
  let currentRole = null;

  // Detect admin
  if (adminAuth.isAuthenticated && adminAuth.admin) {
    isAuthenticated = true;
    // Use role from admin object if available, fallback to 'admin'
    currentRole = adminAuth.admin.role || 'admin';
  }
  // Detect vendor
  else if (vendorAuth.isAuthenticated && vendorAuth.vendor) {
    isAuthenticated = true;
    // Use role from vendor object if available, fallback to 'vendor'
    currentRole = vendorAuth.vendor.role || 'vendor';
  }
  // Detect user
  else if (userAuth.isAuthenticated && userAuth.user) {
    isAuthenticated = true;
    // Use role from user object if available, fallback to 'user'
    currentRole = userAuth.user.role || 'user';
  }

  // Debug logs
  console.log('userAuth:', userAuth);
  console.log('vendorAuth:', vendorAuth);
  console.log('adminAuth:', adminAuth);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('currentRole:', currentRole);

  // Not logged in
  if (!isAuthenticated) {
    const redirectTo = loginRedirects[allowedRoles[0]] || '/user/login';
    return <Navigate to={redirectTo} replace />;
  }

  // Logged in, but wrong role
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // Support both children and nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;