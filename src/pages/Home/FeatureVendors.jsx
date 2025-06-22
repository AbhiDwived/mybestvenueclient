import { useEffect, useState } from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllVendorsQuery } from "../../features/admin/adminAPI";

const FeaturedVendors = ({ showAll = false }) => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const { data: vendorsData, isLoading, error } = useGetAllVendorsQuery();

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleVendorClick = (vendor) => {
    navigate('/preview-profile');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) {
    return <div className="text-center py-10">Loading vendors...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading vendors: {error.message}</div>;
  }

  // Format vendors data according to our display needs
  const formattedVendors = vendorsData?.vendors?.map(vendor => ({
    id: vendor._id,
    image: vendor.profilePicture || vendor.galleryImages?.[0]?.url,
    category: vendor.vendorType,
    name: vendor.businessName,
    location: vendor.serviceAreas?.length > 0 
      ? vendor.serviceAreas[0]
      : vendor.address?.city && vendor.address?.state
        ? `${vendor.address.city}, ${vendor.address.state}`
        : vendor.address?.city || vendor.address?.state || 'Location not specified',
    rating: 4.5, // This should come from reviews when implemented
    reviews: 0, // This should come from reviews when implemented
    price: vendor.pricingRange && vendor.pricingRange.min && vendor.pricingRange.max
      ? `₹${vendor.pricingRange.min.toLocaleString()} - ₹${vendor.pricingRange.max.toLocaleString()}`
      : 'Price on request'
  })) || [];

  const displayedVendors = showAll ? formattedVendors : formattedVendors.slice(0, 4);

  return (
    <div className="lg:mx-16 px-4 md:px-10 xl:px-20 py-10">
      <div className="flex flex- justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-semibold text-gray-800 font-serif">Featured Vendors</h3>
        {!showAll && (
          <Link style={{ textDecoration: 'none' }} to="/featurevendors" className="flex text-[#052038] hover:underline">
            <p className="text-[#052038] hover:text-black">View All</p>
            <IoIosArrowForward className="ml-1 mt-1 text-[#052038]" />
          </Link>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
            onClick={() => handleVendorClick(vendor)}
          >
            <div className="relative group">
              <img
                src={vendor.image || 'default-vendor-image.jpg'} // Add a default image path
                alt={vendor.name}
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <button
                onClick={(e) => toggleFavorite(e, vendor.id)}
                className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-gray-800"
              >
                {favorites.includes(vendor.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1 font-playfair-display">{vendor.category}</p>
              <h5 className="text-lg font-semibold text-gray-900 font-serif">
                {vendor.name}
              </h5>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MdLocationOn className="mr-1" />
                {vendor.location}
              </div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <span className="text-gray-900 font-bold font-playfair-display">
                    {vendor.rating}
                  </span>
                  <span className="text-gray-500">({vendor.reviews} reviews)</span>
                </div>
                <div className="text-black font-bold text-right">{vendor.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedVendors;
