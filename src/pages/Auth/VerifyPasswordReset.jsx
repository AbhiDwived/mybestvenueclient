import React, { useState, useEffect } from 'react';
import { useVerifyPasswordResetMutation, useForgotPasswordMutation } from '../../features/auth/authAPI';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyPasswordReset = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = new URLSearchParams(location.search).get('userId');
  const email = new URLSearchParams(location.search).get('email'); // Get email from URL

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [verifyPasswordReset, { isLoading, error }] = useVerifyPasswordResetMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email address not found. Please try the forgot password process again.");
      return;
    }

    try {
      await forgotPassword({ email }).unwrap();
      toast.success("New OTP sent to your email!");
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      console.error('Resend OTP Failed:', err);
      toast.error(err?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await verifyPasswordReset({ userId, otp }).unwrap();
      toast.success("OTP verified successfully!");
      setTimeout(() => {
        navigate(`/reset-password?userId=${userId}`);
      }, 1000);
    } catch (err) {
      console.error('Password reset verification failed:', err);
      toast.error(err?.data?.message || "Invalid or expired OTP");
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

          <div className="mt-4 text-center">
            {!canResend ? (
              <p className="text-gray-600">Resend OTP in {timer} seconds</p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending || !canResend}
                className="text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default VerifyPasswordReset;