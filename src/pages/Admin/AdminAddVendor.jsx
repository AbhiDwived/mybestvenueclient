import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVendorByAdminMutation } from '../../features/admin/adminAPI';
import { toast } from 'react-toastify';
import { Country, State, City } from 'country-state-city';
import axios from 'axios';

const VENDOR_TYPES = [
  'Photographers',
  'Makeup Artists',
  'Mehndi Artists',
  'Bands',
  'Cake Vendors',
  'Caterers',
  'Florists',
  'Decorators',
  'Bridal Wear',
  'Jewellers',
  'Groom Wear',
  'Choreographers',
  'Event Planners',
  'DJs',
  'Magicians',
  'Gift Providers',
  'Tent House Services',
  'Entertainers',
  'Bus On Rent',
  'Wedding Planners',
  'Wedding Photographers',
  'Astrologers'
];

const VENUE_TYPES = [
  'Art Gallery',
  'Amusement Park',
  'Auditorium',
  'Banquet halls',
  'Bars',
  'Clubs',
  'Pool Side',
  'Conference Rooms',
  'Farm Houses',
  'Hotels',
  'Party lawn',
  'Resort',
  'Restaurants',
  'Seminar Halls',
  'Theater',
  'Unique Venues',
  'Roof Top',
  'Gaming Zone',
  'Villas',
  'Pubs',
  'Meeting Rooms',
  'Boat / Yatch',
  'Vacation Homes',
  'Cafes',
  'Co-working spaces',
  'Business Centres',
  'Guest Houses',
  '5 Star Hotel',
  'Marriage Garden',
  'Wedding Hotels',
  'Marriage Lawn',
  'Wedding Resort',
  'Training Rooms',
  'Kids Play Area'
];

