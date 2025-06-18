import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMenu, FiX, FiLogOut, FiBriefcase, FiUser, FiSettings, FiShoppingCart, FiPackage, FiUsers
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { logoutVendor } from '../features/vendors/vendorSlice';
import { logout as logoutAdmin } from '../features/admin/adminSlice';
import MyBestVenues from '../assets/Images/My BestVenues.png'
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth || {});
  const vendorState = useSelector((state) => state.vendorAuth || state.vendor || {});
  const adminState = useSelector((state) => state.adminAuth || {});

  const { isAuthenticated, user } = authState;
  const { isAuthenticated: isVendorAuthenticated, vendor } = vendorState;
  const { isAuthenticated: isAdminAuthenticated, admin } = adminState;

  const isUserLoggedIn = isAuthenticated || isVendorAuthenticated || isAdminAuthenticated;
  const currentUser = user || vendor || admin;

  const getUserRole = () => {
    if (!currentUser) return 'user';
    if (
      currentUser.role === 'admin' || currentUser.userType === 'admin' ||
      currentUser.type === 'admin' || isAdminAuthenticated
    ) return 'admin';
    if (
      currentUser.role === 'vendor' || currentUser.userType === 'vendor' ||
      currentUser.type === 'vendor' || isVendorAuthenticated
    ) return 'vendor';
    return 'user';
  };

  const getDisplayName = () => {
    if (!currentUser) return 'User';
    const isAdmin = getUserRole() === 'admin';
    const isVendor = getUserRole() === 'vendor';
    if (isAdmin)
      return (currentUser.name || currentUser.username || currentUser.firstName || currentUser.email?.split('@')[0] || 'Admin').substring(0, 10);
    if (isVendor)
      return (currentUser.businessName || currentUser.name || currentUser.username || 'Vendor').substring(0, 10);
    return (currentUser.name || currentUser.username || currentUser.firstName || 'User').substring(0, 10);
  };

  const handleLogout = () => {
    if (isAdminAuthenticated) {
      dispatch(logoutAdmin());
    } else if (isVendorAuthenticated) {
      dispatch(logoutVendor());
    } else {
      dispatch(logout());
    }
    setProfileDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userRole = getUserRole();

  const renderUserDropdown = () => (
    <div className='mr-9'>
      <ul className="absolute p-0 align-middle mt-2 w-43  bg-white shadow-lg border z-50">

        <li>
          <Link to={`/${userRole}/dashboard`} style={{ textDecoration: 'none' }} className="hover:bg-gray-100 mx-2 p-2 rounded-lg  mt-2 flex items-center gap-2 text-black  ">
            <FiUser size={16} /> Dashboard
          </Link>
        </li>
        <li>
          <Link to={`/${userRole}/profile`} style={{ textDecoration: 'none' }} className="hover:bg-gray-100 mx-2 rounded-lg  flex items-center gap-2 text-black  mt-2 py-2 px-2">
            <FiSettings size={16} />  Profile
          </Link>
        </li>
        {userRole === 'user' && (
          <>
            <li>
              <Link to="/user/cart" style={{ textDecoration: 'none', }} className="hover:bg-gray-100 mx-2 flex items-center gap-2 py-2 text-black p-2 rounded-lg  mt-2 ">
                <FiShoppingCart size={16} /> Cart
              </Link>
            </li>
            <li>
              <Link to="/user/orders" style={{ textDecoration: 'none' }} className="hover:bg-gray-100 mx-2  flex items-center gap-2 text-black py-2  p-2 rounded-lg  mt-2 ">
                <FiPackage size={16} /> My Orders
              </Link>
            </li>
            <li>
              <Link to="/user/bookings" style={{ textDecoration: 'none' }} className="hover:bg-gray-100 mx-2  flex items-center gap-2 text-black py-2 px-2  rounded-lg  mt-2 ">
                <FiPackage size={16} /> My Bookings
              </Link>
            </li>
          </>
        )}
        {userRole === 'vendor' && (
          <>
            <li>
              <Link to="/vendor/services" style={{ textDecoration: 'none' }} className="flex items-center mx-2 gap-2 text-black  py-2 px-2 hover:bg-gray-100 ">
                <FiBriefcase size={16} /> My Services
              </Link>
            </li>
            <li>
              <Link to="/vendor/bookings" style={{ textDecoration: 'none' }} className="flex items-center mx-2 gap-2 text-black  py-2 px-2 hover:bg-gray-100">
                <FiPackage size={16} /> Bookings
              </Link>
            </li>
            <li>
              <Link to="/vendor/analytics" style={{ textDecoration: 'none' }} className="flex items-center gap-2 mx-2 text-black py-2 px-2 hover:bg-gray-100">
                <FiSettings size={16} /> Analytics
              </Link>
            </li>
          </>
        )}
        {userRole === 'admin' && (
          <>
            <li>
              <Link to="/admin/users" style={{ textDecoration: 'none' }} className="flex text-black mx-2 items-center gap-2 px-2 py-2 hover:bg-gray-100 ">
                <FiUsers size={16} /> Manage Users
              </Link>
            </li>
            <li>
              <Link to="/admin/vendors" style={{ textDecoration: 'none' }} className="flex text-black mx-2 items-center gap-2 px-2 py-2 hover:bg-gray-100 ">
                <FiBriefcase size={16} /> Manage Vendors
              </Link>
            </li>
            <li>
              <Link to="/admin/bookings" style={{ textDecoration: 'none' }} className="flex text-black mx-2 items-center gap-2 px-2 py-2 hover:bg-gray-100">
                <FiPackage size={16} /> All Bookings
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" style={{ textDecoration: 'none' }} className="flex text-black mx-2 items-center gap-2 px-2 py-2 hover:bg-gray-100">
                <FiSettings size={16} /> System Settings
              </Link>
            </li>
          </>
        )}
        <li className='border-t-1'>
          <button onClick={handleLogout} className="flex text-red-600 mx-2 items-center gap-2  px-2 py-2 hover:text-red-700">
            <FiLogOut size={16} className='m' /> Logout
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <header className="bg-white px-4 py- shadow-sm w-full">
      <div className="mx-auto flex justify-between items-center w-full">
        <Link to="/" className="flex items-center" style={{ textDecoration: 'none' }}>
          <img
            className="h-12 w-auto"
            src={MyBestVenues}
            alt="My Best Venues"
            srcSet={`${MyBestVenues} 1x, ${MyBestVenues} 2x`}
          />
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-gray-700 focus:outline-none">
          {isOpen ? <FiX size={24}  /> : <FiMenu size={24}/>}
        </button>
        <nav className="lg:flex items-center space-x-6 ml-auto hidden">
          <Link to="/wedding-vendor" style={{ textDecoration: 'none', color: 'black' }}>Vendors</Link>
          <Link to="/Wedding_Venues" style={{ textDecoration: 'none', color: 'black' }}>Venues</Link>
          <Link to="/planning-tools" style={{ textDecoration: 'none', color: 'black' }}>Planning Tools</Link>
          <Link to="/IdeaBlog" style={{ textDecoration: 'none', color: 'black' }}>Blogs</Link>
          <Link to="/corporate" className="flex items-center gap-1 text-black" style={{ textDecoration: 'none' }}>
            <FiBriefcase /> Corporate
          </Link>
          {!isUserLoggedIn ? (
            <>
              <Link to="/user/login" style={{ textDecoration: 'none' }} className="flex items-center gap-1 text-black hover:text-[#0F4C81]">Login</Link>
              <Link to="/user/signup" style={{ textDecoration: 'none' }} className="px-3 py-2 bg-[#09365d] text-white rounded hover:bg-[#0f4c81]">Sign Up</Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="px-4 py-2 text-white rounded hover:bg-[#0f4c81] flex items-center gap-2 bg-[#09365d]"
              >
                <FiUser size={16} />{getDisplayName()}
              </button>
              {profileDropdown && renderUserDropdown()}
            </div>
          )}
        </nav>
      </div>
      {isOpen && (
        <div className="lg:hidden mt-2 space-y-2 mx-1">
          <Link to="/wedding-vendor" style={{ textDecoration: 'none', color: ' black', }} className="block">Vendors</Link>
          <Link to="/Wedding_Venues" style={{ textDecoration: 'none', color: ' black', }} className="block">Venues</Link>
          <Link to="/planning-tools" style={{ textDecoration: 'none', color: ' black', }} className="block">Planning Tools</Link>
          <Link to="/IdeaBlog" style={{ textDecoration: 'none', color: ' black', }} className="block ">Ideas & Blogs</Link>
          <Link to="/corporate" style={{ textDecoration: 'none', color: ' black', }} className="flex items-center gap-1 text-gray-700 hover:text-violet-700">
            <FiBriefcase /> Corporate
          </Link>
          <hr />
          {!isUserLoggedIn ? (
            <div className="space-y-2">
              <Link to="/user/login" style={{ textDecoration: 'none' }} className="block w-full text-center border border-violet-900 py-2 rounded hover:bg-violet-900 hover:text-white">Login</Link>
              <Link to="/user/signup" style={{ textDecoration: 'none' }} className="block w-full text-center bg-[#0f4c81] text-white py-2 rounded hover:bg-violet-800">Sign Up</Link>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-2 rounded text-white text-center bg-[#09365d]">
                {getDisplayName()} ({userRole})
              </div>
              <Link to={`/${userRole}/dashboard`} style={{ textDecoration: 'none', color: ' black', }} className="block">Dashboard</Link>
              <Link to={`/${userRole}/profile`} style={{ textDecoration: 'none', color: ' black', }} className="block">Profile</Link>
              <button onClick={handleLogout} style={{ textDecoration: 'none' }} className="w-full text-left text-red-600 hover:text-red-800 ">Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
