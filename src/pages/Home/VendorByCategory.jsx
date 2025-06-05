import React from 'react';
import {
  FaBirthdayCake,
  FaMagic,
  FaPaintBrush,
  FaClipboardList,
  FaRegBuilding,
} from 'react-icons/fa';
import { FiCamera } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Helper function to get icon by category title
const getCategoryIcon = (title) => {
  switch (title) {
    case 'Wedding Photographers':
      return <FiCamera size={30} />;
    case 'Venue':
      return <FaRegBuilding size={24} />;
    case 'Caterers':
      return <FaBirthdayCake size={24} />;
    case 'Wedding Decorators':
      return <FaMagic size={24} />;
    case 'Wedding MakeUp':
      return <FaPaintBrush size={24} />;
    case 'Wedding Planners':
      return <FaClipboardList size={24} />;
    default:
      return null;
  }
};

const VendorByCategory = ({ location = "All India" }) => {
  const navigate = useNavigate();

  // Vendor counts per location
  const vendorData = {
    "All India": {
      "Wedding Photographers": 156,
      "Venue": 98,
      "Caterers": 72,
      "Wedding Decorators": 64,
      "Wedding MakeUp": 87,
      "Wedding Planners": 45,
    },
    Delhi: {
      "Wedding Photographers": 40,
      "Venue": 20,
      "Caterers": 15,
      "Wedding Decorators": 10,
      "Wedding MakeUp": 18,
      "Wedding Planners": 8,
    },
    Mumbai: {
      "Wedding Photographers": 35,
      "Venue": 25,
      "Caterers": 12,
      "Wedding Decorators": 15,
      "Wedding MakeUp": 22,
      "Wedding Planners": 10,
    },
    // Add more cities as needed
  };

  // Use city data or fallback to "All India"
  const activeLocationData = vendorData[location] || vendorData["All India"];

  // Create array of category objects with icon and count
  const categories = Object.entries(activeLocationData).map(([title, count]) => ({
    title,
    count,
    icon: getCategoryIcon(title),
  }));

  // On category click, navigate with state carrying category & location
  const handleCategoryClick = (title) => {
    navigate('/wedding-vendor', {
      state: { category: title, location },
    });
  };

  return (
    <div className="bg-[#F9FAFB] py-16 px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="w-full mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-3">
            Find Vendors in {location}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Discover the best wedding and corporate event vendors in {location}.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:mx-16">
          {categories.map(({ title, count, icon }, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(title)}
              style={{ borderRadius: '10px' }}
              className="bg-white border border-gray-200  shadow-sm px-3 py-4 sm:px-4 sm:py-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group w-full"
              type="button"
            >
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-gray-800">
                {icon}
              </div>
              <h6 className="mt-2 sm:mt-3 text-sm sm:text-base font-semibold text-black font-serif group-hover:text-pink-600 transition-colors">
                {title}
              </h6>
              <p className="text-xs sm:text-sm text-gray-500">{count} Vendors</p>
            </button>
          ))}
        </div>
      </div>
    </div>

  );
};

export default VendorByCategory;
