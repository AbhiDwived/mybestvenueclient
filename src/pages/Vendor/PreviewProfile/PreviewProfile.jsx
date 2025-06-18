import React, { useState } from 'react';
import { FaStar, FaRegHeart, FaPhone } from 'react-icons/fa';
import { FiGlobe, FiCalendar } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import mainProfile from "../../../assets/mainProfile.png";
import vendorManagementPic from "../../../assets/vendorManagementPic.png";
import secondProfile from "../../../assets/secondProfile.png";

import PreviewProfileScreen from './PreviewProfileScreen';
import CustomerReviews from './CustomerReviews';
import SimilarVendors from './SimilarVendors';
import FaqQuestions from './FaqQuestions';

const PreviewProfile = () => {
  const [activeTab, setActiveTab] = useState('About');
  const [isFavorite, setIsFavorite] = useState(false);
  const vendor = useSelector((state) => state.vendor.vendor);

  // Mock reviews data (replace with actual data later)
  const reviews = [
    {
      id: 1,
      userName: 'Priya Sharma',
      rating: 5,
      date: '2023-12-15',
      comment: 'Amazing photographer! Captured our wedding beautifully. The candid shots were particularly wonderful.'
    },
    {
      id: 2,
      userName: 'Rahul Verma',
      rating: 4,
      date: '2023-11-20',
      comment: 'Very professional team. They were punctual and attentive throughout our wedding day.'
    },
    {
      id: 3,
      userName: 'Anjali Patel',
      rating: 5,
      date: '2023-10-05',
      comment: 'The pre-wedding shoot was fantastic! The final photos exceeded our expectations.'
    }
  ];

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    // Handle inquiry submission
    console.log('Inquiry submitted');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-serif">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{vendor?.businessName || 'Dream Wedding Photography'}</h1>
          <div className="text-gray-600 flex items-center mt-1">
            <IoLocationOutline className="mr-2" />
            <span>{vendor?.serviceAreas || 'Delhi, India'}</span>
          </div>
          <div className="flex items-center text-sm mt-1">
            <span className="text-gray-500 mr-2">{vendor?.vendorType || 'Photographer'}</span>
            <div className="flex items-center">
              <FaStar className="text-yellow-500 mr-1" />
              <span className="font-semibold">4.8</span>
              <span className="text-gray-500 ml-1">(124 reviews)</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={toggleFavorite}
            className={`flex items-center border px-4 py-2 rounded-md ${
              isFavorite ? 'bg-red-50 text-red-500 border-red-500' : 'border-gray-300 text-gray-600'
            }`}
          >
            <FaRegHeart className="mr-2" />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
          <button 
            onClick={() => document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' })}
            className="bg-[#0f4c81] text-white px-4 py-2 rounded-md hover:bg-[#0f4c81]/90"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        <div className="col-span-4 md:col-span-3">
          <img src={mainProfile} alt="PreviewProfile01" className="w-full h-96 object-cover rounded-lg" />
        </div>
        <div className="hidden md:flex flex-col gap-2">
          <img src={vendorManagementPic} alt="Side 1" className="w-full h-32 object-cover rounded-lg" />
          <img src={mainProfile} alt="Side 2" className="w-full h-32 object-cover rounded-lg" />
          <img src={secondProfile} alt="Side 3" className="w-full h-32 object-cover rounded-lg" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {['About', 'Reviews', 'FAQ'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab 
                ? 'border-b-2 border-[#0f4c81] text-[#0f4c81]' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'Reviews' ? `Reviews (${reviews.length})` : tab}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2">
          {activeTab === 'About' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">About Us</h2>
                <p className="text-gray-700">{vendor?.description || 'Description not available'}</p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Services</h2>
                <ul className="grid grid-cols-2 gap-3">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-[#0f4c81] rounded-full mr-2"></span>
                    Wedding Photography
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-[#0f4c81] rounded-full mr-2"></span>
                    Pre-wedding Shoot
                  </li>
                  {/* Add more services */}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Pricing</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-bold mb-2">Basic Package</h3>
                    <p className="text-gray-600 mb-2">{vendor?.pricing || '₹10,000 - ₹20,000'}</p>
                    <ul className="list-disc pl-5 text-gray-700">
                      <li>6 hours coverage</li>
                      <li>One photographer</li>
                      <li>100 edited photos</li>
                    </ul>
                  </div>
                  {/* Add more packages */}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">{review.userName}</h3>
                      <span className="text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'FAQ' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">How far in advance should I book?</h3>
                  <p className="text-gray-700">We recommend booking at least 6-8 months in advance for peak season.</p>
                </div>
                {/* Add more FAQs */}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Inquiry Form */}
          <div id="inquiry-form" className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-4">Send Inquiry</h3>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="John and Jane Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2"
                  rows="4"
                  placeholder="Tell us about your requirements..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-[#0f4c81] text-white py-2 rounded-md hover:bg-[#0f4c81]/90"
              >
                Send Inquiry
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <FaPhone className="text-[#0f4c81] mr-3" />
                <span>{vendor?.phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center">
                <HiOutlineMail className="text-[#0f4c81] mr-3" />
                <span>{vendor?.email || 'info@example.com'}</span>
              </div>
              <div className="flex items-center">
                <FiGlobe className="text-[#0f4c81] mr-3" />
                <span>{vendor?.website || 'www.example.com'}</span>
              </div>
              <div className="flex items-center">
                <IoLocationOutline className="text-[#0f4c81] mr-3" />
                <span>{vendor?.serviceAreas || 'Delhi, India'}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="text-[#0f4c81] mr-3" />
                <span>Available for 2024 weddings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimilarVendors/>
    </div>
  );
};

export default PreviewProfile;






