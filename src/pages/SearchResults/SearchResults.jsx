import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useGetAllPublicVendorsQuery } from '../../features/vendors/vendorAPI';
import DiscoverImage from "../../assets/newPics/discoverImage.jpg";
import Loader from "../../components/{Shared}/Loader";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  useSaveVendorMutation, 
  useUnsaveVendorMutation, 
  useCheckVendorSavedQuery 
} from "../../features/savedVendors/savedVendorAPI";
import { toast } from "react-toastify";

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const selectedCity = searchParams.get('city') || 'All India';
  
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: vendorData, isLoading, error } = useGetAllPublicVendorsQuery();

  // Save/Unsave vendor mutations
  const [saveVendor, { isLoading: isSaving }] = useSaveVendorMutation();
  const [unsaveVendor, { isLoading: isUnsaving }] = useUnsaveVendorMutation();

  const handleSaveVendor = async (e, vendorId) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login to save vendors");
      return;
    }

    try {
      await saveVendor(vendorId).unwrap();
      toast.success("Vendor saved successfully!");
    } catch (error) {
      toast.error(error.data?.message || "Failed to save vendor");
    }
  };

  const handleUnsaveVendor = async (e, vendorId) => {
    e.stopPropagation();
    
    try {
      await unsaveVendor(vendorId).unwrap();
      toast.success("Vendor removed from favorites");
    } catch (error) {
      toast.error(error.data?.message || "Failed to remove vendor");
    }
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
      
      const matchesCity = selectedCity === 'All India' || 
        vendor.serviceAreas?.some(area => area.toLowerCase().includes(selectedCity.toLowerCase())) ||
        vendor.address?.city?.toLowerCase().includes(selectedCity.toLowerCase());

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [vendorData, searchTerm, category, selectedCity]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading vendors: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Search Results</h1>
            <div className="bg-white rounded-lg p-4 text-gray-800">
              <p className="text-sm">
                {searchTerm && <span className="font-semibold">"{searchTerm}"</span>}
                {category && <span className="font-semibold"> in {category}</span>}
                {selectedCity !== 'All India' && <span className="font-semibold"> at {selectedCity}</span>}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {filteredVendors.length} {filteredVendors.length === 1 ? 'vendor' : 'vendors'} found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No vendors found matching your search criteria.</p>
            <Link 
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse All Vendors
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVendors.map((vendor) => (
              <VendorCard 
                key={vendor._id}
                vendor={vendor}
                onVendorClick={handleVendorClick}
                onSaveVendor={handleSaveVendor}
                onUnsaveVendor={handleUnsaveVendor}
                isAuthenticated={isAuthenticated}
                isSaving={isSaving}
                isUnsaving={isUnsaving}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Separate component for vendor card to handle individual save state
const VendorCard = ({ 
  vendor, 
  onVendorClick, 
  onSaveVendor, 
  onUnsaveVendor, 
  isAuthenticated,
  isSaving,
  isUnsaving 
}) => {
  const [isSaved, setIsSaved] = useState(false);
  
  // Check if vendor is saved (only for authenticated users)
  const { data: savedStatus } = useCheckVendorSavedQuery(vendor._id, {
    skip: !isAuthenticated
  });

  // Update local state when API response changes
  useEffect(() => {
    if (savedStatus?.isSaved !== undefined) {
      setIsSaved(savedStatus.isSaved);
    }
  }, [savedStatus]);

  const handleHeartClick = (e) => {
    if (isSaved) {
      onUnsaveVendor(e, vendor._id);
      setIsSaved(false); // Optimistic update
    } else {
      onSaveVendor(e, vendor._id);
      setIsSaved(true); // Optimistic update
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
      onClick={() => onVendorClick(vendor._id)}
    >
      <div className="relative group">
        <img
          src={vendor.profilePicture || vendor.galleryImages?.[0]?.url || DiscoverImage}
          alt={vendor.businessName}
          className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
        />
        <button
          onClick={handleHeartClick}
          disabled={isSaving || isUnsaving}
          className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-gray-800 hover:bg-gray-50 disabled:opacity-50"
        >
          {isSaved ? (
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
  );
};

export default SearchResults; 