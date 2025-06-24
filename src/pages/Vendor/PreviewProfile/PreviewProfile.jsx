import { useEffect, useState } from 'react';
import { FaStar, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { FiPhone, FiGlobe, FiCalendar } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from 'react-icons/io5';
import { HiOutlineCalendar } from "react-icons/hi";
import { data, useParams } from 'react-router-dom';
import { useGetVendorByIdQuery } from '../../../features/vendors/vendorAPI';

import mainProfile from "../../../assets/mainProfile.png";
import vendorManagementPic from "../../../assets/vendorManagementPic.png";
import secondProfile from "../../../assets/secondProfile.png";
import { FiFacebook, FiTwitter, FiShield } from "react-icons/fi";

import PreviewProfileScreen from './PreviewProfileScreen';
import CustomerReviews from './CustomerReviews';
import SimilarVendors from './SimilarVendors';
import FaqQuestions from './FaqQuestions';
import { FaArrowLeft } from "react-icons/fa";

const PreviewProfile = () => {
  const [activeTab, setActiveTab] = useState("About");
  const { vendorId } = useParams();
  const { data: vendor, isLoading, error } = useGetVendorByIdQuery(vendorId);

  const vendorData = vendor?.vendor;



  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading vendor details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading vendor: {error.message}</div>;
  }

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save vendor functionality
  };

  return (
    <div className="mx-auto px-2 py-3 font-serif">
      <button
        className='flex items-center text-gray-800 px-2 py-2 rounded border border-gray-400 mb-2 hover:bg-[#DEBF78]'
        onClick={() => window.history.back()}
      >
        <FaArrowLeft className='mr-2' /> Back to Vendor
      </button>
      {/* Header */}



      <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row md:items-start gap-4">
        {/* Profile Image */}
        <img
          src={vendor?.profilePicture || mainProfile}
          alt={vendor?.businessName}
          className="w-40 h-40 rounded-full object-cover"
        />

        {/* Content */}
        <div className="flex-1 space-y-1">

          <h2 className="text-xl font-bold text-gray-800">{vendor?.vendor?.businessName}</h2>
          <p className="text-sm text-gray-500">{vendor?.vendor?.vendorType}</p>

          {/* Rating & Location */}
          <div className="flex flex-wrap items-center gap-2 text-md text-gray-600 mt-1">
            <span className="flex items-center font-medium">
              <FaStar className="mr-1" color={"#FACC15"} size={22} />
              {vendor?.rating || '4.8'}
              <span className="ml-1 text-gray-400">({vendor?.reviews?.length || '10'} reviews)</span>
            </span>
            <span>·</span>




            <span>
              <IoLocationOutline className="inline-block" />
              {vendorData?.serviceAreas?.length > 0
                ? vendorData.serviceAreas.map((area, index) => (
                  <span key={index}>
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                    {index !== vendorData.serviceAreas.length - 1 && ', '}
                  </span>
                ))
                : 'New Delhi, India'}
            </span>





          </div>


          <div className="flex flex-wrap justify-start gap-2 mt-2 sm:mt-0 w-full">
            <span className="text-sm px-3 py-1 rounded-full text-white whitespace-nowrap"
              style={{ backgroundColor: vendor?.isActive ? "#34C759" : "#0f4c81" }}
            >
              {vendor?.vendor?.status ? "Active" : "Inactive"}
            </span>

            {/* {vendor?.isVerified && ( */}
            <span className="text-sm px-3 py-1 rounded-full bg-white text-green-700 flex items-center gap-1 border-2 border-green-600 whitespace-nowrap">
              <FiShield className="text-green-600" size={16} />
              Verified
            </span>
            {/* )} */}

            {/* {vendor?.isApproved && ( */}
            <span className="text-sm px-3 py-1 rounded-full text-[#0f4c81] border-2 border-[#0f4c81] whitespace-nowrap">
              Approved
            </span>
            {/* )} */}
          </div>

          {/* Description */}
          <p className="text-md text-gray-500 mt-2">
            {vendor?.vendor?.description || 'No description available'}
          </p>
        </div>

        {/* Save Button */}

        <div className="absolute sm:top-35 sm:right-8 right-4 md:mt-2">
          <button
            className="flex items-center text-sm text-gray-700 border  px-3 py-2 rounded hover:bg-[#DEBF78]"
            onClick={handleSave}
          >
            <FaRegHeart className={isSaved ? "text-red-500 mr-2" : "mr-2"} /> Save
          </button>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Photo Gallery */}
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Photo Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(vendor?.galleryImages || [1, 2, 3, 4, 5, 6]).map((image, i) => (
              <img
                key={i}
                src={typeof image === 'object' ? image.url : secondProfile}
                alt={`Gallery image ${i + 1}`}
                className="rounded object-cover w-full h-60"
              />
            ))}
          </div>
        </div>


        {/* Booking Form  */}

        <form className="mx-auto border rounded-lg p-4 sm:p-6 md:p-8 shadow-sm bg-white text-sm grid gap-4 sm:grid-cols-2 w-full max-w-screen-sm">

          <h3 className="font-semibold text-xl sm:col-span-2">Book Your Service</h3>

          <label className="sm:col-span-2">
            <span className="block mb-1">Full Name</span>
            <input type="text" placeholder="John and Jane Doe" className="w-full border rounded px-3 py-2" />
          </label>

          <label>
            <span className="block mb-1">Email</span>
            <input type="email" placeholder="you@example.com" className="w-full border rounded px-3 py-2" />
          </label>

          <label>
            <span className="block mb-1">Phone Number</span>
            <input type="tel" placeholder="+91 98765 43210" className="w-full border rounded px-3 py-2" />
          </label>

          <label>
            <span className="block mb-1">Wedding Date</span>
            <input type="date" className="w-full border rounded px-3 py-2" />
          </label>

          <label>
            <span className="block mb-1">Number of Guests</span>
            <input type="number" placeholder="e.g. 150" className="w-full border rounded px-3 py-2" />
          </label>

          <label>
            <span className="block mb-1">Preferred Venue</span>
            <input type="text" placeholder="Venue or City" className="w-full border rounded px-3 py-2" />
          </label>

          <label className="sm:col-span-2">
            <span className="block mb-1">Additional Notes</span>
            <textarea rows="3" placeholder="Tell us more about your event..." className="w-full border rounded px-3 py-2" />
          </label>

          <button type="submit" className="sm:col-span-2 w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-gray-800">
            Book Now
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 mt-6 rounded">
        {['About', 'Reviews', 'FAQ'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 font-medium ${activeTab === tab ? 'bg-white rounded m-1' : 'text-gray-500 hover:text-black'
              }`}
          >
            {tab === 'Reviews' ? 'Reviews (3)' : tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Left = tab content, Right = fixed form/info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">

        {/* Left side: Tabbed content */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'About' && <PreviewProfileScreen />}
          {activeTab === 'Reviews' && <CustomerReviews />}
          {activeTab === 'FAQ' && <FaqQuestions />}
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
              <button type="submit" className="w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-[#0f4c81]">Send Inquiry</button>
            </form>
          </div>


          {/* Contact Info */}
          <div className="border rounded-lg p-4 shadow-sm bg-white w-full ">
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <ul className="text-gray-700 text-sm space-y-3" style={{ paddingLeft: '20px' }}>
              <li className="flex items-start gap-2">
                <FiPhone className="mt-1 shrink-0" />
                <span>{vendor?.phone || 'Contact number not available'}</span>
              </li>
              <li className="flex items-start gap-2">
                <HiOutlineMail className="mt-1 shrink-0" />
                <span className="break-all">{vendor?.email || 'Email not available'}</span>
              </li>
              <li className="flex items-start gap-2">
                <FiGlobe className="mt-1 shrink-0" />
                <span className="break-all">{vendor?.website || 'Website not available'}</span>
              </li>
              <li className="flex items-start gap-2">
                <IoLocationOutline className="mt-1 shrink-0" />
                <span>
                  {vendor?.address?.city && vendor?.address?.state
                    ? `${vendor.address.city}, ${vendor.address.state}`
                    : 'Location not available'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <FiCalendar className="mt-1 shrink-0" />
                <span>Available for bookings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <SimilarVendors vendorType={vendor?.vendorType} currentVendorId={vendorId} />
    </div>
  );
};

export default PreviewProfile;






