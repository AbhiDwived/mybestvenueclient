import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this import
import { useVerifyPasswordResetMutation } from '../../features/vendors/vendorAPI';

const VendorVerifyResetOTP = () => {
  const [vendorId, setVendorId] = useState('');
  const [otp, setOtp] = useState('');
  const [verifyPasswordReset, { isLoading, error }] = useVerifyPasswordResetMutation();
const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyPasswordReset({ vendorId, otp }).unwrap();
      alert(res.message || 'OTP Verified Successfully');
       setTimeout(() => {
        navigate(`/vendor/reset-password?vendorId=${vendorId}`);
      }, 2000);
    } catch (err) {
      alert(err?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Verify OTP for Password Reset</h2>
      <input
        type="text"
        placeholder="Vendor ID"
        value={vendorId}
        onChange={(e) => setVendorId(e.target.value)}
        required
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
        className="w-full p-2 mb-3 border rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm text-center">{error.data?.message}</p>}
    </form>
  );
};

export default VendorVerifyResetOTP;
