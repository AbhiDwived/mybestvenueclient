import React, { useState } from 'react';
import { Calendar, Clock, Plus, DollarSign } from 'lucide-react';

const BookingBudget = () => {
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    vendorName: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    guestCount: '',
    plannedAmount: '',
  });

  const totalPlanned = bookings.reduce((sum, booking) => sum + booking.plannedAmount, 0);
  const totalSpent = bookings.reduce((sum, booking) => sum + (booking.spentAmount || 0), 0);
  const remaining = totalPlanned - totalSpent;
  const totalBookingsCount = bookings.length;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddBooking = () => {
    if (formData.vendorName && formData.eventType && formData.plannedAmount) {
      const newBooking = {
        id: Date.now().toString(),
        vendorName: formData.vendorName,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        venue: formData.venue,
        guestCount: parseInt(formData.guestCount) || 0,
        plannedAmount: parseFloat(formData.plannedAmount) || 0,
        spentAmount: 0
      };
      setBookings(prev => [...prev, newBooking]);

      // Reset form
      setFormData({
        vendorName: '',
        eventType: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        guestCount: '',
        plannedAmount: ''
      });
    }
  };

  const eventTypes = [
    'Wedding Ceremony',
    'Reception',
    'Photography',
    'Videography',
    'Catering',
    'Flowers',
    'Music/DJ',
    'Transportation',
    'Accommodation',
    'Other'
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="lg:mx-16">
        {/* Header */}
        <div className="text-center space-y-2 ">
          <h5 className="font-bold mb-3 text-gray-800 flex items-left  gap-2">
            <DollarSign className="h-6 w-7 " />
            Booking Budget Summary
          </h5>

        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 shadow-md p-3 rounded-md">
          <div className="bg-blue-50 border border-blue-200 rounded-lg transition-shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">₹{totalPlanned.toLocaleString()}</div>
            <div className="text-sm mt-1">Total Planned</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg  transition-shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">₹{totalSpent.toLocaleString()}</div>
            <div className="text-sm mt-1">Total Spent</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg  transition-shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">₹{remaining.toLocaleString()}</div>
            <div className="text-sm  mt-1">Remaining</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg transition-shadow p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{totalBookingsCount}</div>
            <div className="text-sm  mt-1">Total Bookings</div>
          </div>
        </div>

        {/* Add New Booking Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 lg:mt-5">
          <h4 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4">
            <Plus className="h-5 w-5 " /> Add New Booking
          </h4>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
                  Vendor Name *
                </label>
                <input
                  id="vendorName"
                  placeholder="e.g. Dream Photography"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                  Event Type *
                </label>
                <select
                  id="eventType"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                >
                  <option value="">Select type</option>
                  {eventTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="plannedAmount" className="block text-sm font-medium text-gray-700">
                  Planned Amount (₹) *
                </label>
                <input
                  id="plannedAmount"
                  type="number"
                  placeholder="50000"
                  value={formData.plannedAmount}
                  onChange={(e) => handleInputChange('plannedAmount', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                  Event Date
                </label>
                <div className="relative">
                  <input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleInputChange('eventDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">
                  Event Time
                </label>
                <div className="relative">
                  <input
                    id="eventTime"
                    type="time"
                    value={formData.eventTime}
                    onChange={(e) => handleInputChange('eventTime', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                  Venue
                </label>
                <input
                  id="venue"
                  placeholder="e.g. Grand Ballroom"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                  Guest Count
                </label>
                <input
                  id="guestCount"
                  type="number"
                  placeholder="150"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                />
              </div>
            </div>

            <button
              onClick={handleAddBooking}
              style={{ borderRadius: '5px' }}
              className="bg-[#0F4C81] text-white px-8 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Booking
              </span>
            </button>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-6 lg:mt-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No bookings yet</h3>
              <p className="text-gray-500">Add your first booking to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map(booking => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-semibold text-gray-800">{booking.vendorName}</h4>
                  <p className="text-sm text-purple-600 font-medium">{booking.eventType}</p>
                  {booking.eventDate && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {booking.eventDate}
                    </p>
                  )}
                  {booking.venue && <p className="text-sm text-gray-600">{booking.venue}</p>}
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm font-semibold text-green-600">
                      Planned: ₹{booking.plannedAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingBudget;