import React, { useEffect, useMemo } from 'react';
import { HiOutlineUser } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllUsersQuery,
  useGetPendingVendorsQuery,
  useGetAllVendorsQuery,
  useGetRecentActivitiesQuery,
} from '../../features/admin/adminAPI';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const getColor = (type = '') => {
  if (type.includes('Vendor')) return 'yellow';
  if (type.includes('User')) return 'green';
  if (type.includes('Review')) return 'red';
  if (type.includes('Blog')) return 'blue';
  return 'gray';
};

const SubDashboard = () => {
  const navigate = useNavigate();

  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: pendingVendorsData } = useGetPendingVendorsQuery();
  const { data: vendorsData, isLoading: vendorsLoading } = useGetAllVendorsQuery();
  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
    isSuccess,
    isError,
  } = useGetRecentActivitiesQuery();

  const formattedActivity = useMemo(() => {
    if (!isSuccess || !activityData?.activities) return [];
    return activityData.activities.map(act => {
      const diff = Date.now() - new Date(act.createdAt).getTime();
      const mins = Math.floor(diff / 60000);
      const time =
        mins < 60
          ? `${mins} minutes ago`
          : mins < 1440
            ? `${Math.floor(mins / 60)} hours ago`
            : `${Math.floor(mins / 1440)} days ago`;
      return {
        ...act,
        time,
        color: getColor(act.type),
      };
    });
  }, [activityData, isSuccess]);

  useEffect(() => {
    if (isError && activityError) {
      console.error('Failed to fetch recent activity:', activityError);
    }
  }, [isError, activityError]);

  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };

  const analyticsData = useMemo(() => {
    const last30 = getLast30Days();
    const userCounts = Object.fromEntries(last30.map(date => [date, 0]));
    const vendorCounts = Object.fromEntries(last30.map(date => [date, 0]));

    usersData?.users?.forEach(u => {
      const d = new Date(u.createdAt);
      if (!isNaN(d)) {
        const date = d.toISOString().slice(0, 10);
        if (userCounts[date] !== undefined) userCounts[date]++;
      }
    });

    vendorsData?.vendors?.forEach(v => {
      const rawDate = v.appliedDate || v.created_at || v.created_on || v.createdAt;
      const d = new Date(rawDate);
      if (!isNaN(d)) {
        const date = d.toISOString().slice(0, 10);
        if (vendorCounts[date] !== undefined) vendorCounts[date]++;
      }
    });

    return last30.map(date => ({
      date: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      users: userCounts[date],
      vendors: vendorCounts[date],
    }));
  }, [usersData, vendorsData]);

  const recentUsers = useMemo(() => {
    return (
      usersData?.users
        ?.slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .map(user => ({
          name: user.name || user.fullName || 'No Name',
          email: user.email || 'No Email',
          type: user.role === 'vendor' ? 'Vendor' : 'User',
          date: new Date(user.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }),
        })) || []
    );
  }, [usersData]);

  const categories = useMemo(() => {
    const counts = {};
    vendorsData?.vendors?.forEach(v => {
      const cat = v.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const total = vendorsData?.vendors?.length || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [vendorsData]);

  const tasks = [
    {
      title: 'Vendor Approvals',
      detail: `${pendingVendorsData?.vendors?.length || 0} vendors waiting for approval`,
      action: 'Review Now',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-500',
      onClick: () => navigate('/admin/pending_vendor_approvals'),
    },
    {
      title: 'Reported Reviews',
      detail: '3 reviews flagged for moderation',
      action: 'Moderate',
      color: 'bg-red-100 border-red-300 text-red-500',
      onClick: () => navigate('/admin/review_moderation'),
    },
    {
      title: 'Content Updates',
      detail: '6 entries pending to review',
      action: 'View Content',
      color: 'bg-blue-100 border-blue-300 text-blue-500',
      onClick: () => navigate('/admin/content_management'),
    },
  ];

  const colorMap = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400',
  };

  return (
    <div className="space-y-4 text-sm text-gray-800 font-serif p-2 sm:p-4">
      {/* Top Section: Chart + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="md:col-span-1 lg:col-span-2 bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-md mb-1">Daily Activity Overview</h2>
          <p className="text-gray-500 text-xs mb-4">User registrations and vendor signups over the last 30 days</p>
          <div className="h-[200px] md:h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%" style={{marginLeft:'-50px'}} minWidth={320}>
              <LineChart data={analyticsData}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#0f4c81" name="Users" />
                <Line type="monotone" dataKey="vendors" stroke="#DEBF78" name="Vendors" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm">
          <h2 className="font-semibold text-md mb-1">Recent Activity</h2>
          <p className="text-gray-500 text-xs mb-4">Latest actions on the platform</p>
          {activityLoading ? (
            <p>Loading...</p>
          ) : formattedActivity.length === 0 ? (
            <p className="text-xs text-gray-400">No recent activity found.</p>
          ) : (
            <ul className="space-y-3 text-xs m-2 pl-0 overflow-auto max-h-[300px]">
              {formattedActivity.map((item, i) => (
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
          )}
          <button
            className="mt-4 w-full text-gray-800 border border-[#0f4c81] rounded py-1.5 text-xs hover:bg-[#DEBF78] transition"
            onClick={() => navigate('/admin/activity_logs')}
          >
            View All Activity
          </button>
        </div>
      </div>

      {/* Bottom Section: Users, Tasks, Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow border p-4 w-full">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users or Vendors</h2>
          <p className="text-sm text-gray-500 mb-4">Newly registered users or vendors</p>
          <div className="space-y-4">
            {usersLoading || vendorsLoading ? (
              <div>Loading...</div>
            ) : (
              [...(usersData?.users || []), ...(vendorsData?.vendors || [])]
                .map(item => {
                  const dateRaw = item.createdAt || item.created_at || item.created_on || item.appliedDate;
                  return {
                    id: item._id || item.id,
                    name: item.name || item.fullName || item.businessName || 'No Name',
                    email: item.email || 'No Email',
                    type: vendorsData?.vendors?.some(v => v._id === item._id) ? 'Vendor' : 'User',
                    date: new Date(dateRaw),
                    dateStr: new Date(dateRaw).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    }),
                  };
                })
                .filter(item => !isNaN(item.date))
                .sort((a, b) => b.date - a.date)
                .slice(0, 3)
                .map((item, index) => (
                  <div key={item.id || index} className="flex items-start space-x-3 border-b pb-4 last:border-none">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <HiOutlineUser size={30} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-400">{item.dateStr}</span>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
          <button
            className="mt-4 w-full border border-gray-300 rounded py-2 text-sm text-gray-700 hover:bg-[#DEBF78] transition"
            onClick={() => navigate('/admin/user_management')}
          >
            View All Users
          </button>
        </div>

        <div className="bg-white p-3 rounded shadow-sm w-full">
          <h2 className="font-semibold text-md mb-2">Pending Tasks</h2>
          <p className="text-gray-500 text-xs mb-2">Items that need your attention</p>
          <ul className="text-xs space-y-3" style={{marginLeft:'-35px', minWidth: '320px'}}>
            {tasks.map((task, i) => (
              <li key={i} className={`p-2 border-l-4 ${task.color} rounded shadow-sm`}>
                <p className="font-medium text-sm">{task.title}</p>
                <p className="text-gray-600 text-xs">{task.detail}</p>
                <button className="text-blue-700 text-xs nav-Link mt-1" onClick={task.onClick}>
                  {task.action}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-3 rounded shadow-sm w-full">
          <h2 className="font-semibold text-md mb-2">Popular Categories</h2>
          <ul className="space-y-3 text-xs pl-0" style={{marginLeft:'-35px', minWidth: '320px'}}>
            {vendorsLoading ? (
              <div>Loading...</div>
            ) : !categories || categories.length === 0 ? (
              <div>No categories found.</div>
            ) : (
              categories.map((cat, i) => (
                <li key={i}>
                  <div className="flex justify-between mb-1">
                    <span>{cat.name}</span>
                    <span>{cat.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-4 rounded">
                    <div
                      className="bg-[#0f4c81] h-4 rounded"
                      style={{ width: `${cat.percent}%` }}
                    ></div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SubDashboard;
