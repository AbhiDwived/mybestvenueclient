import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";
import InquiryReply from './InquiryReply';
import { useSelector } from 'react-redux';
import { useGetVendorInquiriesQuery, useGetAnonymousInquiriesQuery } from "../../../features/inquiries/inquiryAPI";
import { toast } from 'react-toastify';
import { FaUser, FaUserSecret } from 'react-icons/fa';

const InquiriesSection = () => {
  const [filter, setFilter] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryType, setInquiryType] = useState('all'); // 'all', 'logged-in', 'anonymous'

  const vendor = useSelector((state) => state.vendor.vendor);
  
  const { data, isLoading, isError, error, refetch } = useGetVendorInquiriesQuery(vendor?._id, {
    skip: !vendor?._id,
    refetchOnMountOrArgChange: true
  });
  
  const userInquiries = data?.data?.userInquiries || [];
  const anonymousInquiries = data?.data?.anonymousInquiries || [];
  
  // Combine all inquiries for filtering
  const allInquiries = [
    ...userInquiries.map(inquiry => ({ ...inquiry, type: 'logged-in' })),
    ...anonymousInquiries.map(inquiry => ({ ...inquiry, type: 'anonymous' }))
  ];

  const filteredInquiries = allInquiries.filter(inquiry => {
    const statusMatch = filter === 'All' || inquiry.replyStatus === filter || inquiry.status === filter;
    const typeMatch = inquiryType === 'all' || inquiry.type === inquiryType;
    return statusMatch && typeMatch;
  });

  const { data: anonData, isLoading: isAnonLoading } = useGetAnonymousInquiriesQuery(vendor?.id, { skip: !vendor?.id });

  console.log('anonData', anonData, 'vendor', vendor);

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

  const totalInquiries = allInquiries.length;
  const pendingInquiries = allInquiries.filter(i => (i.replyStatus || i.status) === 'Pending').length;
  const repliedInquiries = allInquiries.filter(i => (i.replyStatus || i.status) === 'Replied').length;

  return (
    <div className="p-2 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50 min-h-screen font-serif">
      {/* Summary Section */}
      <div className="space-y-6 col-span-1">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Inquiry Summary</h2>
          <ul className="text-sm space-y-2 mt-2">
            <li className="flex items-center justify-between">
              <p>Total Inquiries</p>
              <strong className="text-black">{totalInquiries}</strong>
            </li>
            <li className="flex items-center justify-between">
              <p>Logged-in Users</p>
              <strong className="text-blue-500">{userInquiries.length}</strong>
            </li>
            <li className="flex items-center justify-between">
              <p>Anonymous Users</p>
              <strong className="text-orange-500">{anonymousInquiries.length}</strong>
            </li>
            <li className="flex items-center justify-between">
              <p>Pending Reply</p>
              <strong className="text-yellow-500">{pendingInquiries}</strong>
            </li>
            <li className="flex items-center justify-between">
              <p>Replied</p>
              <strong className="text-green-500">{repliedInquiries}</strong>
            </li>
          </ul>
          <hr className="my-3" />
          <div>
            <p className="text-sm">Response Rate</p>
            <p className="text-right text-sm font-bold text-gray-600 mb-1">
              {totalInquiries > 0
                ? `${Math.round((repliedInquiries / totalInquiries) * 100)}%`
                : '0%'}
            </p>
            <div className="w-full h-4 bg-gray-200 rounded-full">
              <div
                className="h-4 bg-[#0f4c81] rounded-full"
                style={{
                  width: `${totalInquiries > 0 ? (repliedInquiries / totalInquiries) * 100 : 0}%`,
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
            inquiryType={inquiryType}
            onBack={() => setSelectedInquiry(null)} 
          />
        ) : (
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg">Client Inquiries</h2>
                <p className="text-sm text-gray-600">Manage and respond to client messages</p>
              </div>
              <div className="flex gap-2">
                {/* Type Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm"
                  >
                    Type: {inquiryType === 'all' ? 'All' : inquiryType === 'logged-in' ? 'Logged-in' : 'Anonymous'} <FaChevronDown className="ml-2 h-4 w-4" />
                  </button>
                  {showFilter && (
                    <div className="absolute right-0 mt-2 bg-white border rounded shadow z-10">
                      {[
                        { value: 'all', label: 'All Types' },
                        { value: 'logged-in', label: 'Logged-in Users' },
                        { value: 'anonymous', label: 'Anonymous Users' }
                      ].map((opt) => (
                        <div
                          key={opt.value}
                          onClick={() => {
                            setInquiryType(opt.value);
                            setShowFilter(false);
                          }}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                    className={`p-4 border rounded ${(inquiry.replyStatus || inquiry.status) === 'Replied'
                      ? 'border-green-100 bg-green-50'
                      : 'border-yellow-200 bg-yellow-50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {inquiry.type === 'logged-in' ? (
                          <FaUser className="text-blue-500" />
                        ) : (
                          <FaUserSecret className="text-orange-500" />
                        )}
                        <h3 className="font-medium text-md">{inquiry.name || inquiry.userId?.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          inquiry.type === 'logged-in' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {inquiry.type === 'logged-in' ? 'Logged-in' : 'Anonymous'}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${(inquiry.replyStatus || inquiry.status) === 'Replied'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {inquiry.replyStatus || inquiry.status}
                      </span>
                    </div>

                    {/* Inquiry Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
                      <div>
                        <span className="font-medium">Email:</span> {inquiry.email || inquiry.userId?.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {inquiry.phone || inquiry.userId?.phone}
                      </div>
                      {inquiry.eventDate && (
                        <div className="col-span-2">
                          <span className="font-medium">Event Date:</span> {inquiry.eventDate}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Message:</span> {inquiry.message || inquiry.userMessage?.[inquiry.userMessage.length - 1]?.message}
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      Received: {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>

                    <div className="mt-2 flex justify-end">
                      <button
                        className="text-sm text-gray-700 hover:underline"
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setInquiryType(inquiry.type);
                        }}
                      >
                        {(inquiry.replyStatus || inquiry.status) === 'Replied' ? 'View Details' : 'Reply Now'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Anonymous Inquiries Table - Full Width */}
      <div className="mt-10 col-span-1 lg:col-span-3 w-full">
        <h3 className="font-semibold text-lg mb-2">All Anonymous Inquiries</h3>
        {isAnonLoading ? (
          <div>Loading anonymous inquiries...</div>
        ) : anonData?.data?.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full border text-sm w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Your Name</th>
                  <th className="border px-2 py-1">Your Email</th>
                  <th className="border px-2 py-1">Phone Number</th>
                  <th className="border px-2 py-1">Event Date</th>
                  <th className="border px-2 py-1">Message</th>
                  <th className="border px-2 py-1">Created At</th>
                </tr>
              </thead>
              <tbody>
                {anonData.data.map((inq) => (
                  <tr key={inq._id}>
                    <td className="border px-2 py-1">{inq.name}</td>
                    <td className="border px-2 py-1">{inq.email}</td>
                    <td className="border px-2 py-1">{inq.phone}</td>
                    <td className="border px-2 py-1">{inq.eventDate}</td>
                    <td className="border px-2 py-1">{inq.message}</td>
                    <td className="border px-2 py-1">{new Date(inq.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500">No anonymous inquiries found.</div>
        )}
      </div>
    </div>
  );
};

export default InquiriesSection;
