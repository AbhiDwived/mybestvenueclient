import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import WeVendorr3 from '../../assets/newPics/WeVendor3.avif';

const vendorData = [
  {
    id: 1,
    name: "Delicious Catering",
    category: "Caterers",
    location: "Hyderabad, India",
    price: "₹500 - ₹1,500 per plate",
    reviews: 156,
    rating: 4.6,
    image: WeVendorr3,
    description: "Exquisite cuisine for your wedding celebration.",
  },
  {
    id: 2,
    name: "Spice Garden Catering",
    category: "Caterers",
    location: "Delhi, India",
    price: "₹400 - ₹1,200 per plate",
    reviews: 178,
    rating: 4.6,
    image: WeVendorr3,
    description: "Authentic Indian flavours for your special day.",
  },
  {
    id: 3,
    name: "Golden Plate Catering",
    category: "Caterers",
    location: "Mumbai, India",
    price: "₹600 - ₹1,800 per plate",
    reviews: 132,
    rating: 4.5,
    image: WeVendorr3,
    description: "Delicious menus tailored to your event.",
  },
  {
    id: 4,
    name: "Taste Buds Catering",
    category: "Caterers",
    location: "Bangalore, India",
    price: "₹550 - ₹1,600 per plate",
    reviews: 145,
    rating: 4.6,
    image: WeVendorr3,
    description: "Flavours that linger long after the event.",
  },
];

export default function Caterers() {
  const [selectedCategory, setSelectedCategory] = useState("Caterers");
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
