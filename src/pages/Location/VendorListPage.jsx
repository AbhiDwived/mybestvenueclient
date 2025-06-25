import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetAllVendorsQuery } from '../../features/admin/adminAPI';
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Loader from '../../components/{Shared}/Loader';
import { FiArrowLeft } from "react-icons/fi";

const VendorListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { category = '', city = 'all-india' } = useParams();
  const navigate = useNavigate();

  // Format category and city
  const formattedCategory = category
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : '';

  const formattedCity = city === 'all-india'
    ? 'All India'
    : city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const {
    data: vendorsData,
    isLoading,
    error,
    refetch
  } = useGetAllVendorsQuery();

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
    return <div className="text-center py-10 text-red-500">Invalid category or location in URL.</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading vendors: {error.message}
        <button
          onClick={() => refetch()}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Filter vendors
  const filteredVendors = vendorsData?.vendors?.filter(vendor => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    // Step 1: Category match
    const matchesCategory = vendor.vendorType === formattedCategory;

    // Step 2: Location match
    let matchesLocation = true; // default for "all-india"
    if (city !== 'all-india') {
      const searchCity = formattedCity.toLowerCase();
      const vendorLocations = [
        ...(vendor.serviceAreas || []),
        vendor.address?.city
      ]
        .filter(Boolean)
        .map(loc => loc.toLowerCase());

      matchesLocation = vendorLocations.some(loc => loc === searchCity);
    }

    // Step 3: Search term match (business name or service area)
    let matchesSearch = true; // no filter if search is empty
    if (lowerSearchTerm) {
      const searchableFields = [
        vendor.businessName.toLowerCase(),
        ...(vendor.serviceAreas || []).map(sa => sa.toLowerCase()),
        vendor.address?.city?.toLowerCase()
      ];

      matchesSearch = searchableFields.some(field =>
        field?.includes(lowerSearchTerm)
      );
    }

    return matchesCategory && matchesLocation && matchesSearch;
  }) || [];

  const formatPrice = (pricingRange) => {
    if (!pricingRange || typeof pricingRange.min !== 'number' || typeof pricingRange.max !== 'number') {
      return 'Price on request';
    }
    return `₹${pricingRange.min.toLocaleString()} - ₹${pricingRange.max.toLocaleString()}`;
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState('popular'); // Default to "popular"

  return (
    <>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-12 md:py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-bold text-white text-xl sm:text-2xl md:text-3xl mb-2">
              Find the Perfect {formattedCategory}
            </h1>
            <h2 className="text-lg mb-2">In {formattedCity}</h2>
            <p className="mb-6 text-sm sm:text-base">
              {filteredVendors.length} {filteredVendors.length === 1 ? 'Vendor' : 'Vendors'} Available
            </p>
            <div className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
              <button
                style={{ borderRadius: "5px" }}
                className="bg-[#10497a] hover:bg-[#062b4b] text-white px-4 py-2 text-sm whitespace-nowrap"
              >
                Search Venue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="min-h-screen p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <p className="text-2xl sm:text-3xl md:text-3xl w-full text-gray-800">
            {formattedCategory} in {formattedCity}
          </p>
          <div className="flex space-x-2 ">
            {/* Back Button */}
            <button
              style={{ borderRadius: '5px' }}
              className="flex items-center px-3 py-2 border text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              <Link to="/" style={{ textDecoration: "none", color: 'black' }} className="text-gray-700">
                Back to Home
              </Link>
            </button>

            {/* Popular Button */}
            <button
              style={{ borderRadius: '5px' }}
              className={`px-3 py-2  text-sm whitespace-nowrap transition-colors duration-200 ${activeTab === 'popular'
                  ? 'bg-[#062b4b] text-white '
                  : 'bg-transparent text-gray-700 border hover:bg-gray-100'
                }`}
              onClick={() => setActiveTab('popular')}
            >
              Popular
            </button>

            {/* Newest Button */}
            <button
              style={{ borderRadius: '5px' }}
              className={`px-3 py-2 text-sm whitespace-nowrap transition-colors duration-200 ${activeTab === 'newest'
                  ? 'bg-[#062b4b] text-white'
                  : 'bg-transparent text-gray-700 border hover:bg-gray-100'
                }`}
              onClick={() => setActiveTab('newest')}
            >
              Newest
            </button>
          </div>
        </div>

        {/* Vendor Cards or Empty Message */}
        {filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20">
            <p className="text-gray-500 text-lg mb-6">
              No vendors found matching your criteria.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-5 py-2 border text-sm rounded-md hover:bg-gray-100 text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor._id}
                onClick={() => handleVendorClick(vendor._id)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={vendor.profilePicture || vendor.galleryImages?.[0]?.url || '/default-vendor-image.jpg'}
                    alt={vendor.businessName}
                    className="w-full h-36 sm:h-40 md:h-48 object-cover"
                  />
                  <button
                    onClick={(e) => toggleFavorite(e, vendor._id)}
                    className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md"
                    aria-label={favorites.includes(vendor._id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.includes(vendor._id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>

                <div className="p-3 sm:p-4">
                  <h5 className="text-base sm:text-lg font-semibold mb-1 truncate">{vendor.businessName}</h5>
                  <div className="flex items-center mb-2">
                    <MdLocationOn className="text-gray-500 mr-1" />
                    <span className="text-gray-600 text-xs sm:text-sm">
                      {vendor.address?.city || vendor.serviceAreas?.[0] || 'Location not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-semibold text-xs sm:text-sm">New</span>
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">{formatPrice(vendor.pricingRange)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VendorListPage;