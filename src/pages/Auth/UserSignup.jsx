import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../features/auth/authAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'react-feather';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    profilePhoto: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [userType, setUserType] = useState('couple');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    window.scrollTo({top:0, category:"top"})
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("⚠️ Passwords do not match!");
      return;
    }

    if (!formData.termsAccepted) {
      toast.error("⚠️ You must agree to the terms and conditions.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        payload.append(key, value);
      }
    });

    try {
      const res = await registerUser(payload).unwrap();

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success("✅ Registration successful!");

      if (res?.userId || res.user?.id) {
        setTimeout(() => {
          navigate(`/verify-otp?userId=${res.userId || res.user.id}`);
        }, 2000);
      }

    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(`❌ ${err.data?.message || 'Registration failed. Try again.'}`);
    }
  };

  const handleTabClick = (type) => {
    setUserType(type);
    if (type === 'vendor') {
      navigate('/vendor-register');
    }
  };

  return (
    <div className="flex items-center justify-center px-4 mt-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold mb-1 text-center text-gray-800">Create User Account</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join myBestVenue to access wedding planning tools and connect with vendors.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => handleTabClick('couple')}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${userType === 'couple' ? 'bg-white text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Couple
            </button>
            <button
              onClick={() => handleTabClick('vendor')}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${userType === 'vendor' ? 'bg-white text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number</label>
              <input
                id="phone"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>



            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Profile Photo Upload with Preview */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Profile Picture</label>
                <>
                  {/* Preview Image */}
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-16 h-16 mb-4 rounded-full object-cover border border-gray-300"
                    />
                  )}
                  {/* File Input */}
                  <div className="flex flex-col">
                    <input
                      id="profilePhoto"
                      name="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.profilePhoto && (
                      <p className="text-sm text-gray-500 mt-1">{formData.profilePhoto.name}</p>
                    )}
                  </div>
                </>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none mt-4"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 mt-3">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 text-[#0F4C81] border-gray-300 rounded focus:ring-[#0F4C81]"
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-600 cursor-pointer mx-1">
                I agree to the{' '}
                <Link to="/terms" style={{ textDecoration: 'none' }} className="text-[#0F4C81] hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" style={{ textDecoration: 'none' }} className="text-[#0F4C81] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 mt-2 text-white font-semibold rounded-lg transition-colors ${isLoading ? 'bg-[#7AA6CE]' : 'bg-[#0F4C81] hover:bg-[#0D3F6A]'} focus:outline-none focus:ring-2 focus:ring-[#0F4C81]`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Already have an account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/user/login" style={{ textDecoration: 'none' }} className="text-[#0F4C81] font-medium hover:text-[#0D3F6A] hover:underline">
              Log In
            </Link>
          </p>

          <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
