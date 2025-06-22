import React, { useState, useEffect } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import { FaArrowTrendUp } from "react-icons/fa6";
import SubDashboard from './SubDashboard';
import UserManagement from './UserManagement';
import VendorManagement from './VendorManagement';
import PendingApprovals from './PendingApprovals';
import ReviewModeration from './ReviewModeration';
import ContentManagement from './ContentManagement';
import Contact from './Contact';
import SubscriberManagement from './SubscriberManagement';

// 🟢 Import RTK hooks
import {
  useGetAllUsersQuery,
  useGetAllVendorsQuery,
  useGetPendingVendorsQuery,
} from '../../features/admin/adminAPI'; // Update path if needed

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load activeTab from localStorage after component mounts
  useEffect(() => {
    const savedTab = localStorage.getItem('adminActiveTab') || 'Dashboard';
    setActiveTab(savedTab);
    setIsInitialized(true);
  }, []);

  // 🟡 Fetch admin statistics
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: vendorsData, isLoading: vendorsLoading } = useGetAllVendorsQuery();
  const { data: pendingData, isLoading: pendingLoading } = useGetPendingVendorsQuery();

  if (!pendingLoading && !pendingData) {
    // console.warn("⚠️ No pending vendor data returned.");
  }

  const tabs = [
    'Dashboard',
    'User Management',
    'Vendor Management',
    'Pending Approvals',
    'Review Moderation',
    'Content Management',
    'Subscribers',
    'Contacts'
  ];

  // 🟢 Build cardData with live API counts
  const cardData = [
    {
      title: "Platform Statistics",
      stats: [
        {
          label: "Total Users",
          value: usersLoading
            ? "Loading..."
            : Array.isArray(usersData)
              ? usersData.length
              : usersData?.users?.length || 0,
        },
        {
          label: "Total Vendors",
          value: vendorsLoading
            ? "Loading..."
            : Array.isArray(vendorsData)
              ? vendorsData.length
              : vendorsData?.vendors?.length || 0,
        },
        {
          label: "Pending Approvals",
          value: pendingLoading
            ? "Loading..."
            : Array.isArray(pendingData)
              ? pendingData.length
              : pendingData?.vendors?.length || 0,
          className: "text-yellow-600 font-semibold"
        },
        {
          label: "Total Reviews",
          value: "8,569" // Replace with live data later
        }
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

  // Show loading screen until we know which tab to display
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

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

      {/* Tabs Menu */}
      <div className="lg:mt-7">
        <div style={{ borderRadius: '5px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 bg-gray-200 py-1 px-1"
        >
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveTab(tab);
                localStorage.setItem('adminActiveTab', tab); // Persist tab selection
              }}
              style={{ borderRadius: '5px' }}
              className={`py-2 rounded-md font-medium whitespace-nowrap text-xs sm:text-sm transition ${tab === activeTab
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:bg-white/80'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="shadow-sm rounded-lg overflow-hidden">
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
        {activeTab === 'Subscribers' && (
          <div className="col-span-3 bg-white w-full">
            <SubscriberManagement />
          </div>
        )}
        {activeTab === 'Contacts' && (
          <div className="col-span-3 bg-white w-full">
            <Contact />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;