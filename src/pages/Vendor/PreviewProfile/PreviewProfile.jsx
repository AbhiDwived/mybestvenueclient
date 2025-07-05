import { useEffect, useState } from 'react';
import { FaStar, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { FiPhone, FiGlobe, FiCalendar } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from 'react-icons/io5';
import { HiOutlineCalendar } from "react-icons/hi";
import { useNavigate, useParams } from 'react-router-dom';
import { useGetVendorByIdQuery, useVendorservicesPackageListMutation } from '../../../features/vendors/vendorAPI';
import { useCreateBookingMutation, useGetUserBookingsQuery } from '../../../features/bookings/bookingAPI';
import { toast } from 'react-toastify';
import mainProfile from "../../../assets/mainProfile.png";
import vendorManagementPic from "../../../assets/vendorManagementPic.png";
import secondProfile from "../../../assets/secondProfile.png";
import { FiFacebook, FiTwitter, FiShield } from "react-icons/fi";
import PreviewProfileScreen from './PreviewProfileScreen';
import CustomerReviews from './CustomerReviews';
import SimilarVendors from './SimilarVendors';
import FaqQuestions from './FaqQuestions';
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Loader from '../../../components/{Shared}/Loader';
import { useAddUserInquiryMessageMutation } from '../../../features/auth/authAPI';
import { ImCross } from 'react-icons/im';
import { useGetPortfolioImagesQuery, useGetPortfolioVideosQuery } from '../../../features/vendors/vendorAPI';

const PreviewProfile = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [activeGalleryTab, setActiveGalleryTab] = useState('images');
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const { data: vendor, isLoading: isVendorLoading, error: vendorError } = useGetVendorByIdQuery(vendorId);
  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const { refetch: refetchBookings } = useGetUserBookingsQuery();
  const [packages, setPackages] = useState([]);
  const [getVendorPackages] = useVendorservicesPackageListMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 9;

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Booking form state with validation
  const [bookingForm, setBookingForm] = useState({
    eventType: '',
    packageName: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    guestCount: '',
    selectedPackage: '',
    plannedAmount: '5000',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setBookingForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const validateForm = () => {
    const errors = {};
    if (!bookingForm.eventType) errors.eventType = 'Event type is required';
    if (!bookingForm.packageName) errors.packageName = 'Package name is required';
    if (!bookingForm.eventDate) errors.eventDate = 'Event date is required';
    if (!bookingForm.name) errors.name = 'Name is required';
    if (!bookingForm.email) errors.email = 'Email is required';
    if (!bookingForm.phone) errors.phone = 'Phone is required';
    if (!bookingForm.plannedAmount) errors.plannedAmount = 'Planned amount is required';
    
    // Validate date is not in the past
    if (bookingForm.eventDate) {
      const selectedDate = new Date(bookingForm.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.eventDate = 'Event date cannot be in the past';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBookingInputChange = (field, value) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when field is updated
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Fetch vendor packages
  useEffect(() => {
    const fetchPackages = async () => {
      const actualVendorId = vendor?.vendor?._id;

      if (!actualVendorId) {
        return;
      }

      try {
        const response = await getVendorPackages({ vendorId: actualVendorId }).unwrap();
        
        if (response?.packages && Array.isArray(response.packages)) {
          setPackages(response.packages);
        } else {
          setPackages([]);
        }
      } catch (error) {
        toast.error('Failed to load vendor packages');
        setPackages([]);
      }
    };

    if (!isVendorLoading && vendor?.vendor?._id) {
      fetchPackages();
    }
  }, [vendor, isVendorLoading, getVendorPackages]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      // Find selected package details
      const selectedPackageDetails = packages.find(pkg => pkg._id === bookingForm.packageName);
      
      // Use offer price if available and less than regular price
      const finalPrice = selectedPackageDetails?.offerPrice && 
                        selectedPackageDetails.offerPrice < selectedPackageDetails.price
                        ? selectedPackageDetails.offerPrice 
                        : selectedPackageDetails?.price || 0;
      
      const response = await createBooking({
        vendorId: vendorId,
        vendorName: vendor?.vendor?.businessName || '',
        eventType: bookingForm.eventType,
        packageName: selectedPackageDetails?.packageName || '',
        packageId: bookingForm.packageName,
        packagePrice: selectedPackageDetails?.price || 0,
        offerPrice: selectedPackageDetails?.offerPrice || 0,
        finalPrice: finalPrice,
        eventDate: bookingForm.eventDate,
        eventTime: bookingForm.eventTime,
        venue: bookingForm.venue,
        guestCount: parseInt(bookingForm.guestCount) || 0,
        plannedAmount: finalPrice,
        userName: bookingForm.name,
        userEmail: bookingForm.email,
        userPhone: bookingForm.phone,
        notes: bookingForm.notes
      }).unwrap();

      if (response.success) {
        toast.success('Booking request sent successfully');
        refetchBookings();
        
        // Reset form
        setBookingForm({
          eventType: '',
          packageName: '',
          eventDate: '',
          eventTime: '',
          venue: '',
          guestCount: '',
          selectedPackage: '',
          plannedAmount: '0',
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          notes: ''
        });
        setFormErrors({});
      } else {
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (err) {
      toast.error(err.data?.message || 'Error creating booking');
    }
  };

  const vendorData = vendor?.vendor;
  


  const [isSaved, setIsSaved] = useState(false);

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    message: ''
  });

  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [addUserInquiryMessage] = useAddUserInquiryMessageMutation();

  const userRecord = useSelector((state) => state.auth);
  const userId = userRecord?.user?.id;

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('Please login to send an inquiry');
      return;
    }

    if (userRecord?.user?.role === 'vendor') {
      toast.error('Vendors cannot send inquiries');
      return;
    }

    // Validate required fields
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.phone || !inquiryForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setInquiryLoading(true);
    try {
      await addUserInquiryMessage({
        userId,
        vendorId: vendorData._id,
        name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        weddingDate: inquiryForm.weddingDate,
        message: inquiryForm.message
      }).unwrap();

      toast.success('Inquiry sent successfully!');
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        weddingDate: '',
        message: ''
      });
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setInquiryLoading(false);
    }
  };

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
  const [vendorPortfolio, setVendorPortfolio] = useState({
    images: vendor?.portfolio?.images || [],
    videos: vendor?.portfolio?.videos || []
  });

  const { data: portfolioImagesData } = useGetPortfolioImagesQuery(vendorId, {
    skip: !vendorId,
    selectFromResult: ({ data }) => ({
      data: data?.images || []
    })
  });

  const { data: portfolioVideosData } = useGetPortfolioVideosQuery(vendorId, {
    skip: !vendorId,
    selectFromResult: ({ data }) => ({
      data: data?.videos || []
    })
  });

  // Update vendor portfolio data
  useEffect(() => {
    if (portfolioImagesData && portfolioImagesData.length > 0) {
      setVendorPortfolio(prev => ({
        ...prev,
        images: portfolioImagesData
      }));
    }
  }, [portfolioImagesData]);

  useEffect(() => {
    if (portfolioVideosData && portfolioVideosData.length > 0) {
      setVendorPortfolio(prev => ({
        ...prev,
        videos: portfolioVideosData
      }));
    }
  }, [portfolioVideosData]);

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
      {/* Header */}

      <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col md:flex-row md:items-start gap-4">
        {/* Profile Image */}
        <img
          src={vendor?.vendor?.profilePicture || vendor?.vendor?.profilePhoto || mainProfile}
          alt={vendor?.vendor?.businessName || "Vendor Profile"}
          className="w-40 h-40 rounded-full object-cover"
        />

        {/* Content */}
        <div className="flex-1 space-y-1">

          <h2 className="text-xl font-bold text-gray-800">{vendor?.vendor?.businessName}</h2>
          <p className="text-sm text-gray-500">{vendor?.vendor?.vendorType}</p>
          
          {/* Services */}
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

          {/* Rating & Location */}
          <div className="flex flex-wrap items-center gap-2 text-md text-gray-600 mt-1">
            <span className="flex items-center font-medium">
              <FaStar className="mr-1" color={"#FACC15"} size={22} />
              {vendor?.rating || '4.8'}
              <span className="ml-1 text-gray-400">({vendor?.reviews?.length || '10'} reviews)</span>
            </span>
            <span>·</span>

            <span className="flex items-center">
              <IoLocationOutline className="inline-block mr-1" />
              {vendor?.vendor?.address || (
                vendor?.vendor?.serviceAreas?.length > 0 ? (
                  vendor.vendor.serviceAreas.map((area, index) => (
                    <span key={index}>
                      {area}
                      {index !== vendor.vendor.serviceAreas.length - 1 && ', '}
                    </span>
                  ))
                ) : 'Location not available'
              )}
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
          
          {activeGalleryTab === 'images' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

              {/* Pagination */}
              {vendorPortfolio.images.length > imagesPerPage && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#0f4c81] text-white hover:bg-[#0d3d6a]'
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from(
                    { length: Math.ceil(vendorPortfolio.images.length / imagesPerPage) },
                    (_, i) => i + 1
                  ).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-full ${
                        currentPage === pageNum
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
                    className={`px-3 py-1 rounded ${
                      currentPage === Math.ceil(vendorPortfolio.images.length / imagesPerPage)
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

        {/* Booking Form */}
        <form onSubmit={handleBookingSubmit} className="mx-auto border rounded-lg p-4 sm:p-6 md:p-8 shadow-sm bg-white text-sm grid gap-4 sm:grid-cols-2 w-full max-w-screen-sm">
          <h3 className="font-semibold text-xl sm:col-span-2">Book Your Service</h3>

          <label className="sm:col-span-2">
            <span className="block mb-1">Vendor</span>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={vendor?.vendor?.businessName || ''}
              readOnly
            />
          </label>

          <label className="sm:col-span-2">
            <span className="block mb-1">User Name *</span>
            <input 
              type="text" 
              value={bookingForm.name}
              onChange={(e) => handleBookingInputChange('name', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.name ? 'border-red-500' : ''}`}
              readOnly={isAuthenticated}
            />
            {formErrors.name && <span className="text-red-500 text-xs mt-1">{formErrors.name}</span>}
          </label>

          <label>
            <span className="block mb-1">Email *</span>
            <input 
              type="email" 
              value={bookingForm.email}
              onChange={(e) => handleBookingInputChange('email', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.email ? 'border-red-500' : ''}`}
              readOnly={isAuthenticated}
            />
            {formErrors.email && <span className="text-red-500 text-xs mt-1">{formErrors.email}</span>}
          </label>

          <label>
            <span className="block mb-1">Phone Number *</span>
            <input 
              type="tel" 
              value={bookingForm.phone}
              onChange={(e) => handleBookingInputChange('phone', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.phone ? 'border-red-500' : ''}`}
              readOnly={isAuthenticated}
            />
            {formErrors.phone && <span className="text-red-500 text-xs mt-1">{formErrors.phone}</span>}
          </label>

          <label>
            <span className="block mb-1">Event Type *</span>
            <select 
              value={bookingForm.eventType}
              onChange={(e) => handleBookingInputChange('eventType', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.eventType ? 'border-red-500' : ''}`}
            >
              <option value="">Select Event Type</option>
              <option value="Wedding Ceremony">Wedding Ceremony</option>
              <option value="Reception">Reception</option>
              <option value="Engagement">Engagement</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.eventType && <span className="text-red-500 text-xs mt-1">{formErrors.eventType}</span>}
          </label>

          <label>
            <span className="block mb-1">Package Name *</span>
            <select 
              value={bookingForm.packageName}
              onChange={(e) => {
                console.log('Selected package ID:', e.target.value);
                const selectedPackage = packages.find(pkg => pkg._id === e.target.value);
                console.log('Found package:', selectedPackage);
                handleBookingInputChange('packageName', e.target.value);
                if (selectedPackage) {
                  handleBookingInputChange('plannedAmount', selectedPackage.price || 0);
                }
              }}
              className={`w-full border rounded px-3 py-2 ${formErrors.packageName ? 'border-red-500' : ''}`}
            >
              <option value="">Select Package</option>
              {Array.isArray(packages) && packages.length > 0 ? (
                packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.packageName} - ₹{pkg.price?.toLocaleString('en-IN')} 
                    {pkg.offerPrice ? ` (Offer: ₹${pkg.offerPrice?.toLocaleString('en-IN')})` : ''}
                  </option>
                ))
              ) : (
                <option value="" disabled>No packages available</option>
              )}
            </select>
            {formErrors.packageName && <span className="text-red-500 text-xs mt-1">{formErrors.packageName}</span>}
          </label>

          <label>
            <span className="block mb-1">Wedding Date *</span>
            <input 
              type="date" 
              value={bookingForm.eventDate}
              onChange={(e) => handleBookingInputChange('eventDate', e.target.value)}
              className={`w-full border rounded px-3 py-2 ${formErrors.eventDate ? 'border-red-500' : ''}`}
              min={new Date().toISOString().split('T')[0]}
            />
            {formErrors.eventDate && <span className="text-red-500 text-xs mt-1">{formErrors.eventDate}</span>}
          </label>

          <label>
            <span className="block mb-1">Booking Time</span>
            <input 
              type="time" 
              value={bookingForm.eventTime}
              onChange={(e) => handleBookingInputChange('eventTime', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </label>

          <label>
            <span className="block mb-1">Number of Guests</span>
            <input 
              type="number" 
              value={bookingForm.guestCount}
              onChange={(e) => handleBookingInputChange('guestCount', e.target.value)}
              placeholder="e.g. 150" 
              className="w-full border rounded px-3 py-2"
              min="0"
            />
          </label>

          <label>
            <span className="block mb-1">Preferred Venue</span>
            <input 
              type="text" 
              value={bookingForm.venue}
              onChange={(e) => handleBookingInputChange('venue', e.target.value)}
              placeholder="Venue or City" 
              className="w-full border rounded px-3 py-2"
            />
          </label>

          <label>
            <span className="block mb-1">Planned Amount (₹) *</span>
            <input 
              type="number" 
              value={bookingForm.plannedAmount}
              className={`w-full border rounded px-3 py-2 bg-gray-50 ${formErrors.plannedAmount ? 'border-red-500' : ''}`}
              readOnly
            />
            {formErrors.plannedAmount && <span className="text-red-500 text-xs mt-1">{formErrors.plannedAmount}</span>}
            {(() => {
              const selectedPackage = packages.find(pkg => pkg._id === bookingForm.packageName);
              if (selectedPackage?.offerPrice && selectedPackage.offerPrice < selectedPackage.price) {
                return (
                  <span className="text-green-600 text-xs mt-1 block">
                    Special offer price: ₹{selectedPackage.offerPrice.toLocaleString('en-IN')}
                  </span>
                );
              }
              return null;
            })()}
          </label>

          <label className="sm:col-span-2">
            <span className="block mb-1">Additional Notes</span>
            <textarea 
              rows="3" 
              value={bookingForm.notes}
              onChange={(e) => handleBookingInputChange('notes', e.target.value)}
              placeholder="Tell us more about your event..." 
              className="w-full border rounded px-3 py-2"
            />
          </label>

          <button 
            type="submit" 
            className="sm:col-span-2 w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isBookingLoading}
          >
            {isBookingLoading ? 'Sending Request...' : 'Book Now'}
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

        {/* Right side: Inquiry */}
        <div className="space-y-6  ">
          {/* Inquiry Form */}
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h3 className="font-semibold text-lg mb-3">Send Inquiry</h3>
            <form className="space-y-3 text-sm" onSubmit={handleInquirySubmit}>
              <div>
                <label className="block mb-1">Your Name</label>
                <input type="text" name="name" value={inquiryForm.name} onChange={handleInquiryChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">Your Email</label>
                <input type="email" name="email" value={inquiryForm.email} onChange={handleInquiryChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1">Phone Number</label>
                <input type="tel" name="phone" value={inquiryForm.phone} onChange={handleInquiryChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                {/* <label className="block mb-1">useId</label> */}
                <input type="hidden" value={userId} className="w-full border rounded px-3 py-2" />
              </div>
              <input type="hidden" name="vendorId" value={vendorData._id} />
              <div>
                <label className="block mb-1">Wedding Date</label>
                <input
                  type="date"
                  name="weddingDateRaw"
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split("-");
                    const formatted = `${day}/${month}/${year}`;
                    setInquiryForm(prev => ({
                      ...prev,
                      weddingDate: formatted
                    }));
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Message</label>
                <textarea name="message" rows="3" value={inquiryForm.message} onChange={handleInquiryChange} className="w-full border rounded px-3 py-2" />
              </div>
              <button type="submit"
                disabled={!userId || inquiryLoading || userRecord?.user?.role === 'vendor'}
                className="w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-[#0f4c81]">
                {inquiryLoading ? 'Sending...' : 'Send Inquiry'}</button>
            </form>
          </div>
        </div>
      </div>
      <SimilarVendors vendorType={vendor?.vendorType} currentVendorId={vendorId} />
      {selectedImage && <ImageViewModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />}
      {selectedVideo && <VideoViewModal videoUrl={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  );
};

export default PreviewProfile;