import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import WeVendorr2 from '../../assets/newPics/WeVendor2avif.avif'; // Update with actual path

import { useGetAllVendorsQuery } from '../../features/admin/adminAPI';



export default function Gift() {
  const [sortType, setSortType] = useState('popular');
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const { data, isLoading, isError, error } = useGetAllVendorsQuery();

  //  console.log("vendorsList", data);
  const gift = data?.vendors?.filter(v => v.vendorType === "Gifts");
  console.log("gift", gift);

  useEffect(() => {
    if (!gift) return;

    let sorted = [...gift];

    if (sortType === "popular") {
      sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else if (sortType === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredVendors(sorted);
  }, [sortType, gift]);


  if (isLoading) {
    return <div className="text-center py-10">Loading vendors...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Error: {error?.data?.message || 'Failed to fetch vendors.'}
      </div>
    );
  }
  return (
    <>


      {/* Vendor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors?.length === 0 ? (
          <p className="text-center col-span-full">No vendors available for this category.</p>
        ) : (
          filteredVendors?.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white border rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={vendor.profilePicture || WeVendorr2}
                  alt={vendor.businessName}
                  className="w-full h-[250px] object-cover"
                />
                <span className="absolute top-3 right-4 bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full shadow flex items-center">
                  <FaStar size={14} className='text-yellow-400 mr-1' />
                  {vendor.rating || "4.5"}
                </span>
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.vendorType}</p>
                  <h5 className="text-lg font-semibold mb-1 leading-snug">
                    {vendor.businessName}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {vendor.aboutBusiness || "No description available."}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
                    <MapPin size={14} />

                    {vendor.serviceAreas?.join(", ") || "Service areas not available"}
                  </div>
                </div>

                {/* Footer Section */}
                <div className="border-t pt-3 mt-auto flex justify-between items-center text-sm text-gray-800">
                  <span>{vendor.priceRange || "Price on request"}</span>
                  <span>{vendor.reviews || 0} reviews</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
