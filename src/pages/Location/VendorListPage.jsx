import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetAllVendorsQuery } from '../../features/admin/adminAPI';
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Loader from '../../components/{Shared}/Loader';
import { FiArrowLeft } from "react-icons/fi";
import { MapPin } from 'lucide-react';

const VendorListPage = () => {
  const navigate = useNavigate();
  const { city = '', category = '' } = useParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('popular');

  // Format inputs
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedCity = city === 'all-india'
    ? 'All India'
    : city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Load favorites
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const {
    data: vendorsData,
    isLoading,
    error,
    refetch,
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

  const formatPrice = (pricingRange) => {
    if (!pricingRange || typeof pricingRange.min !== 'number' || typeof pricingRange.max !== 'number') {
      return 'Price on request';
    }
    return `₹${pricingRange.min.toLocaleString()} - ₹${pricingRange.max.toLocaleString()}`;
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

  const filteredVendors = vendorsData?.vendors?.filter(vendor => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const matchesCategory = vendor.vendorType === formattedCategory;

    let matchesLocation = city === 'all-india';
    if (!matchesLocation) {
      const searchCity = formattedCity.toLowerCase();
      const vendorLocations = [
        ...(vendor.serviceAreas || []),
        vendor.address?.city
      ].filter(Boolean).map(loc => loc.toLowerCase());

      matchesLocation = vendorLocations.includes(searchCity);
    }

    let matchesSearch = true;
    if (lowerSearchTerm) {
      const searchable = [
        vendor.businessName.toLowerCase(),
        ...(vendor.serviceAreas || []).map(sa => sa.toLowerCase()),
        vendor.address?.city?.toLowerCase() || ''
      ];
      matchesSearch = searchable.some(field => field.includes(lowerSearchTerm));
    }

    return matchesCategory && matchesLocation && matchesSearch;
  }) || [];

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-12 md:py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl mb-2">Find the Perfect {formattedCategory}</h1>
            <h2 className="text-lg mb-2">In {formattedCity}</h2>
            <p className="mb-6 text-sm sm:text-base">{filteredVendors.length} {filteredVendors.length === 1 ? 'Vendor' : 'Vendors'} Available</p>

            <div className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 font-bold" aria-label="Clear search">
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

      {/* Filter and Sort */}
      <div className="min-h-screen p-4 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <p className="text-2xl sm:text-3xl md:text-3xl w-full text-gray-800">
            {formattedCategory} in {formattedCity}
          </p>
          <div className="flex space-x-2">
            <Link
              to="/"
              style={{ textDecoration: 'none', color: 'black' }}
              className="flex items-center px-3 py-2 border text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap rounded"
            >
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
            <button
              className={`px-3 py-2 text-sm rounded ${activeTab === 'popular' ? 'bg-[#062b4b] text-white' : 'border text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('popular')}
            >
              Popular
            </button>
            <button
              className={`px-3 py-2 text-sm rounded ${activeTab === 'newest' ? 'bg-[#062b4b] text-white' : 'border text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setActiveTab('newest')}
            >
              Newest
            </button>
          </div>
        </div>

        {/* Vendor Cards */}
        {filteredVendors.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <p className="text-lg mb-6">No vendors found matching your criteria.</p>
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
                  >
                    {favorites.includes(vendor._id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>

                <div className="p-3 sm:p-4 font-serif">

                  <div>


                    <p className="text-xs text-gray-400 mb-1 uppercase">{vendor.vendorType || "Vendor"}</p>
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <h5 className="text-md font-semibold truncate max-w-[65%]">
                        {vendor.businessName || vendor.name || "Vendor Name"}
                      </h5>

                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                        <FaStar size={18} className="text-yellow-500" />
                        <span>{vendor.rating || "5.0"}</span>
                      </div>


                    </div>


                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                      <MapPin size={14} />
                      <span className="truncate">{vendor.serviceAreas?.join(", ") || "Location not specified"}</span>

                    </div>

                    {/* Tags */}
                    <div className="flex items-center flex-wrap gap-2 text-xs text-gray-600 mt-1">

                    </div>
                  </div>

                  <div className="flex items-center justify-between">

                    <div className="border-t  border-gray-400 mt-3 pt-3 text-sm text-gray-800 w-full">
                      {/* Veg & Non-Veg prices side-by-side, aligned left */}
                      <div className="flex items-start gap-8 mb-2">
                        {/* Veg price */}
                        <div>
                          <div className="text-xs text-gray-500">Veg</div>
                          <div className="text-base font-semibold text-gray-800">
                            ₹ {vendor.priceVeg || "999"} <span className="text-xs font-normal text-gray-500">per plate</span>
                          </div>
                        </div>

                        {/* Non-Veg price */}
                        <div>
                          <div className="text-xs text-gray-500">Non veg</div>
                          <div className="text-base font-semibold text-gray-800">
                            ₹ {vendor.priceNonVeg || "1,200"} <span className="text-xs font-normal text-gray-500">per plate</span>
                          </div>
                        </div>
                      </div>

                      {/* Capacity, Rooms, and More */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                        <span>{vendor.capacity || "650–2500 pax"}</span>
                        <span>• {vendor.rooms || "4 Rooms"}</span>
                        <span>• +7 more</span>
                      </div>
                    </div>
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
