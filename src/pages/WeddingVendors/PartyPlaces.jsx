import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import WeVendorr2 from '../../assets/newPics/WeVendor2avif.avif';

const vendorData = [
  {
    id: 1,
    name: "The Grand Venue",
    category: "Party Places",
    location: "Delhi, India",
    price: "₹60,000 - ₹1,50,000",
    reviews: 102,
    rating: 4.8,
    image: WeVendorr2,
    description: "A luxurious space for your special celebrations.",
  },
  {
    id: 2,
    name: "Bliss Banquets",
    category: "Party Places",
    location: "Mumbai, India",
    price: "₹55,000 - ₹1,30,000",
    reviews: 89,
    rating: 4.7,
    image: WeVendorr2,
    description: "Perfect party venue with top-class amenities.",
  },
  {
    id: 3,
    name: "Celebration Halls",
    category: "Party Places",
    location: "Hyderabad, India",
    price: "₹50,000 - ₹1,20,000",
    reviews: 93,
    rating: 4.6,
    image: WeVendorr2,
    description: "Spacious halls with beautiful decor options.",
  },
  {
    id: 4,
    name: "Elite Garden Venue",
    category: "Party Places",
    location: "Chennai, India",
    price: "₹45,000 - ₹1,10,000",
    reviews: 79,
    rating: 4.5,
    image: WeVendorr2,
    description: "Outdoor celebrations surrounded by nature.",
  },
];

export default function PartyPlaces() {
  const [selectedCategory, setSelectedCategory] = useState("Party Places");
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
      {/* Top Buttons */}
      
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
