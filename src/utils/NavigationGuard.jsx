import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const NavigationGuard = () => {
  const location = useLocation();
  
  const userAuth = useSelector((state) => state.auth || {});
  const vendorAuth = useSelector((state) => state.vendor || {});
  const adminAuth = useSelector((state) => state.adminAuth || {});

  useEffect(() => {
    // Check if current route is protected and user is not authenticated
    const currentPath = location.pathname;
    const isProtectedRoute = currentPath.startsWith('/admin') || 
                            currentPath.startsWith('/vendor') || 
                            currentPath.startsWith('/user');

    if (isProtectedRoute) {
      const isAuthenticated = userAuth.isAuthenticated || 
                             vendorAuth.isAuthenticated || 
                             adminAuth.isAuthenticated;

      if (!isAuthenticated) {
        // Clear any stale data and redirect to home
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace('/');
      }
    }
  }, [location.pathname, userAuth.isAuthenticated, vendorAuth.isAuthenticated, adminAuth.isAuthenticated]);

  return null; // This component doesn't render anything
};

export default NavigationGuard;