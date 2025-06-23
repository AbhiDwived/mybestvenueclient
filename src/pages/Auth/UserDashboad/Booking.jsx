import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, DollarSign, Trash2 } from 'lucide-react';
import { useGetUserBookingsQuery, useCreateBookingMutation, useDeleteBookingMutation, useGetAvailableVendorsQuery } from '../../../features/bookings/bookingAPI';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import Loader from "../../../components/{Shared}/Loader";

const BookingBudget = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // RTK Query hooks
  const {
    data: bookingData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetUserBookingsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [createBooking, { isLoading: isCreating }] = useCreateBookingMutation();
  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const { data: vendorsData, isLoading: isLoadingVendors } = useGetAvailableVendorsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Extract data from API response
  const bookings = bookingData?.data?.bookings || [];
  const totalPlanned = bookingData?.data?.totalPlanned || 0;
  const totalSpent = bookingData?.data?.totalSpent || 0;
  const totalBookingsCount = bookingData?.data?.totalBookingsCount || 0;
  const remaining = totalPlanned - totalSpent;
  const availableVendors = vendorsData?.data || [];

  // Form state
  const [formData, setFormData] = useState({
    vendorId: '',
    vendorName: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    guestCount: '',
    plannedAmount: '',
  });

  // Show error if API request fails
  useEffect(() => {
    setTimeout(() => {
      if (isError) {
        toast.error(`Error loading bookings: ${error?.data?.message || 'Unknown error'}`);
      }
    }, 1000)
  }, [isError, error]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update vendor name when vendor ID changes
  const handleVendorChange = (vendorId) => {
    const selectedVendor = availableVendors.find(vendor => vendor._id === vendorId);
    if (selectedVendor) {
      setFormData(prev => ({
        ...prev,
        vendorId,
        vendorName: selectedVendor.businessName || selectedVendor.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        vendorId: '',
        vendorName: ''
      }));
    }
  };

  const handleAddBooking = async () => {
    if (formData.vendorName && formData.eventType && formData.plannedAmount) {
      try {
        await createBooking({
          vendorId: formData.vendorId || null,
          vendorName: formData.vendorName,
          eventType: formData.eventType,
          eventDate: formData.eventDate || null,
          eventTime: formData.eventTime || null,
          venue: formData.venue || '',
          guestCount: parseInt(formData.guestCount) || 0,
          plannedAmount: parseFloat(formData.plannedAmount) || 0,
        }).unwrap();

        // Reset form
        setFormData({
          vendorId: '',
          vendorName: '',
          eventType: '',
          eventDate: '',
          eventTime: '',
          venue: '',
          guestCount: '',
          plannedAmount: ''
        });

        setTimeout(() => {
          toast.success('Booking added successfully');
        }, 1000)
      } catch (err) {
        toast.error(`Error adding booking: ${err.data?.message || 'Unknown error'}`);
      }
    } else {
      toast.warning('Please fill in all required fields');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await deleteBooking(bookingId).unwrap();
      toast.success('Booking deleted successfully');
    } catch (err) {
      toast.error(`Error deleting booking: ${err.data?.message || 'Unknown error'}`);
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

  // Show loading state
  if (isLoading || isCreating || isDeleting || isLoadingVendors) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen p-2 mt-3 md:p-6 lg:mx-3">
      <div className="">
        {/* Header */}
        <div className="text-center space-y-2 ">
          <h3 className="font-bold mb-3 text-gray-800 flex items-left  gap-2">
            <DollarSign className="h-7 w-7 " />
            Booking Budget Summary
          </h3>

        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 shadow-md p-2 rounded-md">
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
                  Vendor *
                </label>
                <select
                  id="vendorId"
                  value={formData.vendorId}
                  onChange={(e) => handleVendorChange(e.target.value)}
                  className="w-full px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                >
                  <option value="">Select a vendor</option>
                  {isLoadingVendors ? (
                    <option disabled>Loading vendors...</option>
                  ) : (
                    availableVendors.map(vendor => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.businessName || vendor.name}
                      </option>
                    ))
                  )}
                  <option value="custom">Other (Enter manually)</option>
                </select>
                {formData.vendorId === 'custom' && (
                  <input
                    id="vendorName"
                    placeholder="Enter vendor name"
                    value={formData.vendorName}
                    onChange={(e) => handleInputChange('vendorName', e.target.value)}
                    className="w-full mt-2 px-4 py-2 bg-white/50 border border-gray-200 rounded focus:border-purple-400 focus:ring focus:ring-purple-400"
                  />
                )}
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
              disabled={isCreating}
              style={{ borderRadius: '5px' }}
              className="bg-[#0F4C81] text-white px-8 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:transform-none"
            >
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? 'Adding...' : 'Add Booking'}
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
                <div key={booking._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                  <button
                    onClick={() => handleDeleteBooking(booking._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <h4 className="font-semibold text-gray-800">{booking.vendorName}</h4>
                  <p className="text-sm text-purple-600 font-medium">{booking.eventType}</p>
                  {booking.eventDate && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(booking.eventDate).toLocaleDateString()}
                    </p>
                  )}
                  {booking.venue && <p className="text-sm text-gray-600">{booking.venue}</p>}
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <p className="text-sm font-semibold text-green-600">
                      Planned: ₹{booking.plannedAmount.toLocaleString()}
                    </p>
                    {booking.spentAmount > 0 && (
                      <p className="text-sm font-semibold text-purple-600">
                        Spent: ₹{booking.spentAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
        toastClassName="custom-toast"
      />
    </div>
  );
};

export default BookingBudget;