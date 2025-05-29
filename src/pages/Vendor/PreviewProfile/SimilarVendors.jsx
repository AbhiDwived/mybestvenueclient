import { IoLocationOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import previewProfile01 from "../../../assets/PreviewProfile.png";

// Sample data (you can map through an array if needed)
const vendors = [
  {
    id: 1,
    name: "Creative Moments Photography",
    role: "Photographer",
    location: "Delhi, India",
    rating: 4.7,
    reviews: 86,
    priceRange: "₹15,000 - ₹45,000",
    image: previewProfile01, // replace with actual image path
  },
  {
    id: 2,
    name: "Eternal Frames Studio",
    role: "Photographer",
    location: "Gurgaon, India",
    rating: 4.9,
    reviews: 142,
    priceRange: "₹20,000 - ₹60,000",
    image: previewProfile01,
  },
  {
    id: 3,
    name: "Memories by Raj",
    role: "Photographer",
    location: "Noida, India",
    rating: 4.6,
    reviews: 68,
    priceRange: "₹12,000 - ₹40,000",
    image: previewProfile01,
  },
];

const SimilarVendors = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 py-8 font-serif">
      <h2 className="text-2xl font-bold mb-6">Similar Vendors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={vendor.image} alt={vendor.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <p className="text-sm text-gray-600">{vendor.role}</p>
              <h3 className="text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis">{vendor.name}</h3>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <IoLocationOutline className="mr-1" />
                <span>{vendor.location}</span>
              </div>
              <div className="flex items-center text-sm mt-2">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-medium text-black">{vendor.rating}</span>
                <span className="text-gray-500 ml-1">({vendor.reviews} reviews)</span>
              </div>
              <div className="text-right mt-2 font-semibold text-black">{vendor.priceRange}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarVendors;
