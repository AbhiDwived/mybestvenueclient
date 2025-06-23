import React, { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { FiCheckCircle } from "react-icons/fi";
import { BsExclamationCircle } from "react-icons/bs";
import { } from "../../features/bookings/bookingAPI";
import { useSelector, useDispatch } from 'react-redux';
import { useGetVendorBookingsListQuery, useUpdateVendorBookingMutation } from "../../features/vendors/vendorAPI";




export default function BookingManagement() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);





  const vendor = useSelector((state) => state.vendor.vendor);
  const isAuthenticated = useSelector((state) => state.vendor.isAuthenticated);
  const vendorId = vendor?.id;


  const { data, isLoading, error, refetch } = useGetVendorBookingsListQuery(vendorId);
  const [updateVendorBooking, { isLoading: updating }] = useUpdateVendorBookingMutation();

  const bookings = data?.data?.bookings || [];
  console.log("bookings", bookings);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    guestCount: 0,
    plannedAmount: 0,
    venue: ''
  });


  const statusColors = {
    confirmed: { class: "bg-green-100 text-green-800", icon: <FiCheckCircle size={16} /> },
    pending: { class: "bg-yellow-100 text-yellow-800", icon: <BsExclamationCircle size={16} /> },
    completed: { class: "bg-blue-100 text-blue-800", icon: <FiCheckCircle size={16} /> }
  };


  const overviewStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status?.toLowerCase() === 'pending').length,
    confirmed: bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length,
    completed: bookings.filter(b => b.status?.toLowerCase() === 'completed').length
  };



  const filteredBookings = bookings.filter((booking) => {
    const matchesName = booking.user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || booking.status === statusFilter;
    return matchesName && matchesStatus;
  });


  const handleModalClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedBooking(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      eventTime: '',
      guestCount: 0,
      plannedAmount: 0,
      venue: ''
    });
  };



  const handleSave = async () => {
    if (isEditMode && selectedBooking) {
      try {
        console.log("bookingId", selectedBooking._id);

        console.log("vendor from token:", vendorId);
        await updateVendorBooking({
          bookingId: selectedBooking._id,
          bookingData: {
            eventType: formData.eventType,
            eventDate: formData.eventDate,
            eventTime: formData.eventTime,
            guestCount: formData.guestCount,
            plannedAmount: formData.plannedAmount,
            venue: formData.venue,

          }
        }).unwrap();
        alert("Booking updated successfully!");
        refetch();
        handleModalClose();
      } catch (error) {
        console.error("Error updating booking", error);
        alert("Failed to update booking.");
      }
    } else {

      alert("Creating new bookings not implemented yet");
    }
  };

  if (!bookings.length) {
    return <p className="text-center mt-10 text-gray-500">No bookings found</p>;
  }

  if (isLoading) return <p className="text-center mt-10">Loading bookings...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to fetch bookings</p>;

  return (
    <div className="p-2 bg-gray-50 min-h-screen sm:m-6">
      {/* Booking Overview */}
      <div className="border rounded-lg p-4 mb-6 bg-white">
        <h2 className="text-lg font-semibold mb-4">Booking Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 text-center p-2 rounded h-28">
            <h2 className="text-xl font-bold text-blue-600">{overviewStats.total}</h2>
            <p className="text-sm">Total Bookings</p>
          </div>
          <div className="bg-yellow-50 text-center p-2 rounded h-28">
            <h2 className="text-xl font-bold text-yellow-600">{overviewStats.pending}</h2>
            <p className="text-sm">Pending</p>
          </div>
          <div className="bg-green-50 text-center p-2 rounded h-28">
            <h2 className="text-xl font-bold text-green-600">{overviewStats.confirmed}</h2>
            <p className="text-sm">Confirmed</p>
          </div>
          <div className="bg-purple-50 text-center p-2 rounded h-28">
            <h2 className="text-xl font-bold text-purple-600">{overviewStats.completed}</h2>
            <p className="text-sm">Completed</p>
          </div>
        </div>
      </div>

      {/* Heading and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="sm:text-2xl text-[15px] font-semibold">Booking Management</p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#19599A] text-white px-3 py-1 rounded hover:bg-[#19599A] whitespace-nowrap  sm:w-auto sm:ml-0 ml-4 text-sm sm:text-base "
        >
          + Add Booking
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full p-2 rounded-md">
        <input
          type="text"
          placeholder="Search bookings..."
          className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full lg:w-60 border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Booking Cards */}
      {filteredBookings.map((booking) => (
        <div
          key={booking._id}
          className="relative border border-gray-200 rounded-lg px-2 py-4 mb-4 bg-white shadow-sm"
        >
          {/* Top Row: Name and Actions */}
          <div className="flex justify-between items-start flex-wrap md:flex-nowrap mb-2  sm:justify-center sm:items-center">
            <div className="items-center justify-between inline sm:flex  ">
              <span className="text-[10px] sm:text-[20px]  font-semibold text-gray-800">{booking.user.name || "Navneet"}</span>
              <div className="inline ">
                <div className={`flex justify-center gap-1 w-[80px] sm:mx-2 sm:w-[100px] py-1 items-center-safe rounded  text-[10px]  sm:text-[12px]   ${statusColors[booking.status]?.class}`}>
                  <span className={`  font-medium     `}>
                    {statusColors[booking.status]?.icon}
                  </span>
                  <span className="">{booking.status}</span>
                </div>

              </div>
            </div>
            <div className="flex items-center gap-2 md:mt-2  ml-auto md:w[70px] ">
              <button className="hover:bg-[#DEBF78] text-gray-600 rounded p-1 border border-gray-300" title="View">
                <IoEyeOutline className="w-[12px] sm:w-[15px]" />
              </button>
              <button className="hover:bg-[#DEBF78] text-gray-600 rounded p-1 border border-gray-300" title="Edit">
                <FaRegEdit className="w-[12px] sm:w-[15px]"

                  onClick={() => {
                    setIsEditMode(true);
                    setShowModal(true);
                    setSelectedBooking(booking);
                    setFormData({
                      eventType: booking.eventType,
                      eventDate: booking.eventDate.split('T')[0],
                      eventTime: booking.eventTime,
                      guestCount: booking.guestCount,
                      plannedAmount: booking.plannedAmount,
                      venue: booking.venue,
                      name: booking.user?.name || '',
                      email: booking.user?.email || '',
                      phone: booking.user?.phone || '',
                    });
                  }}

                />
              </button>
              <select className="border border-gray-300 rounded-md text-[8px] sm:text-[10px] sm:w-[100px] w-[80px]">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <FaCalendarAlt className="text-gray-500" />

                {new Date(booking.eventDate).toLocaleDateString()} at {booking.eventTime}
              </div>
              <div className="text-sm text-gray-500">

                Event: {booking.eventType} | Guests: {booking.guestCount}
              </div>
            </div>
            <div className="flex flex-row gap-2 justify-between">
              <div className="p-2 text-sm flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-600" />
                <span className="text-gray-700 font-medium">{booking.venue}</span>
              </div>
              <div className="p-2 text-sm font-semibold text-gray-700">

                ₹{booking.plannedAmount?.toLocaleString("en-IN") || 0}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center px-2 ">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 shadow-lg overflow-y-auto max-h-[90vh] ">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Add Booking</h2>
                <p className="text-sm text-gray-500">Update booking information</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                <ImCross />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Client Name</label>


                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, ClientName: e.target.value })}
                  className="w-full border rounded p-2"
                />

              </div>
              <div>
                <label className="text-sm font-medium">Client Email</label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded p-2"
                />

              </div>
              <div>
                <label className="text-sm font-medium">Client Phone</label>

                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Event Type</label>

                <input
                  type="text"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Event Date</label>

                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Event Time</label>

                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Guest Count</label>

                <input
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Budget</label>

                <input
                  type="number"
                  value={formData.plannedAmount}
                  onChange={(e) => setFormData({ ...formData, plannedAmount: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Venue</label>

                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="mt-2 flex justify-end p-4 rounded">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded"
                >
                  Cancel
                </button>


                <button
                  onClick={handleSave}
                  className="bg-[#19599A] text-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:bg-[#19599A]"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : isEditMode ? 'Update' : 'Save'}
                </button>

              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
}




