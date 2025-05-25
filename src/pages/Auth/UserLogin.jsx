import React, { useState } from 'react';
import { useLoginUserMutation } from '../../features/auth/authAPI';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData).unwrap();

      dispatch(setCredentials(res));

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success('Login successful!');

      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed. Please try again.');
    }
  };

  // Handle tab click and redirect
  const handleUserTypeClick = (type) => {
    if (type === 'couple') {
      navigate('/user/login'); // Stay or reload current page
    } else if (type === 'vendor') {
      navigate('/vendor/login'); // Redirect to Vendor Login
    }
  };

  return (
    <div className="mt-4 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Welcome Message */}
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">
          Log in to access your wedding planning tools.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          {/* Tabs for switching login type */}
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => handleUserTypeClick('couple')}
              style={{ borderRadius: '7px' }}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${
                true ? 'bg-[#fff] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Couple
            </button>
            <button
              onClick={() => handleUserTypeClick('vendor')}
              style={{ borderRadius: '7px' }}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${
                false ? 'bg-[#fff] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Vendor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-[#0F4C81] hover:text-[#0D3F6A] hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-[#0F4C81] border-gray-300 rounded focus:ring-[#0F4C81]"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer mx-2">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 mt-2 text-white font-semibold rounded-md transition-colors mb-4 ${
                  isLoading
                    ? 'bg-[#7AA6CE] cursor-not-allowed'
                    : 'bg-[#0F4C81] hover:bg-[#0D3F6A]'
                }`}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/user/signup" className="text-[#0F4C81] font-medium hover:text-[#0D3F6A] hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default UserLogin;