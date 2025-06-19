import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterVendorMutation } from '../../features/vendors/vendorAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'react-feather';

const VendorSignup = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    businessName: '',
    vendorType: '',
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
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error('You must accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    const { confirmPassword, ...vendorData } = formData;

    const data = new FormData();
    Object.entries(vendorData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }

    try {
      const res = await registerVendor(data).unwrap();
      if (!isMounted.current) return;

      const vendorId = res?.vendor?._id || res?.vendorId;

      if (vendorId) {
        toast.success('Registration successful! Please verify your email.');
        setTimeout(() => {
          navigate(`/vendor/verify-otp?vendorId=${vendorId}`, { replace: true });
        }, 2000);
      } else {
        toast.error('Registration succeeded but vendor ID is missing.');
      }
    } catch (err) {
      if (!isMounted.current) return;
      toast.error(err?.data?.message || 'Registration failed. Please try again.');
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
              <input
                id="vendorType"
                name="vendorType"
                type="text"
                value={formData.vendorType}
                onChange={handleChange}
                placeholder="Photographer, Caterer, etc."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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
              className="w-full py-2 px-4 mt-2 text-white font-semibold rounded-lg bg-[#0F4C81] hover:bg-[#0D3F6A] transition focus:outline-none focus:ring-2 focus:ring-[#0F4C81] opacity-60 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
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
