import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetAllVendorsQuery } from '../../features/admin/adminAPI';
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useState } from 'react';

const VendorListPage = () => {
  const { category = '', city = 'all-india' } = useParams();
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  
  // Format the category name from URL
  const formattedCategory = category ? category.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') : '';

  // Format the city name from URL
  const formattedCity = city === 'all-india' ? 'All India' : 
    city.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const { data: vendorsData, isLoading, error } = useGetAllVendorsQuery();

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleVendorClick = (vendorId) => {
    navigate(`/preview-profile/${vendorId}`);
  };

  if (!category || !city) {
    return <div className="text-center py-10">Invalid URL parameters</div>;
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading vendors...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading vendors: {error.message}</div>;
  }

  // Filter vendors by category and location
  const filteredVendors = vendorsData?.vendors?.filter(vendor => {
    // Always check for category match
    const matchesCategory = vendor.vendorType === formattedCategory;

    // If city is 'all-india', don't filter by location
    if (city === 'all-india') {
      return matchesCategory;
    }

    // For specific location, check both serviceAreas and address.city
    const vendorLocations = [
      ...(vendor.serviceAreas || []),
      vendor.address?.city
    ].filter(Boolean).map(loc => loc.toLowerCase());

    const searchCity = formattedCity.toLowerCase();
    const matchesLocation = vendorLocations.some(loc => 
      loc.toLowerCase() === searchCity
    );

    return matchesCategory && matchesLocation;
  }) || [];

  // Format price range
  const formatPrice = (pricingRange) => {
    if (!pricingRange || typeof pricingRange.min !== 'number' || typeof pricingRange.max !== 'number') {
      return 'Price on request';
    }
    return `₹${pricingRange.min.toLocaleString()} - ₹${pricingRange.max.toLocaleString()}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">{formattedCategory}</h1>
      <h2 className="text-xl text-gray-600 text-center mb-2">in {formattedCity}</h2>
      <p className="text-center text-gray-500 mb-8">
        {filteredVendors.length} {filteredVendors.length === 1 ? 'Vendor' : 'Vendors'} Available
      </p>

      {filteredVendors.length === 0 ? (
        <div className="text-center py-10">
          No vendors found for {formattedCategory} in {formattedCity}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor._id}
              onClick={() => handleVendorClick(vendor._id)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative">
                <img
                  src={vendor.profilePicture || vendor.galleryImages?.[0]?.url || '/default-vendor-image.jpg'}
                  alt={vendor.businessName}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={(e) => toggleFavorite(e, vendor._id)}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
                >
                  {favorites.includes(vendor._id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{vendor.businessName}</h3>
                <div className="flex items-center mb-2">
                  <MdLocationOn className="text-gray-500 mr-1" />
                  <span className="text-gray-600">
                    {vendor.address?.city || vendor.serviceAreas?.[0] || 'Location not specified'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-semibold">New</span>
                  </div>
                  <div className="text-gray-600">
                    {formatPrice(vendor.pricingRange)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorListPage;
