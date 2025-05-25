import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyOtpMutation } from '../../features/vendors/vendorAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // ✅ make sure to import the CSS

const VendorVerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vendorId = searchParams.get('vendorId');

  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await verifyOtp({ vendorId, otp }).unwrap();
      toast.success("OTP verified successfully!");

      setTimeout(() => {
        navigate('/vendor/login');
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || "Verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-70"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
      {/* ✅ Toast container renders all toasts */}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default VendorVerifyOTP;
