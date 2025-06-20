import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";
import InquiryReply from './InquiryReply';
import { useSelector } from 'react-redux';
import { useUserInquiryListQuery } from "../../../features/vendors/vendorAPI";
import { toast } from 'react-toastify';

const InquiriesSection = () => {
  const [filter, setFilter] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const vendor = useSelector((state) => state.vendor.vendor);
  
  const { data, isLoading, isError, error, refetch } = useUserInquiryListQuery(undefined, {
    // The query will use the auth token from the state, so we don't need to pass vendorId
    refetchOnMountOrArgChange: true
  });
  
  const inquiries = data?.modifiedList || [];

  const filteredInquiries =
    filter === 'All' ? inquiries : inquiries.filter((i) => i.replyStatus === filter);

  if (!vendor) {
    return (
      <div className="p-4 text-red-500 text-center">
        Please log in to view inquiries
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error?.data?.message || 'Failed to load inquiries';
    toast.error(errorMessage);
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{errorMessage}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-2 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50 min-h-screen font-serif">
      {/* Summary Section */}
      <div className="space-y-6 col-span-1">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Inquiry Summary</h2>
          <ul className="text-sm space-y-2 mt-2">
            <li className="flex items-center justify-between">
              <p>Total Inquiries</p>
              <strong className="text-black">{inquiries.length}</strong>
            </li>
            <li className="flex items-center justify-between">
              <p>Pending Reply</p>
              <strong className="text-yellow-500">
                {inquiries.filter((i) => i.replyStatus === 'Pending').length}
              </strong>
            </li>
            <li className="flex items-center justify-between">
              <p>Replied</p>
              <strong className="text-green-500">
                {inquiries.filter((i) => i.replyStatus === 'Replied').length}
              </strong>
            </li>
          </ul>
          <hr className="my-3" />
          <div>
            <p className="text-sm">Response Rate</p>
            <p className="text-right text-sm font-bold text-gray-600 mb-1">
              {inquiries.length > 0
                ? `${Math.round(
                  (inquiries.filter((i) => i.replyStatus === 'Replied').length / inquiries.length) * 100
                )}%`
                : '0%'}
            </p>
            <div className="w-full h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-[#0f4c81] rounded-full"
                style={{
                  width: `${inquiries.length > 0
                    ? (inquiries.filter((i) => i.replyStatus === 'Replied').length / inquiries.length) * 100
                    : 0
                    }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Tips for Responses</h2>
          <ul className="list-disc list-inside text-sm space-y-2 mt-3">
            {[
              'Respond within 24 hours for best results',
              'Include your pricing and availability',
              'Ask follow-up questions to understand their needs',
              'Provide a clear call to action (book a call, meet in person)',
            ].map((tip, i) => (
              <li key={i} className="flex items-center">
                <RiCheckboxCircleFill className="h-4 w-4 text-green-500 mr-2" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Inquiry List */}
      <div className="col-span-1 lg:col-span-2">
        {selectedInquiry ? (
          <InquiryReply 
            inquiry={selectedInquiry} 
            onBack={() => setSelectedInquiry(null)} 
          />
        ) : (
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">Client Inquiries</h2>
                <p className="text-sm text-gray-600">Manage and respond to client messages</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  Filter: {filter} <FaChevronDown className="ml-2 h-4 w-4" />
                </button>
                {showFilter && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                    {['All', 'Pending', 'Replied'].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => {
                          setFilter(opt);
                          setShowFilter(false);
                        }}
                        className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Inquiries */}
            <div className="space-y-4">
              {filteredInquiries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No inquiries found
                </div>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry._id}
                    className={`p-4 border rounded ${inquiry.replyStatus === 'Replied'
                      ? 'border-green-100 bg-green-50'
                      : 'border-yellow-200 bg-yellow-50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-md">{inquiry.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${inquiry.replyStatus === 'Replied'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {inquiry.replyStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      {inquiry.userMessage?.[inquiry.userMessage.length - 1]?.message}
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        className="text-sm text-gray-700 hover:underline"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        {inquiry.replyStatus === 'Replied' ? 'View Details' : 'Reply Now'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiriesSection;
