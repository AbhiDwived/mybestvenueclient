import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllBookingsQuery, useUpdateBookingMutation } from '../../features/bookings/bookingAPI';
import Loader from "../../components/{Shared}/Loader";
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: response, isLoading, error } = useGetAllBookingsQuery();
  const [updateBooking] = useUpdateBookingMutation();

  const handleViewVendor = (booking) => {
    const vendorId = booking.vendorId || booking.vendor?._id || booking.vendor?.id;
    if (vendorId) {
      navigate(`/preview-profile/${vendorId}`);
    } else {
      console.error("Vendor ID missing for booking", booking);
      toast.warning("Vendor ID is missing. Cannot view vendor profile.");
    }
  };

  const handleViewUser = (booking) => {
    const userId = booking.user?._id || booking.user?.id || booking.userId;
    if (userId) {
      navigate(`/admin/user_management?userId=${userId}`);
    } else {
      console.error("User ID missing for booking", booking);
      toast.warning("User ID is missing. Cannot view user profile.");
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const allBookings = response?.data?.bookings || [];

  const bookingsData = {
    all: allBookings,
    confirmed: allBookings.filter(b => b.status === 'confirmed'),
    pending: allBookings.filter(b => b.status === 'pending'),
    cancelled: allBookings.filter(b => b.status === 'cancelled')
  };

  const stats = [
    {
      title: 'Total Bookings',
      count: response?.data?.totalBookingsCount || '0',
      type: 'all',
      color: 'blue',
      gradient: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Confirmed',
      count: response?.data?.confirmedBookingsCount || '0',
      type: 'confirmed',
      color: 'green',
      gradient: 'from-green-50 to-green-100'
    },
    {
      title: 'Pending',
      count: response?.data?.pendingBookingsCount || '0',
      type: 'pending',
      color: 'yellow',
      gradient: 'from-yellow-50 to-yellow-100'
    },
    {
      title: 'Cancelled',
      count: bookingsData.cancelled.length,
      type: 'cancelled',
      color: 'red',
      gradient: 'from-red-50 to-red-100'
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handleExport = () => {
    const dataToExport = bookingsData[activeFilter];
    const headers = ['Vendor Name', 'Customer', 'Phone Number', 'Venue', 'Date', 'Status', 'Amount'];

    const csvData = [
      headers.join(','),
      ...dataToExport.map(booking => [
        booking.vendorName || 'N/A',
        booking.user?.name || 'N/A',
        booking.user?.phone || 'N/A',
        booking.venue || 'N/A',
        new Date(booking.eventDate).toLocaleDateString(),
        booking.status,
        `₹${Number(booking.plannedAmount || 0).toLocaleString('en-IN')}`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_${activeFilter}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="py-3">
      {/* Header and Export */}
      <div className="flex justify-between items-center mb-4">
        <div className="mx-3">
          <h1 className="text-md lg:text-2xl font-bold">Bookings Management</h1>
          <p className="text-sm text-gray-500">View and manage all venue bookings</p>
        </div>
        <button
          onClick={handleExport}
          className="text-sm bg-gradient-to-r from-[#0f4c81] to-[#1a6cbd] text-white p-2 mx-3 rounded-md hover:from-[#DEBF78] hover:to-[#E8D4A7] shadow-md flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 mx-3">
          {stats.map((stat) => (
            <div
              key={stat.type}
              onClick={() => setActiveFilter(stat.type)}
              className={`cursor-pointer bg-gradient-to-r ${stat.gradient} px-4 py-2.5 rounded-lg transition-all duration-300
                ${activeFilter === stat.type
                  ? `shadow-md transform scale-[1.02] border border-${stat.color}-200`
                  : 'hover:shadow-md hover:scale-[1.01] border border-transparent'}`}
            >
              <p className={`text-sm text-${stat.color}-600 mb-1 font-bold`}>{stat.title}</p>
              <p className={`text-xl font-semibold text-${stat.color}-700`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="border border-gray-100 rounded-lg px-3 py-3 lg:mx-3 shadow-md hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-bold">
              {activeFilter === 'all' ? 'Recent Bookings' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
            </p>
            <p className="text-xs text-gray-500">
              Showing {bookingsData[activeFilter]?.length || 0} bookings
            </p>
          </div>

          {/* Tailwind Styled Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 font-semibold text-gray-600">Vendor Name</th>
                  <th className="px-4 py-2 font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-2 font-semibold text-gray-600">Phone</th>
                  <th className="px-4 py-2 font-semibold text-gray-600">Venue</th>
                  <th className="px-4 py-2 font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-2 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-2 font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookingsData[activeFilter]?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No bookings found for the selected filter.
                    </td>
                  </tr>
                ) : (
                  bookingsData[activeFilter].map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => handleViewVendor(booking)} className="text-black hover:underline">
                          {booking.vendorName || 'N/A'}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {booking.user ? (
                          <button onClick={() => handleViewUser(booking)} className="text-black hover:underline">
                            {booking.user.name || 'N/A'}
                          </button>
                        ) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {booking.user?.phone || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {booking.venue || 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <span className={`inline-block text-md font-medium px-2 py-1 rounded-md ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        ₹{Number(booking.plannedAmount || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;