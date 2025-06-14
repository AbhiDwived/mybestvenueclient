
import React, { useState } from "react";
import { FiEye, FiEdit } from "react-icons/fi";
import { FaCalendarAlt, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { TfiNotepad } from "react-icons/tfi";
import { ImCross } from "react-icons/im";


const bookingsData = [
  {
    id: 1,
    name: "Arjun & Meera Kumar",
    status: "Pending",
    dateTime: "2024-11-15 at 10:00 AM",
    location: "Grand Palace Hotel, Delhi",
    event: "Wedding",
    guests: 200,
    price: "75,000",
  },
  {
    id: 2,
    name: "Rohan & Priya Sharma",
    status: "Pending",
    dateTime: "2024-12-07 at 6:00 PM",
    location: "Beach Resort, Goa",
    event: "Engagement",
    guests: 80,
    price: "45,000",
  },
  {
    id: 3,
    name: "Corporate Solutions Ltd",
    status: "Completed",
    dateTime: "2024-10-25 at 9:00 AM",
    location: "Convention Center, Mumbai",
    event: "Corporate Event",
    guests: 300,
    price: "60,000",
  },
];


const bookings = [
  {
    id: 1,
    name: 'Arjun & Meera Kumar',
    status: 'Pending',
    date: '2024-11-15 at 10:00 AM',
    location: 'Grand Palace Hotel, Delhi',
    event: 'Wedding',
    guests: 200,
    amount: '75,000'
  },
  {
    id: 2,
    name: 'Rohan & Priya Sharma',
    status: 'Pending',
    date: '2024-12-07 at 6:00 PM',
    location: 'Beach Resort, Goa',
    event: 'Engagement',
    guests: 80,
    amount: '45,000'
  },
  {
    id: 3,
    name: 'Corporate Solutions Ltd',
    status: 'Completed',
    date: '2024-10-25 at 9:00 AM',
    location: 'Convention Center, Mumbai',
    event: 'Corporate Event',
    guests: 300,
    amount: '60,000'
  }
];



const statusColors = {
  Confirmed: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Completed: "bg-blue-100 text-blue-800",
};

const overviewStats = {
  total: bookings.length,
  pending: bookings.filter(b => b.status === 'Pending').length,
  confirmed: bookings.filter(b => b.status === 'Confirmed').length,
  completed: bookings.filter(b => b.status === 'Completed').length
};
export default function BookingManagement() {
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const filteredBookings = bookingsData.filter((booking) => {
    const matchesName = booking.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Status' || booking.status === statusFilter;
    return matchesName && matchesStatus;
  });


  const handleSave = () => {
  setShowModal(false); // Close the modal
  alert("Booking saved successfully!"); // Show alert
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Booking Overview */}
      <div className="border rounded-lg p-4 mb-6 bg-white">
        <h2 className="text-lg font-semibold mb-4">Booking Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 text-center p-4 rounded">
            <h2 className="text-xl font-bold text-blue-600">{overviewStats.total}</h2>
            <p className="text-sm">Total Bookings</p>
          </div>
          <div className="bg-yellow-50 text-center p-4 rounded">
            <h2 className="text-xl font-bold text-yellow-600">{overviewStats.pending}</h2>
            <p className="text-sm">Pending</p>
          </div>
          <div className="bg-green-50 text-center p-4 rounded">
            <h2 className="text-xl font-bold text-green-600">{overviewStats.confirmed}</h2>
            <p className="text-sm">Confirmed</p>
          </div>
          <div className="bg-purple-50 text-center p-4 rounded">
            <h2 className="text-xl font-bold text-purple-600">{overviewStats.completed}</h2>
            <p className="text-sm">Completed</p>
          </div>
        </div>
      </div>


      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Booking Management</h2>
        {/* <button className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Booking</button> */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#19599A] text-white px-4 py-2 rounded hover:bg-[]#19599A"
        >
          Add Booking +
        </button>
      </div>



      <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full p-2 rounded-md ">
        {/* Full-width search input */}
        <input
          type="text"
          placeholder="Search bookings..."
          className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-800"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Status filter dropdown */}
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





      {filteredBookings.map((booking) => (
        <div
          key={booking.id}
          className="border border-gray-200 rounded-lg px-4 py-4 mb-4 bg-white shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Column: Name, Date, Event */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-md font-semibold text-gray-800">{booking.name}</h3>
                <span
                  className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded ${statusColors[booking.status]}`}
                >
                  {booking.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <FaCalendarAlt className="text-gray-500" />
                {booking.dateTime}
              </div>
              <div className="text-sm text-gray-500">
                Event: {booking.event} | Guests: {booking.guests}
              </div>
            </div>

            {/* Second Column: Location and Price */}


            <div className="flex flex-row  gap-2 mt-4  justify-between ">
              <div className=" p-2 text-sm flex items-left gap-1">
                <FaMapMarkerAlt className="text-gray-600" />
                <span className="text-gray-700 font-medium">{booking.location}</span>
              </div>
              <div className=" p-2 text-sm font-semibold text-gray-700 flex items-right">
                ₹{booking.price}
              </div>
            </div>


            {/* Third Column: Action Buttons */}


            <div className="flex flex-row sm:flex-row justify-end items-center gap-2 mb-4">
              <button className=" hover:bg-[#DEBF78] text-gray-600 rounded p-2 border border-gray-300" title="View">
                <IoEyeOutline />
              </button>
              <button className=" hover:bg-[#DEBF78] text-gray-600 rounded p-2 border border-gray-300" title="Edit">
                <FaRegEdit />
              </button>

              <select className="border border-gray-300 rounded-md p-2 text-sm">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>



          </div>
        </div>
      ))}


      {showModal && (
        <div className="fixed inset-0  bg-gray-500 bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Add Booking</h2>
                <p className="text-sm text-gray-500">Update booking information</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">
                {/* &times; */}
                <ImCross />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Client Name</label>
                <input type="text" defaultValue="New Client" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Client Email</label>
                <input type="email" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Client Phone</label>
                <input type="text" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Event Type</label>
                <input type="text" defaultValue="Wedding" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Event Date</label>
                <input
                  type="date"
                  className="w-full border rounded p-2"
                  placeholder="dd/mm/yy"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Event Time</label>
                <input type="time" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Guest Count</label>
                <input type="number" defaultValue={0} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Budget</label>
                <input type="number" className="w-full border rounded p-2" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Venue</label>
                <input type="text" className="w-full border rounded p-2" />
              </div>
            </div>


            <div className="mt-2 flex justify-end p-4 rounded">
              <div className="flex space-x-2 justify-between">
                <div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <button onClick={()=> handleSave()}
                  className="bg-[#19599A] text-white px-4 py-2 rounded hover:bg-[#19599A]">
                    Save
                    
                  </button>
                </div>


              </div>
            </div>






          </div>
        </div>
      )}

    </div>
  );
}
