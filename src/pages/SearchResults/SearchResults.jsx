import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useGetAllPublicVendorsQuery } from '../../features/vendors/vendorAPI';
import DiscoverImage from "../../assets/newPics/discoverImage.jpg";
import Loader from "../../components/{Shared}/Loader";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MapPin } from 'lucide-react';
import { useState } from 'react';

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const selectedCity = searchParams.get('city') || 'All India';
  const [favorites, setFavorites] = useState([]);

  const { data: vendorData, isLoading, error } = useGetAllPublicVendorsQuery();

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleVendorClick = (vendorId) => {
    navigate(`/preview-profile/${vendorId}`);
  };

  const filteredVendors = React.useMemo(() => {
    if (!vendorData?.vendors) return [];
    
    return vendorData.vendors.filter(vendor => {
      const matchesSearch = searchTerm === '' || 
        vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.serviceAreas?.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = category === '' || vendor.vendorType === category;

      const matchesLocation = selectedCity === 'All India' || 
        vendor.serviceAreas?.includes(selectedCity) ||
        vendor.address?.city === selectedCity;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [vendorData, searchTerm, category, selectedCity]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading vendors: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="w-full py-8">
      <div className="px-4 mb-6">
        <h1 className="text-3xl font-bold mb-2 font-serif">Search Results</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {searchTerm && <span>Search: "{searchTerm}"</span>}
          {category && <span>Category: {category}</span>}
          {selectedCity !== 'All India' && <span>Location: {selectedCity}</span>}
        </div>
        <p className="mt-2 text-gray-600">{filteredVendors.length} vendors found</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor._id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
            onClick={() => handleVendorClick(vendor._id)}
          >
            <div className="relative group">
              <img
                src={vendor.profilePicture || vendor.galleryImages?.[0]?.url || DiscoverImage}
                alt={vendor.businessName}
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <button
                onClick={(e) => toggleFavorite(e, vendor._id)}
                className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-gray-800"
              >
                {favorites.includes(vendor._id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>

            <div className="flex flex-col justify-between flex-grow p-2 font-serif">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.vendorType || "Vendor"}</p>
                <div className="flex justify-between items-center gap-2 mb-2">
                  <h5 className="text-md font-semibold truncate max-w-[65%] font-serif">
                    {vendor.businessName}
                  </h5>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                    <FaStar size={18} className="text-yellow-500" />
                    <span>4.5</span>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                  <MapPin size={14} />
                  <span className="truncate">
                    {vendor.serviceAreas?.[0] || vendor.address?.city || "Location not specified"}
                  </span>
                </div>
              </div>

              <div className="border-t mt-3 pt-3 text-sm text-gray-800">
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

                {/* Services */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  <span className="text-gray-600 p-1 rounded">
                    {(() => {
                      let raw = vendor.services || [];
                      let vendorServices = Array.isArray(raw)
                        ? raw.length === 1 && typeof raw[0] === "string"
                          ? raw[0].split(',').map(s => s.trim())
                          : raw
                        : [];

                      return vendorServices.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {vendorServices.slice(0, 2).map((service, index) => (
                            <span
                              key={index}
                              className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                            >
                              {service}
                            </span>
                          ))}
                          {vendorServices.length > 2 && (
                            <span className="text-sm text-gray-600 hover:underline">
                              +{vendorServices.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No services available</span>
                      );
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No vendors found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          <Link
            to="/"
            className="px-6 py-2 bg-[#0f4c81] text-white rounded hover:bg-[#0d3d6a] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 