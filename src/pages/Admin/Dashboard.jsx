
import React, { useState } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import SubDashboard from './SubDashboard';
import UserManagement from './UserManagement';
import VendorManagement from './VendorManagement';
import PendingApprovals from './PendingApprovals';
import ReviewModeration from './ReviewModeration';
import ContentManagement from './ContentManagement';

const AdminDashboard = () => {
  const cardData = [
    {
      title: "Platform Statistics",
      stats: [
        { label: "Total Users", value: "12,458" },
        { label: "Total Vendors", value: "1,245" },
        { label: "Pending Approvals", value: "18", className: "text-yellow-600 font-semibold" },
        { label: "Total Reviews", value: "8,569" }
      ]
    },
    {
      title: "User Activity",
      activity: {
        percent: 35,
        active: "4,325",
        inactive: "8,133",
        today: "+58",
        trend: "+12%",
      }
    },
    {
      title: "Revenue Overview",
      revenue: {
        total: "₹24,58,675",
        change: "+12.5%",
        breakdown: [
          { label: "Premium Vendors", value: "₹8,56,400" },
          { label: "Standard Vendors", value: "₹12,45,600" },
          { label: "Basic Vendors", value: "₹3,56,675" }
        ]
      }
    }
  ];

  const [activeTab, setActiveTab] = useState('Dashboard');
  const tabs = [
    'Dashboard',
    'User Management',
    'Vendor Management',
    'Pending Approvals',
    'Review Moderation',
    'Content Management'
  ];

  return (
    <div className="min-h-screen p-6 text-gray-800 space-y-6 font-serif">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage users, vendors, content, and platform settings</p>
        </div>
        <button className="text-sm font-bold text-white bg-[#0f4c81] hover:bg-[#DEBF78] rounded px-4 py-2 inline-flex items-center">
          <IoSettingsOutline size={20} className="mr-2" /> System Settings
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {cardData.map((card, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">{card.title}</h2>

            {/* Platform Statistics */}
            {card.stats && (
              <div>
                <div className="flex justify-between pr-20 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">{card.stats[0].label}</p>
                    <p className="text-lg font-bold text-gray-800">{card.stats[0].value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{card.stats[1].label}</p>
                    <p className="text-lg font-bold text-gray-800">{card.stats[1].value}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-2 pr-20">
                  <div>
                    <p className="text-xs text-gray-500">{card.stats[2].label}</p>
                    <p className={`text-base ${card.stats[2].className || "text-gray-800 font-bold"}`}>{card.stats[2].value}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{card.stats[3].label}</p>
                    <p className="text-lg font-bold text-gray-800">{card.stats[3].value}</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Activity */}
            {card.activity && (
              <div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Active Users</span>
                  <span>{card.activity.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 h-4 rounded-full my-1">
                  <div className="bg-[#0f4c81] h-4 rounded-full" style={{ width: `${card.activity.percent}%` }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>{card.activity.active} active</span>
                  <span>{card.activity.inactive} inactive</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">New Registrations Today</span>
                  <span className="text-green-600 bg-[#c8faf4] font-semibold border border-green-600 rounded-full px-2">{card.activity.today}</span>
                </div>
                <span className="inline-flex items-center text-md text-green-500 mt-1">
                  <FaArrowTrendUp size={12} className="mr-1" /> {card.activity.trend} increase from yesterday
                </span>
              </div>
            )}

            {/* Revenue Overview */}
            {card.revenue && (
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-bold text-gray-800">{card.revenue.total}</p>
                  <p className="text-xs text-green-600 font-medium">{card.revenue.change}</p>
                </div>
                <div className="mt-2 text-xs text-gray-700 space-y-1">
                  {card.revenue.breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs Menu (scrollable horizontally) */}
      <div className="overflow-x-auto">
        <div className="flex space-x-2 min-w-max bg-[#F1F5F9] p-2 rounded-md mb-2 text-sm">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${
                tab === activeTab ? 'bg-white text-black shadow-sm rounded' : 'text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded  shadow-sm rounded-full">
        {activeTab === 'Dashboard' && (
          <div className="col-span-3 bg-white w-full">
            <SubDashboard />
          </div>
        )}
        {activeTab === 'User Management' && (
          <div className="col-span-3 bg-white w-full">
            <UserManagement />
          </div>
        )}
        {activeTab === 'Vendor Management' && (
          <div className="col-span-3 bg-white w-full">
            <VendorManagement />
          </div>
        )}
        {activeTab === 'Pending Approvals' && (
          <div className="col-span-3 bg-white w-full">
            <PendingApprovals />
          </div>
        )}
        {activeTab === 'Review Moderation' && (
          <div className="col-span-3 bg-white w-full">
            <ReviewModeration />
          </div>
        )}
        {activeTab === 'Content Management' && (
          <div className="col-span-3 bg-white w-full">
            <ContentManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

