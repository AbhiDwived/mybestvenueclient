

import { useState } from 'react';
import { FaStar, FaRegHeart } from 'react-icons/fa';
import { FiPhone, FiGlobe, FiCalendar } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from 'react-icons/io5';

import PreviewProfile01 from "../../../assets/navImage/PreviewProfile01.png";
import vendorManagement003 from "../../../assets/navImage/vendorManagement003.png";
import previewProfile003 from "../../../assets/navImage/previewProfile003.png";

import PreviewProfileScreen from './PreviewProfileScreen';
import CustomerReviews from './CustomerReviews';
import SimilarVendors from './SimilarVendors';
import FaqQuestions from './FaqQuestions';

const PreviewProfile = () => {
  const [activeTab, setActiveTab] = useState("About");

  return (
    <div className="max-w-7xl mx-auto px-2 py-6 font-serif">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 ">
        <div>
          <h1 className="text-3xl font-bold">Dream Wedding Photography</h1>
          <div className="text-gray-600 flex items-center mt-1">
            <IoLocationOutline className="mr-2" /> <span>Delhi, India</span>
          </div>
          <div className="flex items-center text-sm mt-1">
            <span className="text-gray-500 mr-2">Photographer</span>
            <FaStar className="text-yellow-500 mr-1" />
            <span className="font-semibold text-gray-800">4.8</span>
            <span className="text-gray-500 ml-1">(124 reviews)</span>
          </div>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <button className="flex items-center border border-gray-300 px-2 py-1 rounded hover:bg-[#DEBF78]">
            <FaRegHeart className="text-gray-600 mr-2" />
            Save
          </button>
          <button className="text-gray-800">Contact</button>
        </div>
      </div>

      {/* Images */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        <div className="col-span-4 md:col-span-3">
          <img src={PreviewProfile01} alt="PreviewProfile01" className="w-full h-96 object-cover rounded-lg" />
        </div>
        <div className="hidden md:flex flex-col gap-2">
          <img src={vendorManagement003} alt="Side 1" className="w-full h-32 object-cover rounded-lg" />
          <img src={PreviewProfile01} alt="Side 2" className="w-full h-32 object-cover rounded-lg" />
          <img src={previewProfile003} alt="Side 3" className="w-full h-32 object-cover rounded-lg" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 mt-6 rounded">
        {['About', 'Reviews', 'FAQ'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 font-medium ${
              activeTab === tab ? 'bg-white rounded m-1' : 'text-gray-500 hover:text-black'
            }`}
          >
            {tab === 'Reviews' ? 'Reviews (3)' : tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Left = tab content, Right = fixed form/info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
       
        {/* Left side: Tabbed content */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'About' && <PreviewProfileScreen />}
          {activeTab === 'Reviews' && <CustomerReviews />}
          {activeTab === 'FAQ' && <FaqQuestions/>}
        </div>

        {/* Right side: Inquiry + Contact Info */}
        <div className="space-y-6">
          {/* Inquiry Form */}
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h3 className="font-semibold text-lg mb-3">Send Inquiry</h3>
            <form className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Your Name</label>
                <input type="text" placeholder="John and Jane Doe" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">Your Email</label>
                <input type="email" placeholder="you@example.com" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">Wedding Date</label>
                <input type="date" className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">Message</label>
                <textarea rows="3" placeholder="Tell us about your wedding and requirements..." className="w-full border rounded px-3 py-2" />
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">Send Inquiry</button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="border rounded-lg p-4 shadow-sm bg-white w-full">
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <ul className="text-gray-700 text-sm space-y-3">
              <li className="flex items-start gap-2">
                <FiPhone className="mt-1 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <HiOutlineMail className="mt-1 shrink-0" />
                <span className="break-all">info@dreamwedding.com</span>
              </li>
              <li className="flex items-start gap-2">
                <FiGlobe className="mt-1 shrink-0" />
                <span className="break-all">www.dreamweddingphotography.com</span>
              </li>
              <li className="flex items-start gap-2">
                <IoLocationOutline className="mt-1 shrink-0" />
                <span>Delhi, India</span>
              </li>
              <li className="flex items-start gap-2">
                <FiCalendar className="mt-1 shrink-0" />
                <span>Available for 2023–2024 weddings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
        <SimilarVendors/>
    </div>
  );
};

export default PreviewProfile;






