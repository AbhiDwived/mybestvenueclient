import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import WeVendorr2 from '../../assets/newPics/WeVendor2avif.avif';
import WeVendorr4 from '../../assets/newPics/WeVendor4.avif';

const vendorData = [
  {
    id: 1,
    name: "Blossom Decor",
    category: "Wedding Decorators",
    location: "Jaipur, India",
    price: "₹20,000 - ₹70,000",
    reviews: 112,
    rating: 4.9,
    image: WeVendorr4,
    description: "Elegant and creative floral arrangements.",
  },
  {
    id: 2,
    name: "Perfect Decor",
    category: "Wedding Decorators",
    location: "Mumbai, India",
    price: "₹25,000 - ₹65,000",
    reviews: 98,
    rating: 4.7,
    image: WeVendorr2,
    description: "Transforming venues into magical wedding settings.",
  },
  {
    id: 3,
    name: "Elite Wedding Designs",
    category: "Wedding Decorators",
    location: "Delhi, India",
    price: "₹22,000 - ₹68,000",
    reviews: 105,
    rating: 4.8,
    image: WeVendorr2,
    description: "Luxury decor crafted to perfection.",
  },
  {
    id: 4,
    name: "Royal Touch Decor",
    category: "Wedding Decorators",
    location: "Hyderabad, India",
    price: "₹18,000 - ₹60,000",
    reviews: 91,
    rating: 4.6,
    image: WeVendorr2,
    description: "Stylish and budget-friendly wedding decor.",
  },
];

export default function Decorators() {
  const [selectedCategory, setSelectedCategory] = useState("Wedding Decorators");
  const [sortType, setSortType] = useState("popular");
  const [filteredVendors, setFilteredVendors] = useState([]);

  useEffect(() => {
    let sorted = [...vendorData];

    if (sortType === "popular") {
      sorted.sort((a, b) => b.reviews - a.reviews);
    } else if (sortType === "newest") {
      sorted.sort((a, b) => b.id - a.id);
    }

    setFilteredVendors(sorted);
  }, [sortType]);

  return (
    <>
    

      {/* Vendor Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <p>No vendors available for this category.</p>
        ) : (
          filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white border rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-[250px] object-cover"
                />
                <span className="absolute top-3 right-4 bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full shadow flex items-center">
                  <FaStar size={14} className='text-yellow-400 mr-1' /> {vendor.rating}
                </span>
              </div>
              <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.category}</p>
                  <h5 className="text-lg font-semibold mb-1 leading-snug">
                    {vendor.name}
                  </h5>
                  <p className="text-sm text-gray-600">{vendor.description}</p>
                  <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
                    <MapPin size={14} />
                    <span>{vendor.location}</span>
                  </div>
                </div>
                <div className="border-t pt-3 mt-auto flex justify-between items-center text-sm text-gray-800">
                  <span>{vendor.price}</span>
                  <span>{vendor.reviews} reviews</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