const NEAR_LOCATIONS = {
  'New Delhi': ['Connaught Place', 'India Gate', 'Red Fort', 'Karol Bagh', 'Paharganj'],
  'Mumbai': ['Bandra', 'Andheri', 'Juhu', 'Powai', 'Colaba', 'Marine Drive'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Jayanagar'],
  'Chennai': ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'],
  'Pune': ['Koregaon Park', 'Hinjewadi', 'Baner', 'Wakad', 'Kothrud'],
  'Gurgaon': ['Cyber City', 'Golf Course Road', 'Sohna Road', 'MG Road', 'Sector 14'],
  'Noida': ['Sector 18', 'Sector 62', 'Greater Noida', 'Sector 15', 'Sector 37']
};

export default function AdminAddVendor() {
  const navigate = useNavigate();
  const [createVendorByAdmin, { isLoading }] = useCreateVendorByAdminMutation();

  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    vendorType: '',
    venueType: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    country: 'IN',
    state: '',
    city: '',
    nearLocation: '',
    customNearLocation: '',
    pinCode: '',
    address: '',
    serviceAreas: ''
  });
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const indianStates = State.getStatesOfCountry('IN');
    setStates(indianStates);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state') {
      const stateCities = City.getCitiesOfState('IN', value);
      setCities(stateCities);
      setFormData(prev => ({ ...prev, state: value, city: '', nearLocation: '' }));
    } else if (name === 'city') {
      setFormData(prev => ({ ...prev, city: value, nearLocation: '' }));
    } else if (name === 'pinCode') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 6) {
        setFormData(prev => ({ ...prev, pinCode: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Clear the selected file
      setProfilePicture(null);
      // Reset file input
      const fileInput = document.getElementById('profilePicture');
      if (fileInput) {
        fileInput.value = '';
      }
      return;
    }
    
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB. Please compress your image and try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Clear the selected file
      setProfilePicture(null);
      // Reset file input
      const fileInput = document.getElementById('profilePicture');
      if (fileInput) {
        fileInput.value = '';
      }
      return;
    }
    
    setUploadingImage(true);
    const uploadFormData = new FormData();
    uploadFormData.append('profilePicture', file);
    
    // Create a toast ID for progress updates
    let uploadToastId = null;
    
    try {
      // Show initial upload toast
      uploadToastId = toast.loading('🔄 Preparing to upload image...', {
        position: "top-center",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });
      
      const response = await axios.post('/api/v1/upload/profile-picture', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout for large files
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            
            // Update the existing toast with progress
            toast.update(uploadToastId, {
              render: `📤 Uploading image to cloud storage... ${percentCompleted}%`,
              type: "info",
              isLoading: true,
              progress: percentCompleted / 100,
            });
          }
        }
      });
      
      // Dismiss the upload progress toast
      if (uploadToastId) {
        toast.dismiss(uploadToastId);
      }
      
      if (response.data && response.data.success) {
        setProfilePictureUrl(response.data.url);
        toast.success('✅ Image uploaded successfully to cloud storage!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(response.data?.message || 'Upload response indicates failure');
      }
    } catch (error) {
      // Dismiss progress toast if it exists
      if (uploadToastId) {
        toast.dismiss(uploadToastId);
      }
      
      console.error('Upload error:', error);
      
      let errorMessage = 'Failed to upload image';
      let autoCloseTime = 5000;
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Upload timeout - please try again with a smaller image or check your internet connection';
        autoCloseTime = 6000;
      } else if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverMessage = error.response.data?.message;
        
        if (status === 413) {
          errorMessage = 'Image file is too large. Please use an image smaller than 5MB.';
        } else if (status === 415) {
          errorMessage = 'Unsupported image format. Please use JPEG, PNG, GIF, or WebP.';
        } else if (status === 500) {
          errorMessage = 'Server error during upload. Please try again later.';
        } else {
          errorMessage = serverMessage || `Upload failed with status ${status}`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error - please check your internet connection and try again';
        autoCloseTime = 6000;
      } else {
        // Other error
        errorMessage = error.message || 'Unexpected error during upload';
      }
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-center",
        autoClose: autoCloseTime,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Clear the selected file and URL on error
      setProfilePicture(null);
      setProfilePictureUrl('');
      
      // Reset file input
      const fileInput = document.getElementById('profilePicture');
      if (fileInput) {
        fileInput.value = '';
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.businessType || !formData.contactName || 
        !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.businessType === 'vendor' && !formData.vendorType) {
      toast.error('Please select a vendor type');
      return;
    }

    if (formData.businessType === 'venue' && !formData.venueType) {
      toast.error('Please select a venue type');
      return;
    }

    try {
      const data = new FormData();
      // Add basic fields
      data.append('businessName', formData.businessName);
      data.append('businessType', formData.businessType);
      data.append('contactName', formData.contactName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('country', formData.country);
      data.append('state', formData.state);
      data.append('city', formData.city);
      data.append('pinCode', formData.pinCode);
      data.append('address', formData.address);
      
      // Add business type specific fields
      if (formData.businessType === 'vendor') {
        data.append('vendorType', formData.vendorType);
      } else if (formData.businessType === 'venue') {
        data.append('venueType', formData.venueType);
      }
      
      // Handle near location
      const finalNearLocation = formData.nearLocation === 'other' ? formData.customNearLocation : formData.nearLocation;
      if (finalNearLocation) {
        data.append('nearLocation', finalNearLocation);
      }
      
      // Create service areas from location
      const selectedState = states.find(s => s.isoCode === formData.state);
      const locationString = `${formData.city}, ${selectedState?.name || formData.state}, India`;
      data.append('serviceAreas', JSON.stringify([locationString]));
      data.append('isVerified', true);
      data.append('isApproved', true);
      data.append('termsAccepted', true);
      
      // Use cloud URL if available, otherwise use the file
      if (profilePictureUrl) {
        data.append('profilePictureUrl', profilePictureUrl);
      } else if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }
      
      await createVendorByAdmin(data).unwrap();
      
      toast.success('✅ Vendor created successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/admin/vendor_management');
    } catch (error) {
      // Debug: log the error object to inspect its structure
      console.error('AdminAddVendor error:', error);
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        error?.response?.data?.message ||
        (typeof error === 'string' ? error : null) ||
        'Failed to create vendor';
      if (errorMessage && errorMessage.toLowerCase().includes('business name already taken')) {
        toast.error('❌ Business name already taken', {
          position: "top-center",
          autoClose: 4000,
        });
      } else {
        toast.error(`❌ ${errorMessage}`, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Vendor</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name *</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Business Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Business Type *</label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.businessType === 'vendor'}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  businessType: prev.businessType === 'vendor' ? '' : 'vendor',
                  vendorType: '',
                  venueType: ''
                }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Vendor Type</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.businessType === 'venue'}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  businessType: prev.businessType === 'venue' ? '' : 'venue',
                  vendorType: '',
                  venueType: ''
                }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Venue Type</span>
            </label>
          </div>
        </div>

        {/* Vendor Type Dropdown */}
        {formData.businessType === 'vendor' && (
          <div>
            <label className="block text-sm font-medium mb-1">Vendor Type *</label>
            <select
              name="vendorType"
              value={formData.vendorType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select vendor type</option>
              {VENDOR_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {/* Venue Type Dropdown */}
        {formData.businessType === 'venue' && (
          <div>
            <label className="block text-sm font-medium mb-1">Venue Type *</label>
            <select
              name="venueType"
              value={formData.venueType}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select venue type</option>
              {VENUE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Contact Name *</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-1">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="IN">India</option>
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium mb-1">State *</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-1">City *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!formData.state}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Near Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Near Location</label>
          <select
            name="nearLocation"
            value={formData.nearLocation === 'other' ? 'other' : (NEAR_LOCATIONS[formData.city]?.includes(formData.nearLocation) ? formData.nearLocation : '')}
            onChange={(e) => {
              if (e.target.value === 'other') {
                setFormData(prev => ({ ...prev, nearLocation: 'other', customNearLocation: '' }));
              } else {
                setFormData(prev => ({ ...prev, nearLocation: e.target.value, customNearLocation: '' }));
              }
            }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!formData.city}
          >
            <option value="">Select Near Location (Optional)</option>
            {formData.city && NEAR_LOCATIONS[formData.city]?.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {formData.nearLocation === 'other' && (
            <input
              type="text"
              placeholder="Enter your near location"
              value={formData.customNearLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, customNearLocation: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
            />
          )}
        </div>

        {/* Pin Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Pin Code *</label>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            placeholder="Enter 6-digit PIN code"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Enhanced Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-center space-x-4">
            {(profilePictureUrl || profilePicture) && (
              <div className="relative">
                <img
                  src={profilePictureUrl || (profilePicture ? URL.createObjectURL(profilePicture) : '')}
                  alt="Preview"
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                />
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="profilePicture"
                className={`cursor-pointer inline-block px-4 py-2 text-white text-sm font-medium rounded-md shadow transition ${
                  uploadingImage ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: uploadingImage ? '#9CA3AF' : '#0f4c81' }}
              >
                {uploadingImage ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  'Choose File'
                )}
                <input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500">
                Supported: JPEG, PNG, GIF, WebP (Max: 5MB)
              </p>
            </div>
          </div>
          {profilePicture && !uploadingImage && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">File:</span> {profilePicture.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Size:</span> {(profilePicture.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
          {profilePictureUrl && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Image uploaded successfully to cloud storage
              </p>
            </div>
          )}
          {uploadingImage && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700 flex items-center">
                <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading image to cloud storage...
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/vendor_management')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || uploadingImage}
            className={`px-4 py-2 text-white rounded-md transition-colors ${
              isLoading || uploadingImage 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'hover:opacity-90'
            }`}
            style={{ backgroundColor: isLoading || uploadingImage ? '#9CA3AF' : '#0f4c81' }}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : uploadingImage ? (
              'Please wait for image upload...'
            ) : (
              'Create Vendor'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}