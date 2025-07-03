import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AuthProtectedRoute = () => {
  // Get auth states from Redux
  const userAuth = useSelector((state) => state.auth || {});
  const vendorAuth = useSelector((state) => state.vendor || {});
  const adminAuth = useSelector((state) => state.adminAuth || {});

  // Check if any user type is authenticated
  if (adminAuth.isAuthenticated && adminAuth.admin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (vendorAuth.isAuthenticated && vendorAuth.vendor) {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  if (userAuth.isAuthenticated && userAuth.user) {
    return <Navigate to="/user/dashboard" replace />;
  }

  // If no one is authenticated, render the auth pages
  return <Outlet />;
};

export default AuthProtectedRoute; 