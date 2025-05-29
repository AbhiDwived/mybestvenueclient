import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineChatAlt2 } from 'react-icons/hi';

const NotApproved = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-4">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-lg text-center">
        <div className="mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5957/5957410.png"
            alt="Access Denied"
            className="mx-auto w-24 h-24"
          />
        </div>

        <h1 className="text-3xl font-extrabold text-yellow-600 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Your vendor account is currently pending approval from our team.
          Please check back later or contact our support team below for help.
        </p>

        <div className="space-y-4 mb-6 text-left">
          <div className="flex items-center gap-3">
            <HiOutlineMail className="text-yellow-600 text-xl" />
            <span className="text-gray-700 text-sm">Email: <a href="mailto:support@yourdomain.com" className="text-yellow-700 hover:underline">support@yourdomain.com</a></span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlinePhone className="text-yellow-600 text-xl" />
            <span className="text-gray-700 text-sm">Phone: <a href="tel:+1234567890" className="text-yellow-700 hover:underline">+1 (234) 567-890</a></span>
          </div>
          <div className="flex items-center gap-3">
            <HiOutlineChatAlt2 className="text-yellow-600 text-xl" />
            <span className="text-gray-700 text-sm">WhatsApp: <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="text-yellow-700 hover:underline">Chat Now</a></span>
          </div>
        </div>

        <Link
          to="/vendor/login"
          className="inline-block bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-yellow-600 transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default NotApproved;
