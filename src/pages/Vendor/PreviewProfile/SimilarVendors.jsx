import { IoLocationOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import mainProfile from "../../../assets/mainProfile.png";
import { useGetSimilarVendorsQuery } from '../../../features/vendors/vendorAPI';
import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from 'lucide-react';
import { useState } from "react";

const SimilarVendors = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, isError } = useGetSimilarVendorsQuery(vendorId);
  const vendors = data?.similarVendors || [];

  const displayedVendors = showAll ? vendors : vendors.slice(0, 3);

  const handleVendorClick = (vendorId) => {
    navigate(`/preview-profile/${vendorId}`);
  };

  if (isLoading) return <p className="text-center">Loading similar vendors...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load similar vendors.</p>;

  return (
    <>
      <div className="flex justify-between items-center mx-5 mt-5">
        <h2 className="text-2xl font-semibold text-gray-600">Similar Vendors</h2>
        {vendors.length > 3 && (
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="text-gray-600 font-medium text-sm  border border-gray-500 bg-[#DEBF78] rounded p-1"
          >
            {showAll ? "View Less" : "View All"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-5 mt-2">
        {displayedVendors.length === 0 ? (
          <p className="text-center col-span-full">No vendors available for this category.</p>
        ) : (
          displayedVendors.map((vendor) => (
            <div
              key={vendor._id}
              onClick={() => handleVendorClick(vendor._id)}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="relative">
                <img
                  src={vendor.profilePicture || mainProfile}
                  alt={vendor.businessName || vendor.name}
                  className="w-full h-[220px] object-cover"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow p-2">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.vendorType || "Vendor"}</p>
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <h5 className="text-md font-semibold truncate max-w-[65%]">
                      {vendor.businessName || vendor.name || "Vendor Name"}
                    </h5>
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                      <FaStar size={18} className="text-yellow-500" />
                      <span>{vendor.rating || "5.0"}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                    <MapPin size={14} />
                    <span className="truncate">
                      {vendor.serviceAreas?.join(", ") || "Location not specified"}
                    </span>
                  </div>
                </div>

                <div className="border-t mt-3 pt-3 text-sm text-gray-800">
                  <div className="flex items-center gap-5 text-sm text-gray-600 mb-3">
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
                    <span className="text-gray-600 hover:underline p-1 rounded">
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
                              <span className="text-sm text-gray-600">
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
          ))
        )}
      </div>


    </>
  );
};

export default SimilarVendors;

