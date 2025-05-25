import React, { useState } from 'react';
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import DatePicker from 'react-datepicker';
import Calendar from 'react-calendar';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import EditProfile from './EditProfiles';
import PortfolioTab from './Portfolio';
import PackagesAndFaqs from './PackagesAndFaqs';
import Inquiries from './Inquiries';
import ReviewSection from './Reviews';
import Analytics from './Analytics';
import EditCoverPhoto from './EditCoverPhoto';


const Dashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('Overview');

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Define tabs
  const tabs = ['Overview', 'Edit Profile', 'Portfolio', 'Packages & FAQs', 'Inquiries', 'Reviews', 'Analytics'];

  // State for events and dropdown pickers
  const [events, setEvents] = useState([
    { date: new Date('2024-11-15'), name: 'Arjun & Meera Kumar Wedding' },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePickerForWedding, setShowDatePickerForWedding] = useState(null);

  // Handle date selection for adding events
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

  // Sample data for different tabs
  const activities = [
    {
      name: 'Arjun & Meera Kumar',
      date: '12/10/2023',
      message: 'Hello, I am interested in your wedding photography services for my wedding on November 15, 2024. Could...',
      status: 'Replied',
      statusColor: 'text-green-600',
    },
    {
      name: 'Karan & Priya Malhotra',
      date: '12/15/2023',
      message: 'Hi, could you please share your availability for January 20, 2024? We are planning a destination wedding in...',
      status: 'Pending Reply',
      statusColor: 'text-yellow-600',
    },
    {
      name: 'Vikram & Nisha Patel',
      date: '12/18/2023',
      message: 'We loved your portfolio! Do you offer videography services as well or only photography?',
      status: 'Pending Reply',
      statusColor: 'text-yellow-600',
    },
    {
      name: 'Rahul & Anjali Sharma',
      date: '11/20/2023',
      message: 'Absolutely amazing photography service! The team was professional, creative and captured all our special...',
      rating: '★★★★★',
      ratingColor: 'text-yellow-500'
    }
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
    <div className="p-6 bg-white min-h-screen text-gray-800 font-serif">
      
      {/* Header */}
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-serif">Dream Wedding Photography</h1>
            <p className="text-sm text-gray-600 font-serif">Photographer • Delhi, India</p>
          </div>
          
          <div className="flex justify-between items-start gap-4">
  <div className="flex flex-col">
    <span className="text-black text-sm font-medium font-serif">Profile Status</span>
    <div className="flex items-center justify-center">
      <span className="text-green-700 font-bold text-sm font-serif">Active</span>
    </div>
  </div>
  <button className="bg-[#0f4c81] text-white px-4 py-2 rounded text-sm">
    Preview Profile
  </button>
</div>

        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center md:justify-start space-x-4 bg-[#f5f8fb] p-2 rounded-md mb-6 text-sm">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabClick(tab)}
            className={`px-3 py-1 rounded-md font-medium ${tab === activeTab ? 'bg-white text-black shadow-sm' : 'text-gray-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content Based on Active Tab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'Overview' && (
          <>
            {/* Performance Overview */}
            <div className="col-span-2 bg-gray-50 p-4 rounded border">
              <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
              <p className="text-sm text-gray-500 mb-6">Your profile performance in the last 30 days</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Profile Views', value: '1250', change: '+15%' },
                  { label: 'Inquiries', value: '28', change: '+8%' },
                  { label: 'Booking Rate', value: '35%', change: '+5%' },
                  { label: 'Review Score', value: '4.8', change: '+0.2' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded shadow text-center">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-2xl font-bold">
                      {item.value} <span className="text-green-500 text-sm">{item.change}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Monthly Profile Views</p>
                  <button onClick={() => setShowDatePicker(!showDatePicker)} className="text-[#0f4c81] flex items-center gap-1 text-sm font-medium">
                    <MdOutlineCalendarMonth size={20} /> Add Event
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
                  <style jsx>{`
                    .tooltip {
                      display: none;
                    }
                    .group:hover .tooltip {
                      display: block;
                    }
                  `}</style>
                  <Calendar
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
            <div className="bg-gray-50 p-4 rounded border">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <p className="text-sm text-gray-500 mb-2">Latest inquiries and reviews</p>

              <div className="space-y-4 text-sm">
                {activities.map((activity, idx) => (
                  <div key={idx} className="relative pl-8">
                    <FiMessageSquare className="absolute top-1 left-0 text-gray-400 w-5 h-5" />
                    <p className="font-medium text-gray-800">{activity.name}</p>
                    <p className="text-xs text-gray-400 mb-1">{activity.date}</p>
                    {activity.rating ? (
                      <p><span className={`${activity.ratingColor}`}>{activity.rating}</span> {activity.message}</p>
                    ) : (
                      <p className="mb-1 text-gray-700">{activity.message}</p>
                    )}
                    {activity.status && (
                      <span className={`${activity.statusColor} text-xs font-medium`}>{activity.status}</span>
                    )}
                    <hr className="mt-3 border-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

 

        {/* Add similar conditional rendering for other tabs */}
        {activeTab === 'Edit Profile' && (
          <div className="col-span-3 bg-white   w-full">
            
            <EditProfile />
            {/* <EditCoverPhoto/> */}
            {/* Add Edit Profile form here */}
          </div>
        )}

        {activeTab === 'Portfolio' && (
          <div className="col-span-3 bg-white">
            <PortfolioTab/>
          </div>
        )}

        {activeTab === 'Packages & FAQs' && (
          <div className="col-span-3 bg-white ">
           
           <PackagesAndFaqs/>
          </div>
        )}

        {activeTab === 'Inquiries' && (
          <div className="col-span-3 bg-white ">
           <Inquiries/>
          </div>
        )}

        {activeTab === 'Reviews' && (
          <div className="col-span-3 bg-white ">
           <ReviewSection/>
          </div>
        )}

        {activeTab === 'Analytics' && (
          <div className="col-span-3 bg-white p-4 rounded border">
            <Analytics />
            
          </div>
        )}
      </div>

             {activeTab === 'Overview' && (
          <div className="col-span-2 bg-white p-4 rounded border mt-5">
            <h2 className="text-lg font-semibold mb-2">Upcoming Weddings</h2>
            <p className="text-sm text-gray-500 mb-2">Your Scheduled Bookings</p>
            {upcomingWeddings.map((wedding, index) => (
              <div key={index} className="flex items-center space-x-4 border p-4 rounded mb-2 relative">
                <span
                  className="text-gray-800 cursor-pointer"
                  onClick={() => setShowDatePickerForWedding(index === showDatePickerForWedding ? null : index)}
                >
                  <MdOutlineCalendarMonth size={40} />
                </span>
                <div className="flex-1">
                  <p className="font-medium">{wedding.name}</p>
                  <p className="text-sm text-gray-500">{wedding.date}</p>
                </div>
                <button className="border border-gray-300 rounded px-4 py-1">Contact Client</button>

                {/* Dropdown DatePicker */}
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
    </div>
  );
};

export default Dashboard;