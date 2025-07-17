import React, { useState } from 'react';
import { useVerifyResetOtpMutation } from '../../features/auth/authAPI';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserVerifyResetOtp = () => {
  const [otp, setOtp] = useState('');
  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyResetOtp({ email, otp, userType: 'user' }).unwrap();
      toast.success("OTP verified successfully!");
      setTimeout(() => {
        navigate(`/user-reset-password?email=${email}`);
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
        <p className="text-center mb-4">Enter the OTP sent to your email.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition disabled:opacity-70"
          >
            {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default UserVerifyResetOtp;