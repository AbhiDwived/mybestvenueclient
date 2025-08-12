// Utility to clean up stale authentication data
export const cleanupStaleAuth = () => {
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

  // Check all possible tokens
  const tokens = [
    localStorage.getItem('token'),
    localStorage.getItem('adminToken'),
    localStorage.getItem('vendorToken'),
    sessionStorage.getItem('token'),
    sessionStorage.getItem('adminToken'),
    sessionStorage.getItem('vendorToken')
  ];

  let hasInvalidTokens = false;

  tokens.forEach(token => {
    if (token && !isTokenValid(token)) {
      hasInvalidTokens = true;
    }
  });

  // If any tokens are invalid, clear all auth data
  if (hasInvalidTokens) {
    console.log('Cleaning up stale authentication data...');
    
    // Clear localStorage
    const authKeys = [
      'token', 'adminToken', 'vendorToken', 
      'user', 'admin', 'vendor', 'vendorInfo',
      'adminRefreshToken', 'vendorRefreshToken', 'refreshToken',
      'adminEditingVendor'
    ];
    
    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    return true; // Indicates cleanup was performed
  }
  
  return false; // No cleanup needed
};

// Function to be called on app initialization
export const initializeAuthCleanup = () => {
  return cleanupStaleAuth();
};