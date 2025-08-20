import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationGuard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const userAuth = useSelector((state) => state.auth || {});
  const vendorAuth = useSelector((state) => state.vendor || {});
  const adminAuth = useSelector((state) => state.adminAuth || {});

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Only check authentication for dashboard routes
    const isDashboardRoute = (
      currentPath.startsWith('/admin/dashboard') || 
      currentPath.startsWith('/vendor/dashboard') || 
      currentPath.startsWith('/user/dashboard')
    );

    // Skip auth check for public routes and auth pages
    const isPublicRoute = (
      currentPath === '/' ||
      currentPath === '/user/login' ||
      currentPath === '/user/signup' ||
      currentPath === '/vendor/login' ||
      currentPath === '/vendor-register' ||
      currentPath === '/admin/login' ||
      currentPath.startsWith('/vendor-list') ||
      currentPath.startsWith('/preview-profile') ||
      currentPath.startsWith('/blog') ||
      currentPath.startsWith('/venues') ||
      currentPath.startsWith('/vendor') ||
      currentPath.startsWith('/reset-password') ||
      currentPath.startsWith('/forgot-password')
    );

    if (isDashboardRoute && !isPublicRoute) {
      const isAuthenticated = userAuth.isAuthenticated || 
                             vendorAuth.isAuthenticated || 
                             adminAuth.isAuthenticated;

      if (isAuthenticated === false) {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, userAuth.isAuthenticated, vendorAuth.isAuthenticated, adminAuth.isAuthenticated, navigate]);

  return null;
};

export default NavigationGuard;