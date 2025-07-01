import React, { useState, useEffect } from 'react';
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import EditProfile from './EditProfiles';
import PortfolioTab from './Portfolio';
import PackagesAndFaqs from './PackagesAndFaqs';
import Inquiries from './Inquiries/Inquiries';
import ReviewSection from './Reviews';
import Analytics from './Analytics';
import Bookings from './Bookings';
import VendorPreviewProfile from "./PreviewProfile/VendorPreviewProfile";
import { useSelector } from 'react-redux';
import { FaAngleLeft, FaChevronRight } from "react-icons/fa6";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const vendor = useSelector((state) => state.vendor.vendor);
  const isAuthenticated = useSelector((state) => state.vendor.isAuthenticated);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerForWedding, setShowDatePickerForWedding] = useState(null);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'Overview';
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  if (!isAuthenticated) {
    return <h3 className='text-red-600 font-bold m-5'>You are not logged in.</h3>;
  }

  const tabs = ['Overview', 'Bookings', 'Edit Profile', 'Portfolio', 'Packages & FAQs', 'Inquiries', 'Reviews', 'Analytics'];

  const [events, setEvents] = useState([
    { date: new Date('2024-11-15'), name: 'Arjun & Meera Kumar Wedding' },
  ]);

  // const handleTabClick = (tab) => {
  //   setActiveTab(tab);
  // };



  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('activeTab');
    }
  }, [isAuthenticated]);


  const handleDateSelect = (date) => {
    setEvents(prev => [...prev, { date, name: 'Custom Event' }]);
    setShowDatePicker(false);
  };

  const handleWeddingDateSelect = (index, date, weddingName) => {
    setEvents(prev => [...prev, { date, name: weddingName }]);
    setShowDatePickerForWedding(null);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const event = events.find(e => new Date(e.date).toDateString() === date.toDateString());
      return event ? 'bg-red-500 text-white rounded-full relative group' : null;
    }
  };

  // Sample data
  const activities = [
    {
      name: 'Arjun & Meera Kumar',
      date: '12/10/2023',
      message: 'Hello, I am interested in your wedding photography services...',
      status: 'Replied',
      statusColor: 'text-green-600',
    },
    // ... other activities
  ];

  const upcomingWeddings = [
    {
      name: "Arjun & Meera Kumar",
      date: "Friday, November 15, 2024",
    },
    {
      name: "Rohan & Neha Agarwal",
      date: "Saturday, December 7, 2024",
    }
  ];

  return (
    <div className="p-2 sm:p-6 bg-white min-h-screen text-gray-800 font-serif">
      {/* Header */}
      <div className="mb-2 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-serif">
              {vendor?.businessName || 'Dream Wedding Photography'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-serif">
              {vendor?.vendorType || 'Photographer'} • {
                vendor?.serviceAreas?.length > 0
                  ? vendor.serviceAreas.join(', ')
                  : vendor?.address?.city
                    ? `${vendor.address.city}${vendor.address.state ? `, ${vendor.address.state}` : ''}`
                    : 'Location not specified'
              }
            </p>
          </div>

          <div className="flex flex-col w-full sm:w-auto sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex flex-col">
              <span className="text-black text-xs sm:text-sm font-medium font-serif">
                Profile Status
              </span>
              <span className="text-green-700 font-bold text-xs sm:text-sm font-serif">
                {vendor?.status || 'InActive'}
              </span>
            </div>

            <button
              onClick={() => setShowModal(true)}

              className="bg-[#0f4c81] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded text-md sm:text-sm w-full sm:w-auto text-center">
              Preview Profile
            </button>
          </div>
        </div>
      </div>

      <div className="relative bg-[#f5f8fb] p-1 sm:p-2 rounded-md mb-6 overflow-hidden">
        {/* Scroll Left Button */}
        <button
          onClick={() => {
            const container = document.getElementById('tabs-container');
            const firstTab = container.querySelector('button');
            if (firstTab) {
              const tabWidth = firstTab.offsetWidth + parseFloat(getComputedStyle(firstTab).marginRight);
              container.scrollBy({ left: -tabWidth * 3, behavior: 'smooth' });
            }
          }}
          style={{borderRadius:'25px'}}
          className="absolute lg:hidden left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 shadow-md text-gray-600 rounded-full"
        >
          <FaAngleLeft size={14} />
        </button>

        {/* Tabs container */}
        <div id="tabs-container" className="flex overflow-x-auto scrollbar-hide gap-3 ">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleTabClick(tab)}
              style={{borderRadius:'5px'}}
              className={`whitespace-nowrap p-1 rounded-full text-sm font-medium transition duration-200 ${activeTab === tab
                  ? 'bg-white text-[#0f4c81] shadow'
                  : 'text-gray-700 hover:bg-white/60'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => {
            const container = document.getElementById('tabs-container');
            const firstTab = container.querySelector('button');
            if (firstTab) {
              const tabWidth = firstTab.offsetWidth + parseFloat(getComputedStyle(firstTab).marginRight);
              container.scrollBy({ left: tabWidth * 3, behavior: 'smooth' });
            }
          }}
          style={{borderRadius:'25px'}}
          className="absolute lg:hidden right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1 shadow-md text-gray-600 rounded-full"
        >
          <FaChevronRight size={14} />
        </button>
      </div>


      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {activeTab === 'Overview' && (
          <>
            {/* Performance Overview */}
            <div className="col-span-2 bg-gray-50 p-3 sm:p-4 rounded border">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Performance Overview</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Your profile performance in the last 30 days</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4  mb-4 sm:mb-6">
                {[
                  { label: 'Profile Views', value: '1250', change: '+15%' },
                  { label: 'Inquiries', value: '28', change: '+8%' },
                  { label: 'Booking Rate', value: '35%', change: '+5%' },
                  { label: 'Review Score', value: '4.8', change: '+0.2' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-2 sm:p-4 rounded shadow text-center">
                    <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                    <p className="text-lg sm:text-2xl font-bold">
                      {item.value} <span className="text-green-500 text-xs sm:text-sm">{item.change}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Calendar Section */}
              <div className="bg-white p-3 sm:p-4 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs sm:text-sm font-medium">Monthly Profile Views</p>
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="text-[#0f4c81] flex items-center gap-1 text-xs sm:text-sm font-medium"
                  >
                    <MdOutlineCalendarMonth size={16} className="sm:w-5 sm:h-5" /> Add Event
                  </button>
                </div>

                {showDatePicker && (
                  <DatePicker
                    selected={null}
                    onChange={handleDateSelect}
                    inline
                  />
                )}

                <div className="mt-4">
                  <Calendar
                    className="w-full text-xs sm:text-sm"
                    value={new Date()}
                    tileClassName={tileClassName}
                    tileContent={({ date, view }) => {
                      const event = events.find(e =>
                        new Date(e.date).toDateString() === date.toDateString()
                      );
                      return event ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="tooltip group-hover:block hidden absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md z-10 whitespace-nowrap">
                            {event.name}
                          </span>
                          <span className="text-white text-xs font-bold">●</span>
                        </div>
                      ) : null;
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 p-2 sm:p-4 rounded border">
              <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Recent Activity</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-2">Latest inquiries and reviews</p>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                {activities.map((activity, idx) => (
                  <div key={idx} className="relative pl-6 sm:pl-8">
                    <FiMessageSquare className="absolute top-1 left-0 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <p className="font-medium text-gray-800">{activity.name}</p>
                    <p className="text-xs text-gray-400 mb-1">{activity.date}</p>
                    <p className="mb-1 text-gray-700">{activity.message}</p>
                    {activity.status && (
                      <span className={`${activity.statusColor} text-xs font-medium`}>
                        {activity.status}
                      </span>
                    )}
                    <hr className="mt-3 border-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Other tabs content */}
        {activeTab === 'Edit Profile' && <div className="col-span-3"><EditProfile /></div>}
        {activeTab === 'Bookings' && <div className="col-span-3"><Bookings /></div>}
        {activeTab === 'Portfolio' && <div className="col-span-3"><PortfolioTab /></div>}
        {activeTab === 'Packages & FAQs' && <div className="col-span-3"><PackagesAndFaqs /></div>}
        {activeTab === 'Inquiries' && <div className="col-span-3"><Inquiries /></div>}
        {activeTab === 'Reviews' && <div className="col-span-3"><ReviewSection /></div>}
        {activeTab === 'Analytics' && <div className="col-span-3"><Analytics /></div>}
      </div>

      {/* Upcoming Weddings Section */}
      {activeTab === 'Overview' && (
        <div className="col-span-2 bg-white p-2 sm:p-4 rounded border mt-4 sm:mt-5">
          <h2 className="text-base sm:text-lg font-semibold mb-2">Upcoming Weddings</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-2">Your Scheduled Bookings</p>

          {upcomingWeddings.map((wedding, index) => (
            <div key={index} className="flex items-center space-x-2 sm:space-x-4 border p-2 sm:p-4 rounded mb-2 relative">
              <span
                className="text-gray-800 cursor-pointer mt-6"
                onClick={() => setShowDatePickerForWedding(index === showDatePickerForWedding ? null : index)}
              >
                <MdOutlineCalendarMonth size={16} className="sm:w-5 sm:h-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm sm:text-base">{wedding.name.slice(0, 11) + "..."}</p>
                <p className="text-xs sm:text-sm text-gray-500">{wedding.date}</p>
              </div>
              <button className="border border-gray-300 rounded px-2 sm:px-4 py-1 text-xs sm:text-sm">
                Contact Client
              </button>

              {showDatePickerForWedding === index && (
                <div className="absolute top-full left-0 z-10 mt-1 shadow-lg bg-white p-2 rounded">
                  <DatePicker
                    inline
                    onChange={(date) => handleWeddingDateSelect(index, date, wedding.name)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <VendorPreviewProfile show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Dashboard;