import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";
import { RiCheckboxCircleFill } from "react-icons/ri";

const inquiries = [
  {
    id: 1,
    name: 'Arjun & Meera Kumar',
    message:
      'Hello, I am interested in your wedding photography services for my wedding on November 15, 2024. Could you please provide more details about your packages?',
    date: '11/15/2024',
    received: '12/10/2023',
    status: 'Replied'
  },
  {
    id: 2,
    name: 'Karan & Priya Malhotra',
    message:
      'Hi, could you please share your availability for January 20, 2024? We are planning a destination wedding in Rajasthan.',
    date: '1/20/2024',
    received: '12/15/2023',
    status: 'Pending'
  },
  {
    id: 3,
    name: 'Vikram & Nisha Patel',
    message:
      'We loved your portfolio! Do you offer videography services as well or only photography?',
    date: '3/5/2024',
    received: '12/18/2023',
    status: 'Pending'
  }
];

const InquiriesSection = () => {
  const [filter, setFilter] = useState('All');
  const [showFilter, setShowFilter] = useState(false);

  const filteredInquiries =
    filter === 'All' ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <div className="p-2 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50 min-h-screen font-serif">
      {/* Inquiry Summary */}
      <div className="space-y-6 col-span-1">
        <div className="bg-white p-2 rounded shadow">
          <h2 className="font-semibold text-lg mb-2 font-serif">Inquiry Summary</h2>
      <ul className="text-sm space-y-2 mt-2 pl-0 mr-3 ">
    <li>
      <div className="flex items-center justify-between mt-4 " >
        <p className="text-left  font-serif " >Total Inquiries</p>
        <strong className="text-right text-black">3</strong>
      </div>
    </li>
    <li>
      <div className="flex items-center justify-between">
        <p className="text-left">Pending Reply</p>
        <strong className="text-right text-yellow-400">2</strong>
      </div>
    </li><li>
      <div className="flex items-center justify-between">
        <p className="text-left">Replied</p>
        <strong className="text-right text-green-500">1</strong>
      </div>
    </li>
   
  </ul>
  <hr/>
          <div className="m-2">
            <p className="text-sm  font-serif mb-0">Response Rate</p>
               <p className="text-right text-xs mt-1 font-bold text-gray-600  mb-0" style={{fontSize:'16px'}}>33%</p>
            <div className="w-full h-4 bg-gray-500 rounded-full">
              <div className="h-4 bg-[#0f4c81] rounded-full" style={{ width: '33%' }}></div>
            </div>
            {/* <p className="text-right text-xs mt-1 font-bold text-gray-600 ">33%</p> */}
          </div>
        </div>

        <div className="bg-white p-2 rounded shadow">
          <h2 className="font-semibold text-lg mb-2 font-serif">Tips for Responses</h2>
          <ul className="list-disc list-inside text-sm space-y-1 mt-4">
            <li className="flex items-center"><RiCheckboxCircleFill className="h-4 w-4 text-green-500 mr-2"/>Respond within 24 hours for best results</li>
            <li className="flex items-center"><RiCheckboxCircleFill className="h-4 w-4 text-green-500 mr-2"/>Include your pricing and availability</li>
            <li className="flex items-center"><RiCheckboxCircleFill className="h-4 w-4 text-green-500 mr-2"/>Ask follow-up questions to understand their needs</li>
            <li className="flex items-center"><RiCheckboxCircleFill className="h-4 w-4 text-green-500 mr-2"/>Provide a clear call to action (book a call, meet in person)</li>
            
          </ul>
        </div>
      </div>

      {/* Client Inquiries */}
      <div className="col-span-1 lg:col-span-2">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-lg font-serif">Client Inquiries</h2>
              <p className="text-sm text-gray-600">
                Manage and respond to client messages
              </p>
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

          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`p-4 border rounded ${
                  inquiry.status === 'Replied'
                    ? 'border-green-100 bg-green-50'
                    : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-md font-serif">{inquiry.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      inquiry.status === 'Replied'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{inquiry.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <p>Wedding Date: {inquiry.date}</p>
                  <p className="text-right">Received: {inquiry.received}</p>
                </div>
                <div className="mt-2 text-right">
                  <button className="text-sm text-gray-800 hover:underline">
                    {inquiry.status === 'Replied' ? 'View Details' : 'Reply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiriesSection;

