import React from 'react';
import { FaStar } from 'react-icons/fa';

const Analytics = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Profile Views</p>
          <p className="text-2xl font-bold">
            1250 <span className="text-green-500 text-sm">+5%</span>
          </p>
          <p className="text-xs text-gray-400">Last 30 days</p>
        </div>
        <div className="border p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Inquiries</p>
          <p className="text-2xl font-bold">
            28 <span className="text-green-500 text-sm">+5%</span>
          </p>
          <p className="text-xs text-gray-400">Last 30 days</p>
        </div>
        <div className="border p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Booking Rate</p>
          <p className="text-2xl font-bold">
            35% <span className="text-green-500 text-sm">+5%</span>
          </p>
          <p className="text-xs text-gray-400">High conversion</p>
        </div>
        <div className="border p-4 rounded shadow-sm">
          <p className="text-sm text-gray-500">Review Score</p>
          <div className="text-2xl font-bold flex flex-col items-left">
            <p>
              4.8 <span className="text-green-500 text-sm">+0.2</span>
            </p>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500" size={16} />
              ))}
            </div>
          </div>
        </div>
      </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Profile Visits - Left Side */}
  <div className="border rounded p-4 shadow-sm">
    <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Visits</h2>
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

  {/* Inquiry Sources - Right Side */}
  <div className="border rounded p-4 shadow-sm">
    <h2 className="text-xl font-bold text-gray-900 mb-1">Inquiry Sources</h2>
    <p className="text-sm text-gray-500 mb-4">Where your inquiries are coming from</p>
    <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center text-center text-gray-500">
      <div>
        <p className="text-lg font-medium">Top Source</p>
        <p className="text-xl font-bold">Search Results</p>
        <p className="text-sm">52%</p>
        <div className="mt-4 text-xs text-gray-600">
          <p>Search Results (52%)</p>
          <p>Profile Link (20%)</p>
          <p>Partner Listing (10%)</p>
          <p>Other (18%)</p>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Traffic By Location Table */}
      <div className="border rounded p-4 shadow-sm overflow-x-auto ">
  <p className="font-semibold mb-2">Traffic by Location</p>
  <p className="text-sm text-gray-500 mb-4">Where your visitors are based</p>
  <table className="min-w-full text-sm text-left border-t font-helvetica">
    <thead className="border-b bg-gray-100">
      <tr>
        <th className="p-2 font-medium">City</th>
        <th className="p-2 font-medium">Views</th>
        <th className="p-2 font-medium">Share</th>
        <th className="p-2 font-medium">Inquiries</th>
        <th className="p-2 font-medium">Conversion Rate</th>
      </tr>
    </thead>
    <tbody>
      <tr className="odd:bg-white even:bg-gray-100 border-b">
        <td className="p-2">Delhi NCR</td>
        <td className="p-2">745</td>
        <td className="p-2">63.9%</td>
        <td className="p-2">18</td>
        <td className="p-2">2.4%</td>
      </tr>
      <tr className="odd:bg-white even:bg-gray-100 border-b">
        <td className="p-2">Mumbai</td>
        <td className="p-2">227</td>
        <td className="p-2">18.2%</td>
        <td className="p-2">4</td>
        <td className="p-2">1.8%</td>
      </tr>
      <tr className="odd:bg-white even:bg-gray-100 border-b">
        <td className="p-2">Bangalore</td>
        <td className="p-2">102</td>
        <td className="p-2">8.6%</td>
        <td className="p-2">2</td>
        <td className="p-2">2.0%</td>
      </tr>
      <tr className="odd:bg-white even:bg-gray-100 border-b">
        <td className="p-2">Jaipur</td>
        <td className="p-2">67</td>
        <td className="p-2">4.5%</td>
        <td className="p-2">1</td>
        <td className="p-2">1.5%</td>
      </tr>
      <tr className="odd:bg-white even:bg-gray-100">
        <td className="p-2">Other</td>
        <td className="p-2">45</td>
        <td className="p-2">3.4%</td>
        <td className="p-2">0</td>
        <td className="p-2">0.0%</td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Analytics;
