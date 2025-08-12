import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMenu, FiBriefcase, FiUser, FiSettings,
  FiShoppingCart, FiPackage, FiUsers
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { logoutVendor } from '../features/vendors/vendorSlice';
import { logout as logoutAdmin } from '../features/admin/adminSlice';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { RiLogoutCircleLine, RiArrowDropDownFill } from 'react-icons/ri';
import { IoMdArrowDropleft } from 'react-icons/io';
import MyBestVenues from '../assets/Images/My BestVenues.png';

const Navbar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth || {});
  const vendorState = useSelector((state) => state.vendorAuth || state.vendor || {});
  const adminState = useSelector((state) => state.adminAuth || {});

  const { isAuthenticated, user } = authState;
  const { isAuthenticated: isVendorAuthenticated, vendor } = vendorState;
  const { isAuthenticated: isAdminAuthenticated, admin } = adminState;

  // Debug logging to understand authentication states
  console.log('Auth States:', {
    isAuthenticated,
    isVendorAuthenticated,
    isAdminAuthenticated,
    user: user?.name || user?.email,
    vendor: vendor?.businessName || vendor?.name,
    admin: admin?.name || admin?.email
  });

  const isUserLoggedIn = isAuthenticated || isVendorAuthenticated || isAdminAuthenticated;
  const currentUser = user || vendor || admin;

  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path || currentPath.startsWith(path);

  const getUserRole = () => {
    // Prioritize authentication states over user object properties
    if (isAdminAuthenticated) return 'admin';
    if (isVendorAuthenticated) return 'vendor';
    if (isAuthenticated) return 'user';
    
    // Fallback to checking user object properties
    if (currentUser) {
      if ([currentUser.role, currentUser.userType, currentUser.type].includes('admin')) return 'admin';
      if ([currentUser.role, currentUser.userType, currentUser.type].includes('vendor')) return 'vendor';
    }
    
    return 'user';
  };

  const getDisplayName = () => {
    const role = getUserRole();
    if (!currentUser) return 'User';
    
    // Prioritize admin authentication state
    if (isAdminAuthenticated && admin) {
      return (admin.name || admin.username || admin.firstName || admin.email?.split('@')[0] || 'Admin').substring(0, 10);
    }
    
    // Then vendor authentication state
    if (isVendorAuthenticated && vendor) {
      return (vendor.businessName || vendor.name || vendor.username || 'Vendor').substring(0, 10);
    }
    
    // Finally user authentication state
    if (isAuthenticated && user) {
      return (user.name || user.firstName || user.username || 'User').substring(0, 10);
    }
    
    // Fallback based on role
    if (role === 'admin') return 'Admin';
    if (role === 'vendor') return 'Vendor';
    return 'User';
  };

  const handleLogout = () => {
    if (isAdminAuthenticated) dispatch(logoutAdmin());
    else if (isVendorAuthenticated) dispatch(logoutVendor());
    else dispatch(logout());
    setProfileDropdown(false);
    setShowOffcanvas(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setShowOffcanvas(false);
    setProfileDropdown(false);
  };

  const renderLink = (to, icon, label) => (
    <Link
      to={to}
      onClick={handleLinkClick}
      className={`d-block py-1 mb-2 text-decoration-none d-flex align-items-center gap-2 rounded px-2 ${isActive(to) ? 'text-dark fw-semibold' : 'text-black'
        } hover-bg-light`}
      style={{ transition: 'background-color 0.2s ease-in-out' }}
    >
      {icon} {label}
    </Link>
  );

  const renderProfileLinks = () => {
    const role = getUserRole();

    return (
      <div className="py-2">
        {renderLink(`/${role}/dashboard`, <FiUser size={16} />, 'Dashboard')}


        {role === 'user' && (
          <>
            {renderLink(`/${role}/profile`, <FiSettings size={16} />, 'Profile')}
            {renderLink('booking', <FiPackage size={16} />, 'Bookings')}
          </>
        )}
        {role === 'vendor' && (
          <>
            {renderLink(`/${role}/edit_profile`, <FiSettings size={16} />, 'Profile')}
            {renderLink('bookings', <FiPackage size={16} />, 'Bookings')}
          </>
        )}
        {role === 'admin' && (
          <>
            {renderLink('/admin/user-management', <FiUsers size={16} />, 'Users')}
            {renderLink('/admin/vendor-management', <FiBriefcase size={16} />, 'Vendors')}
          </>
        )}

        <hr className="my-2" />

        <button
          onClick={handleLogout}
          className="w-100 text-start text-danger border-0 bg-transparent d-flex align-items-center gap-2 px-2 py-1"
        >
          <RiLogoutCircleLine /> Logout
        </button>
      </div>
    );
  };

  const renderMobileLinks = () => {
    const role = getUserRole();

    return (
      <div className="space-y-3">
        {renderLink('/vendor', <FiBriefcase size={16} />, 'Vendors')}
        {renderLink('/venues', <FiUser size={16} />, 'Venues')}
        {renderLink('/blog', <FiPackage size={16} />, 'Blogs')}
        {renderLink('/corporate', <FiPackage size={16} />, 'Corporate')}
        {renderLink('/about-us', <FiPackage size={16} />, 'About')}
        <hr />

        {!isUserLoggedIn ? (
          <>
            <Link to="/user/login" onClick={handleLinkClick} className="btn border w-100 mb-2">
              Login
            </Link>
            <Link
              to="/user/signup"
              className="btn text-white w-100"
              style={{ backgroundColor: '#0F4C81' }}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => setMobileDropdown(!mobileDropdown)}
              className="btn btn-secondary w-100 d-flex justify-content-between align-items-center d-lg-none mb-2"
            >
              {getDisplayName()}
              <span>{mobileDropdown ? <RiArrowDropDownFill /> : <IoMdArrowDropleft />}</span>
            </button>

            {mobileDropdown && (
              <ul className="mt-2 ps-0">
                {renderLink(`/${role}/dashboard`, <FiUser size={16} />, 'Dashboard')}
                {renderLink(`/${role}/profile`, <FiSettings size={16} />, 'Profile')}

                {role === 'user' && (
                  <>

                    {renderLink('booking', <FiPackage size={16} />, 'Bookings')}
                  </>
                )}
                {role === 'vendor' && (
                  <>
                    {renderLink('/vendor/bookings', <FiPackage size={16} />, 'Bookings')}
                  </>
                )}
                {role === 'admin' && (
                  <>
                    {renderLink('/admin/user-management', <FiUsers size={16} />, 'Users')}
                    {renderLink('/admin/vendor-management', <FiBriefcase size={16} />, 'Vendors')}
                    {renderLink('/admin/bookings', <FiPackage size={16} />, 'All Bookings')}
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-100 text-start text-danger mt-2 border-0 bg-transparent d-flex align-items-center gap-1"
                >
                  <RiLogoutCircleLine className='mx-2' /> Logout
                </button>
              </ul>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white px-2 py-2 shadow-sm w-100">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/" className="d-flex align-items-center">
          <img src={MyBestVenues} alt="logo" className="h-14" loading="lazy" />
        </Link>

        <div className="d-flex d-lg-none">
          <Button
            variant="outline-secondary"
            className="me-2 mb-2 border-0"
            onClick={() => setShowOffcanvas(true)}
            aria-label="Open menu"
          >
            <FiMenu className="" size={25} />
          </Button>
        </div>
        <nav className="d-none d-lg-flex align-items-center gap-4">
          {renderLink('/vendor', 'Vendors')}
          {renderLink('/venues', 'Venues')}
          {renderLink('/blog', 'Blogs')}
          {renderLink('/corporate', 'Corporate')}
          {renderLink('/about-us', 'About')}

          {!isUserLoggedIn ? (
            <div style={{ marginTop: '-2px' }}>
              <Link to="/user/login" className="text-black text-decoration-none">Login</Link>
              <Link to="/user/signup" className="btn text-white mx-3" style={{ backgroundColor: '#0F4C81' }}>Sign Up</Link>
            </div>
          ) : (
            <div className="position-relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="btn d-flex align-items-center gap-2"
                style={{ backgroundColor: '#09365d', color: 'white' }}
              >
                <FiUser size={16} />
                {getDisplayName()}
                <RiArrowDropDownFill size={20} />
              </button>

              {profileDropdown && (
                <div
                  className="position-absolute end-0 mt-2 bg-white rounded shadow border"
                  style={{
                    zIndex: 1000,
                    minWidth: '220px',
                  }}
                >
                  {renderProfileLinks()}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start"
        style={{ width: '60vw' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={MyBestVenues} alt="logo" className="h-10" loading="lazy" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{renderMobileLinks()}</Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Navbar;