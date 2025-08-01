import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateVendorByAdminMutation } from '../../features/admin/adminAPI';
import { toast } from 'react-toastify';

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
  'Wedding Planners',
  'Wedding Photographers',
  'Astrologers'
];

const LOCATIONS = [
  'Delhi',
  'New Delhi',
  'Noida',
  'Greater Noida',
  'Gurgaon',
  'Faridabad',
  'Ghaziabad',
  'Indirapuram',
  'Dwarka',
  'Rohini',
  'Janakpuri',
  'Laxmi Nagar',
  'Vasant Kunj',
  'Connaught Place',
  'Saket',
  'Other'
];

export default function AdminAddVendor() {
  const navigate = useNavigate();
  const [createVendorByAdmin, { isLoading }] = useCreateVendorByAdminMutation();

  const [formData, setFormData] = useState({
    businessName: '',
    vendorType: '',
    contactName: '',
    email: '',
    phone: '',
    password: '',
    serviceAreas: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.vendorType || !formData.contactName || 
        !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append('isVerified', true);
      data.append('isApproved', true);
      data.append('termsAccepted', true);
      if (profilePicture) {
        data.append('profilePicture', profilePicture);
      }
      
      await createVendorByAdmin(data).unwrap();
      
      toast.success('Vendor created successfully!');
      navigate('/admin/vendor_management');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create vendor');
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
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vendor Type *</label>
          <select
            name="vendorType"
            value={formData.vendorType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select vendor type</option>
            {VENDOR_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Name *</label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <select
            name="serviceAreas"
            value={formData.serviceAreas}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select your primary service area</option>
            {LOCATIONS.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-center space-x-4">
            {profilePicture && (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Preview"
                className="h-16 w-16 rounded-full object-cover border"
              />
            )}
            <label
              htmlFor="profilePicture"
              className="cursor-pointer inline-block px-4 py-2 text-white text-sm font-medium rounded-md shadow transition"
              style={{ backgroundColor: '#0f4c81' }}
            >
              Choose File
              <input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          {profilePicture && (
            <p className="mt-2 text-sm text-gray-500">{profilePicture.name}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/vendor_management')}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: '#0f4c81' }}
          >
            {isLoading ? 'Creating...' : 'Create Vendor'}
          </button>
        </div>
      </form>
    </div>
  );
}