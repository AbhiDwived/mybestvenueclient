import React, { useState } from 'react';

const BookingManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Static booking data
  const bookingsData = {
    all: [
      { id: 'BK001', customer: 'John & Sarah Wedding', customerPhone: '+91 98765 43210', vendor: 'Royal Events & Co.', venue: 'Royal Palace', date: '15 Mar 2024', status: 'confirmed', amount: '₹1,45,000' },
      { id: 'BK002', customer: 'Corporate Event - TechCo', customerPhone: '+91 87654 32109', vendor: 'Garden Events', venue: 'Garden View', date: '18 Mar 2024', status: 'pending', amount: '₹95,000' },
      { id: 'BK003', customer: 'Birthday Celebration', customerPhone: '+91 76543 21098', vendor: 'Beach Weddings', venue: 'Beach Resort', date: '20 Mar 2024', status: 'cancelled', amount: '₹55,000' },
      { id: 'BK004', customer: 'Anniversary Party', customerPhone: '+91 65432 10987', vendor: 'Sunset Events', venue: 'Sunset Villa', date: '22 Mar 2024', status: 'confirmed', amount: '₹75,000' },
      { id: 'BK005', customer: 'Raj & Priya Wedding', customerPhone: '+91 54321 09876', vendor: 'Grand Celebrations', venue: 'Grand Ballroom', date: '25 Mar 2024', status: 'pending', amount: '₹1,25,000' }
    ],
    confirmed: [
      { id: 'BK001', customer: 'John & Sarah Wedding', customerPhone: '+91 98765 43210', vendor: 'Royal Events & Co.', venue: 'Royal Palace', date: '15 Mar 2024', status: 'confirmed', amount: '₹1,45,000' },
      { id: 'BK004', customer: 'Anniversary Party', customerPhone: '+91 65432 10987', vendor: 'Sunset Events', venue: 'Sunset Villa', date: '22 Mar 2024', status: 'confirmed', amount: '₹75,000' },
      { id: 'BK007', customer: 'Corporate Gala', customerPhone: '+91 43210 98765', vendor: 'Business Events', venue: 'Business Center', date: '28 Mar 2024', status: 'confirmed', amount: '₹2,25,000' }
    ],
    pending: [
      { id: 'BK002', customer: 'Corporate Event - TechCo', customerPhone: '+91 87654 32109', vendor: 'Garden Events', venue: 'Garden View', date: '18 Mar 2024', status: 'pending', amount: '₹95,000' },
      { id: 'BK005', customer: 'Raj & Priya Wedding', customerPhone: '+91 54321 09876', vendor: 'Grand Celebrations', venue: 'Grand Ballroom', date: '25 Mar 2024', status: 'pending', amount: '₹1,25,000' }
    ],
    cancelled: [
      { id: 'BK003', customer: 'Birthday Celebration', customerPhone: '+91 76543 21098', vendor: 'Beach Weddings', venue: 'Beach Resort', date: '20 Mar 2024', status: 'cancelled', amount: '₹55,000' },
      { id: 'BK006', customer: 'Family Reunion', customerPhone: '+91 32109 87654', vendor: 'Mountain Events', venue: 'Mountain View', date: '27 Mar 2024', status: 'cancelled', amount: '₹65,000' }
    ]
  };

  const stats = [
    { title: 'Total Bookings', count: '245', type: 'all', color: 'blue', gradient: 'from-blue-50 to-blue-100' },
    { title: 'Confirmed', count: '180', type: 'confirmed', color: 'green', gradient: 'from-green-50 to-green-100' },
    { title: 'Pending', count: '45', type: 'pending', color: 'yellow', gradient: 'from-yellow-50 to-yellow-100' },
    { title: 'Cancelled', count: '20', type: 'cancelled', color: 'red', gradient: 'from-red-50 to-red-100' }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200',
      pending: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200',
      cancelled: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
    };
    return styles[status] || '';
  };

  const handleExport = () => {
    // Get the current filtered data
    const dataToExport = bookingsData[activeFilter];

    // Create CSV headers
    const headers = ['Vendor Name', 'Customer', 'Phone Number', 'Venue', 'Date', 'Status', 'Amount'];

    // Convert data to CSV format
    const csvData = [
      headers.join(','), // Add headers
      ...dataToExport.map(booking => [
        booking.vendor,
        booking.customer,
        booking.customerPhone,
        booking.venue,
        booking.date,
        booking.status,
        booking.amount
      ].join(','))
    ].join('\n');

    // Create blob and download
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
    <div className="px-4 py-3">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Bookings Management</h2>
          <p className="text-sm text-gray-500">View and manage all venue bookings</p>
        </div>
        <div>
          <button 
            onClick={handleExport}
            className="text-sm bg-gradient-to-r from-[#0f4c81] to-[#1a6cbd] text-white px-4 py-1.5 rounded-md hover:from-[#DEBF78] hover:to-[#E8D4A7] transition-all duration-300 shadow-md hover:shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm px-4 py-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {stats.map((stat) => (
            <div
              key={stat.type}
              onClick={() => setActiveFilter(stat.type)}
              className={`bg-gradient-to-r ${stat.gradient} px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300
                ${activeFilter === stat.type 
                  ? `shadow-md transform scale-[1.02] border border-${stat.color}-200` 
                  : 'hover:shadow-md hover:scale-[1.01] border border-transparent'}`}
            >
              <p className={`text-sm text-${stat.color}-600 mb-1 font-medium`}>{stat.title}</p>
              <p className={`text-xl font-semibold text-${stat.color}-700`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings Section */}
        <div className="border border-gray-100 rounded-lg px-4 py-3 shadow-md hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium">
              {activeFilter === 'all' ? 'Recent Bookings' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Bookings`}
            </p>
            <p className="text-xs text-gray-500">
              Showing {bookingsData[activeFilter].length} bookings
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left font-medium text-gray-600 pb-3 pr-4 border-b border-gray-100">Vendor Name</th>
                  <th className="text-left font-medium text-gray-600 pb-3 pr-4 border-b border-gray-100">Customer</th>
                  <th className="text-left font-medium text-gray-600 pb-3 pr-4 border-b border-gray-100">Phone Number</th>
                  <th className="text-left font-medium text-gray-600 pb-3 pr-4 border-b border-gray-100">Venue</th>
                  <th className="text-left font-medium text-gray-600 pb-3 pr-4 border-b border-gray-100">Date</th>
                  <th className="text-left font-medium text-gray-600 pb-3 pr-4 border-b border-gray-100">Status</th>
                  <th className="text-left font-medium text-gray-600 pb-3 border-b border-gray-100">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {bookingsData[activeFilter].map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-colors duration-300">
                    <td className="py-3 pr-4">{booking.vendor}</td>
                    <td className="pr-4">{booking.customer}</td>
                    <td className="pr-4">{booking.customerPhone}</td>
                    <td className="pr-4">{booking.venue}</td>
                    <td className="pr-4">{booking.date}</td>
                    <td className="pr-4">
                      <span className={`${getStatusBadge(booking.status)} px-3 py-1 rounded-full text-xs capitalize shadow-sm`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="font-medium">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement; 