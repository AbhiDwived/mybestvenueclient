import React, { useState } from 'react';
import moment from "moment";
import { useReplyToInquiryMutation } from "../../../features/inquiries/inquiryAPI";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUser, FaUserSecret } from 'react-icons/fa';

const InquiryReply = ({ inquiry, inquiryType, onBack }) => {
  const [replyToInquiry, { isLoading }] = useReplyToInquiryMutation();
  const vendor = useSelector((state) => state.vendor.vendor);
  const [replyText, setReplyText] = useState("");

  // Format date safely
  const formatDate = (date) => {
    return date ? moment(date).format("DD/MM/YYYY hh:mm") : "N/A";
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please type a reply before sending.");
      return;
    }

    const payload = {
      inquiryId: inquiry._id,
      inquiryType: inquiryType,
      message: replyText
    };

    try {
      await replyToInquiry(payload).unwrap();
      toast.success("Reply sent successfully!");
      setReplyText("");
      onBack(); // Go back to list to refresh
    } catch (error) {
      toast.error(error.data?.message || "Failed to send reply");
    }
  };

  const handleUseTemplate = () => {
    const template = `Thank you for your interest in our services! We would love to be a part of your special day.

For the date you mentioned, we are available and offer several packages:

- Basic: ₹10,000 (4 hours coverage)
- Standard: ₹25,000 (Full day)
- Premium: ₹50,000 (Full day + Pre-wedding)

Please let me know if you'd like to schedule a call to discuss further details or have any questions.

Best regards,
${vendor?.businessName || 'Your Business Name'}`;
    setReplyText(template);
  };

  // Get inquiry details based on type
  const getInquiryDetails = () => {
    if (inquiryType === 'anonymous') {
      return {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        weddingDate: inquiry.weddingDate,
        message: inquiry.message,
        status: inquiry.status,
        vendorReply: inquiry.vendorReply,
        createdAt: inquiry.createdAt
      };
    } else {
      return {
        name: inquiry.userId?.name,
        email: inquiry.userId?.email,
        phone: inquiry.userId?.phone,
        weddingDate: inquiry.weddingDate,
        message: inquiry.userMessage?.[inquiry.userMessage.length - 1]?.message,
        status: inquiry.replyStatus,
        vendorReply: inquiry.userMessage?.[inquiry.userMessage.length - 1]?.vendorReply,
        createdAt: inquiry.createdAt
      };
    }
  };

  const details = getInquiryDetails();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border font-serif">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {inquiryType === 'logged-in' ? (
              <FaUser className="text-blue-500" />
            ) : (
              <FaUserSecret className="text-orange-500" />
            )}
            <h2 className="text-xl font-semibold">Reply to Inquiry</h2>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
              inquiryType === 'logged-in' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {inquiryType === 'logged-in' ? 'Logged-in User' : 'Anonymous User'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            From: <span className="font-medium">{details.name || "Unknown User"}</span>
          </p>
        </div>
        <button
          className="text-sm border px-3 py-1 rounded hover:bg-[#DEBF78]"
          onClick={onBack}
        >
          Back to List
        </button>
      </div>

      {/* Inquiry Details */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-lg mb-3">Inquiry Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span> {details.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {details.email}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {details.phone}
          </div>
          {details.weddingDate && (
            <div>
              <span className="font-medium">Wedding Date:</span> {details.weddingDate}
            </div>
          )}
          <div className="md:col-span-2">
            <span className="font-medium">Status:</span> 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              details.status === 'Replied' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {details.status}
            </span>
          </div>
        </div>
      </div>

      {/* Message Thread */}
      <div className="space-y-4">
        {/* Original Message */}
        <div className="border-b pb-4">
          <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
            <p className="text-gray-800">{details.message}</p>
            <span className="text-xs text-gray-500 block mt-1">
              {formatDate(details.createdAt)}
            </span>
          </div>
        </div>

        {/* Vendor Reply (if exists) */}
        {details.vendorReply?.message && (
          <div className="flex justify-end">
            <div className="bg-sky-100 p-3 rounded-lg max-w-[80%]">
              <p className="text-gray-800">{details.vendorReply.message}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {formatDate(details.vendorReply.createdAt)}
              </span>
            </div>
          </div>
        )}

        {/* Reply Form */}
        {details.status !== 'Replied' && (
          <div className="mt-4">
            <textarea
              className="w-full border rounded p-3 text-sm min-h-[100px] focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Type your response here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className={`text-white px-4 py-2 rounded bg-[#0f4c81] text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSendReply}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reply'}
              </button>
              <button
                className="border px-4 py-2 rounded text-sm hover:bg-[#DEBF78]"
                onClick={handleUseTemplate}
                disabled={isLoading}
              >
                Use Template
              </button>
              <button
                className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
                onClick={() => setReplyText("")}
                disabled={isLoading}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryReply;