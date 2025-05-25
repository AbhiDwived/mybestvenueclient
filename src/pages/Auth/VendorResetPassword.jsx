import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this import
import { useResetPasswordMutation } from '../../features/vendors/vendorAPI';

const VendorResetPassword = () => {
  const [vendorId, setVendorId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword({ vendorId, newPassword }).unwrap();
      alert(res.message || 'Password reset successful');
        setTimeout(() => {
        navigate(`/vendor-login`);
      }, 2000);
    } catch (err) {
      alert(err?.data?.message || 'Reset password failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Reset Vendor Password</h2>
      <input
        type="text"
        placeholder="Vendor ID"
        value={vendorId}
        onChange={(e) => setVendorId(e.target.value)}
        required
        className="w-full p-2 mb-3 border rounded"
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full p-2 mb-3 border rounded"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
      {error && <p className="text-red-500 mt-2 text-sm text-center">{error.data?.message}</p>}
    </form>
  );
};

export default VendorResetPassword;
