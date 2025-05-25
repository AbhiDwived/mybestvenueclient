import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { BsCircleFill } from 'react-icons/bs';
// import { FaUserCircle } from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi";

const SubDashboard = () => {
  const recentUsers = [
    { name: 'Arjun & Meera Kumar', email: 'arjun.meera2@example.com', type: 'User', date: '10/12/2023' },
    { name: 'Vikram & Nisha Patel', email: 'vikram.nisha@example.com', type: 'User', date: '14/02/2023' },
    { name: 'Dream Wedding Photography', email: 'info@dreamwedding.com', type: 'Vendor', date: '21/09/2023' }
  ];

  const tasks = [
    { title: 'Vendor Approvals', detail: '12 vendors waiting for approval', action: 'Review Now', color: 'bg-yellow-100 border-yellow-300 text-yellow-500' },
    { title: 'Reported Reviews', detail: '3 reviews flagged for moderation', action: 'Moderate', color: 'bg-red-100 border-red-300 text-red-500' },
    { title: 'Content Updates', detail: '6 entries pending to review', action: 'View Content', color: 'bg-blue-100 border-blue-300 text-blue-500' }
  ];

  const activity = [
    {
      type: "New User Registration",
      description: "Karan & Priya Malhotra joined",
      time: "10 minutes ago",
      color: "green",
    },
    {
      type: "Vendor Application",
      description: "Makeup by Nisha applied for vendor account",
      time: "1 hour ago",
      color: "yellow",
    },
    {
      type: "New Blog Post",
      description: '10 Wedding Trends for 2024" published',
      time: "3 hours ago",
      color: "blue",
    },
    {
      type: "Review Reported",
      description: "A review for Royal Palace Banquet was reported",
      time: "5 hours ago",
      color: "red",
    },
    {
      type: "Vendor Approved",
      description: "Dream Wedding Photography was approved",
      time: "8 hours ago",
      color: "green",
    },
    {
      type: "System Maintenance",
      description: "Scheduled backup completed successfully",
      time: "12 hours ago",
      color: "gray",
    },
  ];

  const categories = [
    { name: 'Photographer', percent: 32 },
    { name: 'Venue', percent: 28 },
    { name: 'Makeup Artist', percent: 18 },
    { name: 'Decorator', percent: 12 },
    { name: 'Caterer', percent: 10 }
  ];

  const colorMap = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    blue: "bg-blue-500",
    red: "bg-red-500",
    gray: "bg-gray-400",
  };
  return (
    <div className="space-y-4 text-sm font-sans text-gray-800 font-serif">

      {/* Daily Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-md mb-1">Daily Activity Overview</h2>
          <p className="text-gray-500 text-xs mb-4">User registrations and vendor signups over the last 30 days</p>
          <div className="h-40 bg-gray-100 flex items-center justify-center text-gray-400 border border-dashed rounded">
            Analytics Chart<br />Activity visualization appears here
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="font-semibold text-md mb-1">Recent Activity</h2>
          <p className="text-gray-500 text-xs mb-4">Latest actions on the platform</p>


          <ul className="space-y-3 text-xs m-2 pl-0 " style={{paddingLeft: "0px"}}>
            {activity.map((item, i) => (
              <li key={i} className="relative pl-3">
                <span className={`absolute left-0 top-1 w-0.5 h-12 rounded ${colorMap[item.color]}`} />
                <div className="border-gray-200 m-2">
                  <p className="text-[13px] font-medium mb-0">{item.type}</p>
                  <p className="text-gray-500 mb-0">{item.description}</p>
                  <p className="text-gray-400 text-[11px]">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>


          <button className="mt-4 w-full text-gray-800 border border-[#0f4c81] rounded py-1.5 text-xs hover:bg-[#DEBF78]  transition">
            View All Activity
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recent Users */}

        <div className="bg-white rounded-lg shadow border p-4 max-w-md w-full mx-auto">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
          <p className="text-sm text-gray-500 mb-4">Newly registered users</p>

          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-start space-x-3 border-b pb-4 last:border-none">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <HiOutlineUser className="text-gray-400 text-xl" size={30} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">{user.type}</span>
                    <span className="text-xs text-gray-400">{user.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full border border-gray-300 rounded py-2 text-sm text-gray-700 hover:bg-[#DEBF78] transition">
            View All Users
          </button>
        </div>

        {/* Pending Tasks   */}
        <div className="bg-white p-2 rounded shadow-sm  ">
          <h2 className="font-semibold text-md mb-2">Pending Tasks</h2>
          <p className="text-gray-500 text-xs mb-2">Item that need your attention</p>
          <ul className="text-xs space-y-3 "style={{paddingLeft:"0px"}}>
            {tasks.map((task, i) => (
              <li key={i} className={`p-2 border-l-4 ${task.color} rounded shadow-sm`}>
                <p className="font-medium text-sm">{task.title}</p>
                <p className="text-gray-600 text-xs">{task.detail}</p>
                <button className="text-blue-700 text-xs underline mt-1">{task.action}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Popular Categories */}
        <div className="bg-white p-2  rounded shadow-sm">
          <h2 className="font-semibold text-md mb-2">Popular Categories</h2>
          <ul className="space-y-3 text-xs " style={{paddingLeft:"0px"}}>
            {categories.map((cat, i) => (
              <li key={i}>
                <div className="flex justify-between mb-1">
                  <span>{cat.name}</span>
                  <span>{cat.percent}%</span>
                </div>
                <div className="w-full bg-gray-100 h-4 rounded">
                  <div className="bg-[#0f4c81] h-4 rounded" style={{ width: `${cat.percent}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubDashboard;
