import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetAllVendorsQuery } from '../../features/admin/adminAPI';
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import Loader from '../../components/{Shared}/Loader';
import { FiArrowLeft } from "react-icons/fi";
import { MapPin } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetVendorByIdQuery } from "../../features/vendors/vendorAPI";
import { 
  useSaveVendorMutation, 
  useUnsaveVendorMutation, 
  useCheckVendorSavedQuery 
} from "../../features/savedVendors/savedVendorAPI";
import { toast } from "react-toastify";

const VendorListPage = () => {
  const navigate = useNavigate();
  const { city = '', category = '' } = useParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('popular');

  const vendor = useSelector((state) => state.vendor.vendor);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const vendorId = vendor?._id;

  const { data, error: vendorError, isLoading: isLoadingVendor } = useGetVendorByIdQuery(vendorId, {
    skip: !vendorId || vendorId === 'undefined'
  });

  // Save/Unsave vendor mutations
  const [saveVendor, { isLoading: isSaving }] = useSaveVendorMutation();
  const [unsaveVendor, { isLoading: isUnsaving }] = useUnsaveVendorMutation();

  // Format inputs
  const formattedCategory = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const formattedCity = city === 'all-india'
    ? 'All India'
    : city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

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

  const { data: vendorsData, isLoading, error, refetch } = useGetAllVendorsQuery();

  if (isLoading) {
    return (
      <div className="text-center py-10">
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

  const rawServices = data?.vendor?.services || [];
  const services = Array.isArray(rawServices)
    ? rawServices.length === 1 && typeof rawServices[0] === "string"
      ? rawServices[0].split(',').map(s => s.trim())
      : rawServices
    : [];
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
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 text-gray-800 rounded border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
      </div>

      {/* Vendors Grid */}
      <div className="container mx-auto px-4 pb-12">
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

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No vendors found for your search criteria.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </>
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
          src={vendor.profilePicture || vendor.galleryImages?.[0]?.url || 'default-vendor-image.jpg'}
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
              {vendor.businessName || "Vendor Name"}
            </h5>

            <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
              <FaStar size={18} className="text-yellow-500" />
              <span>4.5</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
            <MapPin size={14} />
            <span className="truncate">
              {vendor.serviceAreas?.[0] || vendor.address?.city || "Location not specified"}
            </span>
          </div>
        </div>

        {/* Price / Rooms / Pax */}
        <div className="border-t mt-3 pt-3 text-sm text-gray-800">
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

export default VendorListPage;
