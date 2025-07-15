import { useEffect, useState, useMemo } from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MapPin } from 'lucide-react';
import { useGetSimilarVendorsQuery } from '../../../features/vendors/vendorAPI';
import { useParams, useNavigate } from "react-router-dom";
import { useGetVendorsReviewStatsQuery } from '../../../features/reviews/reviewAPI';
import { useSelector } from 'react-redux';
import mainProfile from "../../../assets/mainProfile.png";

const SimilarVendors = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const [showAll, setShowAll] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetSimilarVendorsQuery(vendorId);
  const vendors = data?.similarVendors || [];

  // Format vendors data for display (like FeatureVendors)
  const formattedVendors = useMemo(() => vendors.map(vendor => ({
    id: vendor._id,
    image: vendor.profilePicture || vendor.galleryImages?.[0]?.url || mainProfile,
    category: vendor.vendorType,
    name: vendor.businessName || vendor.name,
    location: vendor.serviceAreas?.length > 0
      ? vendor.serviceAreas[0]
      : vendor.address?.city && vendor.address?.state
        ? `${vendor.address.city}, ${vendor.address.state}`
        : vendor.address?.city || vendor.address?.state || 'Location not specified',
    services: vendor.services,
    price: vendor.pricingRange && vendor.pricingRange.min && vendor.pricingRange.max
      ? `₹${vendor.pricingRange.min.toLocaleString()} - ₹${vendor.pricingRange.max.toLocaleString()}`
      : 'Price on request',
    pricing: vendor.pricing || [],
  })), [vendors]);

  // Show all or first 4
  const displayedVendors = useMemo(() => showAll ? formattedVendors : formattedVendors.slice(0, 4), [showAll, formattedVendors]);

  // Fetch review stats for all displayed vendors
  const vendorIds = useMemo(() => displayedVendors.map(v => v.id), [displayedVendors]);
  const { data: statsData, isLoading: isLoadingStats } = useGetVendorsReviewStatsQuery(vendorIds, { skip: !vendorIds.length });
  const stats = statsData?.stats || {};

  const handleVendorClick = (vendor) => {
    navigate(`/preview-profile/${vendor.id}`);
  };

  if (isLoading) return <p className="text-center">Loading similar vendors...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load similar vendors.</p>;

  return (
    <div className="mx-5 mt-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-600">Similar Vendors</h2>
        {formattedVendors.length > 4 && (
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="text-gray-600 font-medium text-sm border border-gray-500 bg-[#DEBF78] rounded p-1"
          >
            {showAll ? "View Less" : "View All"}
          </button>
        )}
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedVendors.length === 0 ? (
          <p className="text-center col-span-full">No vendors available for this category.</p>
        ) : (
          displayedVendors.map((vendor) => {
            const stat = stats[vendor.id] || { avgRating: 0, reviewCount: 0 };
            return (
              <div
                key={vendor.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
                onClick={() => handleVendorClick(vendor)}
              >
                <div className="relative group">
                  <img
                    src={vendor.image || 'default-vendor-image.jpg'}
                    alt={vendor.name}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
                  />
                </div>
                {/* Details */}
                <div className="flex flex-col justify-between flex-grow p-2 font-serif">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.category || "Vendor"}</p>
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <h5 className="text-md font-semibold truncate max-w-[65%] font-serif">
                        {vendor.name || "Vendor Name"}
                      </h5>
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                        <FaStar size={18} className="text-yellow-500" />
                        <span>
                          {isLoadingStats
                            ? '--'
                            : typeof stat.avgRating === 'number' && !isNaN(stat.avgRating)
                              ? Math.round(stat.avgRating)
                              : '--'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                      <MapPin size={14} />
                      <span className="truncate">{vendor.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-gray-600 mt-1"></div>
                  </div>
                  <div className="border-t mt-3 pt-3 text-sm text-gray-800">
                    <div className="flex items-center gap-5 text-sm text-gray-600 mb-3 border-amber-300">
                      {vendor?.pricing?.filter(item => item?.type && item?.price)?.length > 0 ? (
                        vendor.pricing
                          .filter(item => item?.type && item?.price)
                          .slice(0, 2)
                          .map((item, index) => (
                            <div key={item._id || index}>
                              <div className="text-sm text-gray-500">{item.type}</div>
                              <div className="flex items-center text-md font-bold text-gray-800">
                                ₹ {item.price.toLocaleString('en-IN')}
                                <span className="text-xs font-normal text-gray-500 ml-1">
                                  {item.unit || 'per person'}
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-sm text-gray-500">No Pricing Available</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <span className="text-gray-600   p-1 rounded"
                        onClick={() => handleVendorClick(vendor.id)}
                      >
                        {(() => {
                          let raw = vendor.services || [];
                          let vendorServices = Array.isArray(raw)
                            ? raw.length === 1 && typeof raw[0] === "string"
                              ? raw[0].split(',').map(s => s.trim())
                              : raw
                            : [];
                          return vendorServices.length > 0 ? (
                            <div className="flex flex-wrap gap-2 ">
                              {vendorServices.slice(0, 2).map((service, index) => (
                                <span
                                  key={index}
                                  className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md  "
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
          })
        )}
      </div>
    </div>
  );
};

export default SimilarVendors;

