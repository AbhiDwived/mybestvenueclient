import React, { useState } from 'react';
import { useForgotPasswordMutation } from '../../features/vendors/vendorAPI';
import { useNavigate } from 'react-router-dom'; // ✅ Add this import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VendorForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword] = useForgotPasswordMutation();
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success("OTP sent successfully!");

      setTimeout(() => {
        navigate(`/vendor/verify-password-reset?vendorId=${res.vendorId}`);
      }, 2000);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Vendor Forgot Password</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your registered email"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Send OTP</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover closeOnClick />
    </div>
  );
};

export default VendorForgotPassword;
