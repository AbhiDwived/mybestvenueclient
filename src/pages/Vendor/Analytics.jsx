import React from 'react';
import { FaStar } from 'react-icons/fa';

const Analytics = () => {
  return (
    <div className="px-1 py-6 sm:px-2 lg:px-6 space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Profile Views", value: "1250", change: "+5%", note: "Last 30 days" },
          { label: "Inquiries", value: "28", change: "+5%", note: "Last 30 days" },
          { label: "Booking Rate", value: "35%", change: "+5%", note: "High conversion" },
        ].map((item, idx) => (
          <div key={idx} className="border p-4 rounded shadow-sm bg-white">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold">
              {item.value} <span className="text-green-500 text-sm">{item.change}</span>
            </p>
            <p className="text-xs text-gray-400">{item.note}</p>
          </div>
        ))}

        {/* Review Score */}
        <div className="border p-1 rounded shadow-sm bg-white">
          <p className="text-sm text-gray-500">Review Score</p>
          <div className="text-2xl font-bold flex flex-col">
            <p>
              4.8 <span className="text-green-500 text-sm">+0.2</span>
            </p>
            <div className="flex space-x-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500" size={16} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile Visits */}
        <div className="border rounded p-2 shadow-sm bg-white">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">Profile Visits</h2>
          <p className="text-sm text-gray-500 mb-4">Daily views of your profile page</p>
          <div className="w-full h-64 bg-gray-50 rounded-lg border border-gray-100 shadow-inner"></div>
          <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
            <span>1 Jun</span>
            <span>8 Jun</span>
            <span>15 Jun</span>
            <span>22 Jun</span>
            <span>30 Jun</span>
          </div>
        </div>

        {/* Inquiry Sources */}
        <div className="border rounded p-2 shadow-sm bg-white">
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-1">Inquiry Sources</h2>
          <p className="text-sm text-gray-500 mb-4">Where your inquiries are coming from</p>
          <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center text-center text-gray-500">
            <div>
              <p className="text-lg font-medium">Top Source</p>
              <p className="text-xl font-bold">Search Results</p>
              <p className="text-sm">52%</p>
              <div className="mt-4 text-xs text-gray-600 space-y-1">
                <p>Search Results (52%)</p>
                <p>Profile Link (20%)</p>
                <p>Partner Listing (10%)</p>
                <p>Other (18%)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Table */}
      <div className="border rounded p-2 shadow-sm overflow-x-auto bg-white">
        <p className="text-lg font-semibold mb-2">Traffic by Location</p>
        <p className="text-sm text-gray-500 mb-4">Where your visitors are based</p>
        <table className="min-w-full text-sm text-left border-t">
          <thead className="bg-gray-100 text-xs text-gray-700 uppercase">
            <tr>
              <th className="p-2">City</th>
              <th className="p-2">Views</th>
              <th className="p-2">Share</th>
              <th className="p-2">Inquiries</th>
              <th className="p-2">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {[
              { city: "Delhi NCR", views: 745, share: "63.9%", inquiries: 18, conversion: "2.4%" },
              { city: "Mumbai", views: 227, share: "18.2%", inquiries: 4, conversion: "1.8%" },
              { city: "Bangalore", views: 102, share: "8.6%", inquiries: 2, conversion: "2.0%" },
              { city: "Jaipur", views: 67, share: "4.5%", inquiries: 1, conversion: "1.5%" },
              { city: "Other", views: 45, share: "3.4%", inquiries: 0, conversion: "0.0%" },
            ].map((row, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-100 border-b">
                <td className="p-2">{row.city}</td>
                <td className="p-2">{row.views}</td>
                <td className="p-2">{row.share}</td>
                <td className="p-2">{row.inquiries}</td>
                <td className="p-2">{row.conversion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
