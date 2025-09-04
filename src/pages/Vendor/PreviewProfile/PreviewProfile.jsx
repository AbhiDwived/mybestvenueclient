import { useEffect, useState } from 'react';
import { FaStar, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { FiPhone, FiGlobe, FiCalendar } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from 'react-icons/io5';
import { HiOutlineCalendar } from "react-icons/hi";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useGetVendorByIdQuery } from '../../../features/vendors/vendorAPI';
import { toast } from 'react-toastify';
import coverimage from '../../../assets/Images/user.png';

import { FiFacebook, FiTwitter, FiShield } from "react-icons/fi";
import PreviewProfileScreen from './PreviewProfileScreen';
import CustomerReviews from './CustomerReviews';
import SimilarVendors from './SimilarVendors';
import FaqQuestions from './FaqQuestions';
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Loader from '../../../components/{Shared}/Loader';
import { useAddUserInquiryMessageMutation } from '../../../features/auth/authAPI';
import { useCreateAnonymousInquiryMutation } from '../../../features/inquiries/inquiryAPI';
import { ImCross } from 'react-icons/im';
import { useGetPortfolioImagesQuery, useGetPortfolioVideosQuery } from '../../../features/vendors/vendorAPI';
import { useGetVendorReviewsQuery } from '../../../features/reviews/reviewAPI';
import { useGetSavedVendorsQuery, useUnsaveVendorMutation, useSaveVendorMutation } from "../../../features/savedVendors/savedVendorAPI";

const PreviewProfile = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [activeGalleryTab, setActiveGalleryTab] = useState('images');
  const navigate = useNavigate();
  const { vendorid, businesstype, city, type, slug } = useParams();
  const location = useLocation();
  
  // Determine businessType from the URL path
  const isVenueLocation = location.pathname.startsWith('/venue/location');
  const finalBusinessType = isVenueLocation ? 'venue' : businesstype;
  
  // Check if we have SEO URL params
  const hasSeoParams = city && finalBusinessType && type && slug;
  
  // Use SEO URL if all SEO params are present, otherwise use vendorId
  const { data: vendor, isLoading: isVendorLoading, error: vendorError } = useGetVendorByIdQuery(
    vendorid,
    { skip: !vendorid }
  );
  
  const actualVendorId = vendor?.vendor?._id || vendorid;

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  // Inquiry form state with validation
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    message: ''
  });

  // Inquiry errors state
  const [inquiryErrors, setInquiryErrors] = useState({});

  // Inquiry validation
  const validateInquiry = () => {
    const errors = {};
    if (!inquiryForm.name) errors.name = 'Name is required';
    if (!inquiryForm.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(inquiryForm.email)) errors.email = 'Invalid email address';
    if (!inquiryForm.phone) errors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(inquiryForm.phone)) errors.phone = 'Invalid mobile number';
    if (!inquiryForm.eventDate) errors.eventDate = 'Event date is required';
    if (!inquiryForm.message) errors.message = 'Message is required';
    setInquiryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const vendorData = vendor?.vendor;

  const [isSaved, setIsSaved] = useState(false);

  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [addUserInquiryMessage] = useAddUserInquiryMessageMutation();
  const [createAnonymousInquiry] = useCreateAnonymousInquiryMutation();

  const userRecord = useSelector((state) => state.auth);
  const userId = userRecord?.user?.id;

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update handleInquirySubmit to use validateInquiry
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (userRecord?.user?.role === 'vendor') {
      toast.error('Vendors cannot send inquiries');
      return;
    }
    if (!validateInquiry()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    setInquiryLoading(true);
    try {
      if (userId) {
        await addUserInquiryMessage({
          userId,
          vendorId: vendorData._id,
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          eventDate: inquiryForm.eventDate,
          message: inquiryForm.message
        }).unwrap();
        toast.success('Inquiry sent successfully!');
      } else {
        await createAnonymousInquiry({
          vendorId: vendorData._id,
          name: inquiryForm.name,
          email: inquiryForm.email,
          phone: inquiryForm.phone,
          eventDate: inquiryForm.eventDate,
          message: inquiryForm.message
        }).unwrap();
        toast.success('Inquiry sent successfully as guest!');
      }
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        message: ''
      });
      setInquiryErrors({});
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

  // Only scroll to top on initial page load, not after form submit or any form interaction
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleImageView = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleVideoView = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const ImageViewModal = ({ imageUrl, onClose }) => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="max-w-[90%] max-h-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Full Size"
          className="max-w-full max-h-full object-contain"
        />
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200"
          onClick={onClose}
        >
          <ImCross size={16} />
        </button>
      </div>
    </div>
  );

  const VideoViewModal = ({ videoUrl, onClose }) => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="max-w-[90%] max-h-[90%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={videoUrl.replace('watch?v=', 'embed/')}
          className="w-full h-[80vh]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200"
          onClick={onClose}
        >
          <ImCross size={16} />
        </button>
      </div>
    </div>
  );

  // Portfolio Gallery Queries
  const { data: portfolioImagesData } = useGetPortfolioImagesQuery(actualVendorId, {
    skip: !actualVendorId
  });

  const { data: portfolioVideosData } = useGetPortfolioVideosQuery(actualVendorId, {
    skip: !actualVendorId
  });

  const vendorPortfolio = {
    images: portfolioImagesData?.images || [],
    videos: portfolioVideosData?.videos || []
  };

  const { data: reviewData } = useGetVendorReviewsQuery(actualVendorId, { skip: !actualVendorId });
  const reviews = reviewData?.reviews || [];
  const avg = reviews.length
  ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
  : 0;

