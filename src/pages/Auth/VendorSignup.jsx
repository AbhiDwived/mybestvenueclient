import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterVendorMutation } from '../../features/vendors/vendorAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'react-feather';

const VENDOR_TYPES = [
  // Venues
  'Banquet Halls',
  'Hotels',
  'Marriage Garden',
  'Kalyana Mandapams',
  'Wedding Resorts',
  'Wedding Lawns & Farmhouses',

  // Photographers
  'Wedding Photographers',
  'Party Places',
  'Photographers',

  // Catering & Decorations
  'Caterers',
  'Wedding Decorators',
  'Wedding Makeup',
  'Wedding Planners',

  // Additional Services
  'Gifts',
  'Florist',
  'Invitation',
  'Choreographers',
  'Photobooth',
  'DJ',
  'Cakes',
  'Musics',
  'TentHouse',
  'Transportation',
  'Videography',
  'Other'
];

const VendorSignup = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    businessName: '',
    vendorType: '',
    otherVendorType: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [userType, setUserType] = useState('vendor');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerVendor] = useRegisterVendorMutation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleUserTypeSwitch = (type) => {
    if (type === 'couple') {
      navigate('/user/signup');
    } else {
      setUserType('vendor');
    }
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
      ...(name === 'vendorType' && value !== 'Other' ? { otherVendorType: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Comprehensive form validation
    const errors = [];
    
    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (!formData.vendorType) {
      errors.push('Please select a vendor type');
    }

    if (formData.vendorType === 'Other' && !formData.otherVendorType.trim()) {
      errors.push('Please specify your custom vendor type');
    }

    if (!formData.termsAccepted) {
      errors.push('You must accept the terms and conditions');
    }

    // Display all validation errors at once
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setIsLoading(true);
    const { confirmPassword, ...vendorData } = formData;

    const data = new FormData();
    Object.entries(vendorData).forEach(([key, value]) => {
      if (key === 'vendorType' && vendorData.vendorType === 'Other') {
        data.append(key, vendorData.otherVendorType.trim());
      } else if (key !== 'otherVendorType') {
        data.append(key, value);
      }
    });

    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }

    try {
      // Use Promise.race to implement a timeout
      const registrationPromise = registerVendor(data).unwrap();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Registration took too long')), 15000)
      );

      const res = await Promise.race([registrationPromise, timeoutPromise]);

      if (!isMounted.current) return;

      const vendorId = res?.vendor?._id || res?.vendorId;

      if (vendorId) {
        // Immediate success feedback
        toast.success('Registration successful!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });

        // Preload OTP verification page
        const otpVerifyUrl = `/vendor/verify-otp?vendorId=${vendorId}`;
        
        // Prefetch the next page
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = otpVerifyUrl;
        document.head.appendChild(link);

        // Slightly delayed navigation to ensure user sees success message
        setTimeout(() => {
          navigate(otpVerifyUrl, { 
            replace: true,
            state: { 
              email: formData.email, 
              vendorType: formData.vendorType === 'Other' ? formData.otherVendorType : formData.vendorType 
            }
          });
        }, 2000);
      } else {
        toast.error('Registration incomplete. Please try again.', {
          position: "top-center"
        });
      }
    } catch (err) {
      if (!isMounted.current) return;
      
      // Detailed error handling
      const errorMessage = err.data?.message || 
        (err.message === 'Registration took too long' 
          ? 'Registration is taking longer than expected. Please check your internet connection.' 
          : 'Registration failed. Please try again.');
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      if (!isMounted.current) return;
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 mt-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">Create Vendor Account</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join myBestVenue to showcase your services, connect with engaged couples, and grow your business.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => handleUserTypeSwitch('couple')}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${
                userType === 'couple' ? 'bg-white text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              User
            </button>
            <button
              onClick={() => handleUserTypeSwitch('vendor')}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${
                userType === 'vendor' ? 'bg-white text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="ABC Photography"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="vendorType" className="block text-sm font-medium text-gray-700 mb-1">Vendor Type</label>
              <select
                id="vendorType"
                name="vendorType"
                value={formData.vendorType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a vendor type</option>
                {VENDOR_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {formData.vendorType === 'Other' && (
              <div>
                <label htmlFor="otherVendorType" className="block text-sm font-medium text-gray-700 mb-1">Other Vendor Type</label>
                <input
                  id="otherVendorType"
                  name="otherVendorType"
                  type="text"
                  value={formData.otherVendorType}
                  onChange={handleChange}
                  placeholder="Enter your custom vendor type"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none mt-4"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none mt-4"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="flex items-center space-x-4">
                {profilePicture && (
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Preview"
                    className="h-16 w-16 rounded-full object-cover border"
                  />
                )}
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 transition"
                >
                  Choose File
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
              {profilePicture && (
                <p className="mt-2 text-sm text-gray-500">{profilePicture.name}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 mt-3">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 text-[#0F4C81] border-gray-300 rounded focus:ring-[#0F4C81] mx-3"
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <a href="/terms" className="text-[#0F4C81] hover:text-[#0D3F6A] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#0F4C81] hover:text-[#0D3F6A] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 mt-2 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#0F4C81] 
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#0F4C81] hover:bg-[#0D3F6A]'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg 
                    className="animate-spin h-5 w-5 mr-3" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/vendor-login" className="text-[#0F4C81] font-medium hover:text-[#0D3F6A] hover:underline">
              Log In
            </Link>
          </p>

          <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
