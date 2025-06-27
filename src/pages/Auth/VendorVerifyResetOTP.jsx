import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  useVerifyPasswordResetMutation, 
  useResendPasswordResetOtpMutation 
} from '../../features/vendors/vendorAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VendorVerifyResetOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from previous page's state
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');

  // Resend OTP state
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const cooldownIntervalRef = useRef(null);

  const [verifyPasswordReset, { isLoading: isVerifying }] = useVerifyPasswordResetMutation();
  const [resendPasswordResetOtp, { isLoading: isResending }] = useResendPasswordResetOtpMutation();

  // Start cooldown timer
  const startResendCooldown = () => {
    setCanResendOtp(false);
    setResendCooldown(30);

    cooldownIntervalRef.current = setInterval(() => {
      setResendCooldown((prevCooldown) => {
        if (prevCooldown <= 1) {
          clearInterval(cooldownIntervalRef.current);
          setCanResendOtp(true);
          return 0;
        }
        return prevCooldown - 1;
      });
    }, 1000);
  };

  // Initialize cooldown on component mount
  useEffect(() => {
    // If no email is present, redirect back to forgot password
    console.log('Location state:', location.state);
    console.log('Email from state:', email);

    if (!email) {
      console.warn('No email found, redirecting to forgot password');
      navigate('/vendor/forgot-password');
      return;
    }

    startResendCooldown();

    // Cleanup interval on component unmount
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const res = await verifyPasswordReset({ email, otp }).unwrap();
      
      toast.success(res.message || 'OTP Verified Successfully');
      
      setTimeout(() => {
        navigate(`/vendor/reset-password`, { 
          state: { email, otp } 
        });
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || 'OTP verification failed');
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp || isResending || !email) return;

    try {
      await resendPasswordResetOtp({ email }).unwrap();
      toast.success("New OTP sent successfully!");
      startResendCooldown();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP for Password Reset</h2>
        <p className="text-center text-gray-600 mb-4">
          An OTP has been sent to {email}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full p-3 border rounded mb-2 text-center tracking-[10px] uppercase"
              required
            />
            <div className="text-center text-sm text-gray-500 mb-4">
              {!canResendOtp ? (
                `Resend OTP in ${resendCooldown} seconds`
              ) : (
                <button 
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResendOtp || isResending}
                  className="text-blue-600 hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isVerifying}
            className={`w-full py-3 rounded transition ${
              isVerifying 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#0F4C81] text-white hover:bg-[#0D3F6A]'
            }`}
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <svg 
                  className="animate-spin h-5 w-5 mr-3" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default VendorVerifyResetOTP;