const avgRating = avg === 5 ? '5' : avg.toFixed(1);

  const reviewCount = reviews.length;

  if (isVendorLoading) {
    return <Loader />;
  }

  if (vendorError) {
    return <div className="text-center py-10 text-red-500">Error loading vendor: {vendorError.message}</div>;
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

      <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row md:items-start gap-4">
        <img
          src={vendor?.vendor?.profilePicture || vendor?.vendor?.profilePhoto }
          alt={vendor?.vendor?.businessName || "Vendor Profile"}
          className="w-40 h-40 rounded-full object-cover"
        />

        <div className="flex-1 space-y-1">
          <h2 className="text-xl font-bold text-gray-800">{vendor?.vendor?.businessName}</h2>
          <p className="text-sm text-gray-500">{vendor?.vendor?.vendorType}</p>

          <div className="flex flex-wrap gap-2 mt-2">
            {(() => {
              let raw = vendor?.vendor?.services || [];
              let vendorServices = Array.isArray(raw)
                ? raw.length === 1 && typeof raw[0] === "string"
                  ? raw[0].split(',').map(s => s.trim())
                  : raw
                : [];

              return vendorServices.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {vendorServices.map((service, index) => (
                    <span
                      key={index}
                      className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-400">No services available</span>
              );
            })()}
          </div>

          <div className="flex overflow-x-auto flex-nowrap  gap-4 mt-2 whitespace-nowrap">
            {vendorData?.pricing?.filter(item => item?.type && item?.price)?.length > 0 ? (
              vendorData.pricing
                .filter(item => item?.type && item?.price)
                .map((item, index) => (
                  <div
                    key={item._id || index}
                    className="inline-block min-w-[200px] border-blue-400 rounded-xl p-2  text-sm font-bold text-gray-800"
                  >
                    <span className="text-gray-500">{item.type}:</span>  ₹{item.price.toLocaleString('en-IN')}  <span className='text-gray-500'>{item.unit || 'per person'}</span>
                  </div>
                ))
            ) : (
              <div className="text-sm text-gray-500">No Pricing Available</div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-md text-gray-600 mt-1">
            <span className="flex items-center font-medium">
              <FaStar className="mr-1" color={"#FACC15"} size={22} />
              {avgRating}
              <span className="ml-1 text-gray-400">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
            </span>
            <span>·</span>

            <span className="flex items-center">
              <IoLocationOutline className="inline-block mr-1" />
              {(() => {
                const vendorAddress = vendor?.vendor?.address;
                if (vendorAddress && typeof vendorAddress === 'object') {
                  const parts = [];
                  if (vendorAddress.street) parts.push(vendorAddress.street);
                  if (vendorAddress.city) parts.push(vendorAddress.city);
                  if (vendorAddress.state) parts.push(vendorAddress.state);
                  if (vendorAddress.zipCode) parts.push(vendorAddress.zipCode);
                  return parts.length > 0 ? parts.join(', ') : 'Location not available';
                } else if (typeof vendorAddress === 'string') {
                  return vendorAddress;
                } else if (vendor?.vendor?.serviceAreas?.length > 0) {
                  return vendor.vendor.serviceAreas.map((area, index) => (
                    <span key={index}>
                      {area}
                      {index !== vendor.vendor.serviceAreas.length - 1 && ', '}
                    </span>
                  ));
                } else {
                  return 'Location not available';
                }
              })()}
            </span>
          </div>

          <div className="flex flex-wrap justify-start gap-2 mt-2 sm:mt-0 w-full">
            <span className="text-sm px-3 py-1 rounded-full text-white whitespace-nowrap"
              style={{ backgroundColor: vendor?.isActive ? "#34C759" : "#0f4c81" }}
            >
              {vendor?.vendor?.status ? "Active" : "Inactive"}
            </span>

            <span className="text-sm px-3 py-1 rounded-full bg-white text-green-700 flex items-center gap-1 border-2 border-green-600 whitespace-nowrap">
              <FiShield className="text-green-600" size={16} />
              Verified
            </span>

            <span className="text-sm px-3 py-1 rounded-full text-[#0f4c81] border-2 border-[#0f4c81] whitespace-nowrap">
              Approved
            </span>
          </div>

          <p className="text-md text-gray-500 mt-2">
          </p>
        </div>

        <div className="absolute sm:top-35 sm:right-8 right-4 md:mt-2">
          <button
            className="flex items-center text-sm text-gray-700 border  px-3 py-2 rounded hover:bg-[#DEBF78]"
            onClick={handleSave}
          >
            <FaRegHeart className={isSaved ? "text-red-500 mr-2" : "mr-2"} /> Save
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Portfolio Gallery</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveGalleryTab('images')}
              className={`px-3 py-1 rounded text-sm ${activeGalleryTab === 'images' ? 'bg-[#0f4c81] text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Images ({vendorPortfolio.images.length})
            </button>
            <button
              onClick={() => setActiveGalleryTab('videos')}
              className={`px-3 py-1 rounded text-sm ${activeGalleryTab === 'videos' ? 'bg-[#0f4c81] text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Videos ({vendorPortfolio.videos.length})
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            {activeGalleryTab === 'images' && (
              <>
                <div className="grid grid-cols-3 gap-4">
                {vendorPortfolio.images.length > 0 ? (
                  vendorPortfolio.images
                    .slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)
                    .map((image, i) => (
                      <div
                        key={image._id || i}
                        className="relative group cursor-pointer"
                        onClick={() => handleImageView(image.url)}
                      >
                        <img
                          src={image.url}
                          alt={image.title || `Portfolio Image ${i + 1}`}
                          className="rounded object-cover w-full h-56 transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-sm truncate">{image.title || 'Portfolio Image'}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    No portfolio images available
                  </div>
                )}
              </div>

              {vendorPortfolio.images.length > imagesPerPage && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#0f4c81] text-white hover:bg-[#0d3d6a]'
                      }`}
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: Math.ceil(vendorPortfolio.images.length / imagesPerPage) },
                    (_, i) => i + 1
                  ).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-full ${currentPage === pageNum
                        ? 'bg-[#0f4c81] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev =>
                      Math.min(prev + 1, Math.ceil(vendorPortfolio.images.length / imagesPerPage))
                    )}
                    disabled={currentPage === Math.ceil(vendorPortfolio.images.length / imagesPerPage)}
                    className={`px-3 py-1 rounded ${currentPage === Math.ceil(vendorPortfolio.images.length / imagesPerPage)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-[#0f4c81] text-white hover:bg-[#0d3d6a]'
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
              </>
            )}

            {activeGalleryTab === 'videos' && (
              <div className="grid grid-cols-2 gap-4">
              {vendorPortfolio.videos.length > 0 ? (
                vendorPortfolio.videos.map((video, i) => (
                  <div
                    key={video._id || i}
                    className="relative group cursor-pointer"
                    onClick={() => handleVideoView(video.url)}
                  >
                    <iframe
                      src={video.url.includes('youtube.com')
                        ? video.url.replace('watch?v=', 'embed/')
                        : video.url}
                      title={video.title || `Portfolio Video ${i + 1}`}
                      className="rounded w-full h-60 object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm truncate">{video.title || 'Portfolio Video'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No portfolio videos available
                </div>
              )}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-4 shadow-sm bg-white sticky top-5">
              <h3 className="font-semibold text-lg mb-3">Send Inquiry</h3>
              <form className="space-y-3 text-sm" onSubmit={handleInquirySubmit}>
                <div>
                  <label className="block mb-1">Your Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={inquiryForm.name} onChange={handleInquiryChange} className={`w-full border rounded px-3 py-2 ${inquiryErrors.name ? 'border-red-500' : ''}`} />
                  {inquiryErrors.name && <span className="text-red-500 text-xs mt-1">{inquiryErrors.name}</span>}
                </div>
                <div>
                  <label className="block mb-1">Your Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={inquiryForm.email} onChange={handleInquiryChange} className={`w-full  border rounded px-3 py-2 ${inquiryErrors.email ? 'border-red-500' : ''}`} />
                  {inquiryErrors.email && <span className="text-red-500 text-xs mt-1">{inquiryErrors.email}</span>}
                </div>
                <div>
                  <label className="block mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={inquiryForm.phone} onChange={handleInquiryChange} className={`w-full  border rounded px-3 py-2 ${inquiryErrors.phone ? 'border-red-500' : ''}`} />
                  {inquiryErrors.phone && <span className="text-red-500 text-xs mt-1">{inquiryErrors.phone}</span>}
                </div>
                <div>
                  <input type="hidden" value={userId} className="w-full border rounded px-3 py-2" />
                </div>
                <input type="hidden" name="vendorId" value={vendorData._id} />
                <div>
                  <label className="block mb-1">Event Date <span className="text-red-500">*</span></label>
                  
                  <input
                    type="date"
                    name="eventDateRaw"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0); 

                      if (selectedDate < today) {
                        toast.error("Please select Valid date.");
                        return;
                      }

                      const [year, month, day] = e.target.value.split("-");
                      const formatted = `${day}/${month}/${year}`;
                      setInquiryForm(prev => ({
                        ...prev,
                        eventDate: formatted
                      }));
                    }}
                    className={`w-full border rounded px-3 py-2 ${inquiryErrors.eventDate ? 'border-red-500' : ''}`}
                  />

                  {inquiryErrors.eventDate && <span className="text-red-500 text-xs mt-1">{inquiryErrors.eventDate}</span>}
                </div>
                <div>
                  <label className="block mb-1">Message <span className="text-red-500">*</span></label>
                  <textarea name="message" rows="3" value={inquiryForm.message} onChange={handleInquiryChange} className={`w-full border rounded px-3 py-2 ${inquiryErrors.message ? 'border-red-500' : ''}`} />
                  {inquiryErrors.message && <span className="text-red-500 text-xs mt-1">{inquiryErrors.message}</span>}
                </div>
                <button type="submit"
                  disabled={inquiryLoading || userRecord?.user?.role === 'vendor'}
                  className="w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-[#0f4c81]">
                  {inquiryLoading ? 'Sending...' : 'Send Inquiry'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-100 mt-6 rounded">
        {['About', 'Reviews', 'FAQ'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 font-medium ${activeTab === tab ? 'bg-white rounded m-1' : 'text-gray-500 hover:text-black'
              }`}
          >
            {tab === 'Reviews' ? 'Reviews' : tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'About' && <PreviewProfileScreen />}
          {activeTab === 'Reviews' && <CustomerReviews vendorId={actualVendorId} />}
          {activeTab === 'FAQ' && <FaqQuestions vendorId={actualVendorId} />}
        </div>

        <div className="space-y-6">
          {vendorData?.spaces && vendorData.spaces.filter(space => space.isActive).length > 0 && (
            <div className="border rounded p-4 shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-2">Your Spaces</h3>
              <p className="text-gray-500 text-sm mb-4">Overview of all spaces and services</p>
              <div className="flex flex-col gap-4">
                {vendorData.spaces.filter(space => space.isActive).map((space, index) => (
                  <div key={index} className="border rounded overflow-hidden">
                    <img
                      src={space.profilePicture 
                        ? (space.profilePicture.startsWith('http') || space.profilePicture.startsWith('/') 
                          ? space.profilePicture 
                          : `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000"}/${space.profilePicture}`)
                        : vendor?.vendor?.profilePicture || coverimage
                      }
                      alt={space.name || 'Space'}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = coverimage;
                      }}
                    />
                    
                    <div className="p-4">
                      <div className="mb-2">
                        <h5 className="text-lg font-medium mb-1">{space.name || 'Unnamed Space'}</h5>
                        <div className="flex justify-between items-center">
                          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                            {space.venueType || space.vendorType || 'Not specified'}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                            {space.type || 'Indoor'}
                          </span>
                        </div>
                      </div>
                      
                      {(space.minCapacity || space.maxCapacity) && (
                        <div className="mb-2">
                          <span className="text-gray-600 text-sm font-medium">Capacity: </span>
                          <span className="text-sm">
                            {space.minCapacity && space.maxCapacity 
                              ? `${space.minCapacity} - ${space.maxCapacity} guests`
                              : space.minCapacity 
                              ? `Min ${space.minCapacity} guests`
                              : `Max ${space.maxCapacity} guests`
                            }
                          </span>
                        </div>
                      )}
                      
                      {space.businessType === 'venue' && (space.vegPrice || space.nonVegPrice || space.vegImflPrice || space.nonVegImflPrice) && (
                        <div className="mb-2">
                          <span className="text-gray-600 text-sm font-medium block">Food (per plate):</span>
                          <div className="flex flex-wrap gap-2 text-sm">
                            {space.vegPrice && <span>Veg: ₹{space.vegPrice}</span>}
                            {space.nonVegPrice && <span>Non-Veg: ₹{space.nonVegPrice}</span>}
                            {space.vegImflPrice && <span>Veg+IMFL: ₹{space.vegImflPrice}</span>}
                            {space.nonVegImflPrice && <span>Non-Veg+IMFL: ₹{space.nonVegImflPrice}</span>}
                          </div>
                        </div>
                      )}
                      
                      {space.businessType === 'vendor' && space.servicePrice && (
                        <div className="mb-2">
                          <span className="text-gray-600 text-sm">Price: </span>
                          <span className="text-sm">₹{space.servicePrice} {space.priceUnit || 'per event'}</span>
                        </div>
                      )}
                      
                      {space.cuisines && space.cuisines.length > 0 && (
                        <div className="mb-2">
                          <span className="text-gray-600 text-sm font-medium block">Cuisines:</span>
                          <div className="flex flex-wrap gap-1">
                            {space.cuisines.map((cuisine, cuisineIndex) => (
                              <span key={cuisineIndex} className="text-sm bg-gray-100 px-2 py-1 rounded">{cuisine}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-gray-600 text-sm font-medium">Location: </span>
                        <span className="text-sm">
                          {[space.address, space.city, space.state, space.pinCode]
                            .filter(Boolean)
                            .join(', ') || 'Location not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {actualVendorId && <SimilarVendors vendorType={vendor?.vendor?.vendorType} currentVendorId={actualVendorId} />}
      {selectedImage && <ImageViewModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      {selectedVideo && <VideoViewModal videoUrl={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

export default PreviewProfile;