import {
  FaBirthdayCake,
  FaMagic,
  FaPaintBrush,
  FaClipboardList,
  FaRegBuilding
} from 'react-icons/fa';
import { FiCamera } from "react-icons/fi";

const categories = [
  { title: 'Photographer', count: 156, icon: <FiCamera size={30} /> },
  { title: 'Venue', count: 98, icon: <FaRegBuilding size={24} /> },
  { title: 'Caterer', count: 72, icon: <FaBirthdayCake size={24} /> },
  { title: 'Decorator', count: 64, icon: <FaMagic size={24} /> },
  { title: 'Makeup Artist', count: 87, icon: <FaPaintBrush size={24} /> },
  { title: 'Wedding Planner', count: 45, icon: <FaClipboardList size={24} /> },
];

const VendorByCategory = () => {
  return (
    <div className="bg-[#F9FAFB] py-20 px-15">
      <div className=" sm:px-6 ">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif mb-2">
            Find Vendors by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Discover the best wedding and corporate event vendors for every aspect of your special day.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center text-gray-800">
                {category.icon}
              </div>

              {/* Text */}
              <h5 className="mt-4  text-base sm:text-sm font-semibold text-gray-900 font-serif group-hover:text-pink-600 transition-colors">
                {category.title}
              </h5>
              <p className="text-sm text-gray-500">{category.count} Vendors</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorByCategory;