import React, { useState } from 'react';
import { useVerifyPasswordResetMutation } from '../../features/auth/authAPI';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const VerifyPasswordReset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = new URLSearchParams(location.search).get('userId');

  const [otp, setOtp] = useState('');
  const [verifyPasswordReset, { isLoading, error }] = useVerifyPasswordResetMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyPasswordReset({ userId, otp }).unwrap();
      navigate(`/reset-password?userId=${userId}`);
    } catch (err) {
      console.error('Password reset verification failed:', err);
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
            maxLength="6"
            placeholder="6-digit OTP"
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
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          {error && (
            <p className="mt-4 text-red-500 text-center">{error.data?.message || 'Invalid or expired OTP'}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyPasswordReset;