import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyOtpMutation } from '../src/features/vendors/vendorAPI';

const VendorVerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vendorId = searchParams.get('vendorId');

  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await verifyOtp({ vendorId, otp }).unwrap();
      console.log('OTP Verified:', res);
      alert('OTP verified successfully!');
      navigate('/vendor/login');
    } catch (err) {
      console.error('OTP verification failed:', err);
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
          {error && (
            <p className="mt-4 text-red-500 text-center">
              {error.data?.message || 'Verification failed. Please try again.'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VendorVerifyOTP;
