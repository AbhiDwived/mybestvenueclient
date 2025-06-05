import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import WeVendorr2 from '../../assets/newPics/WeVendor2avif.avif'; // Update with actual path

const vendorData = [
  {
    id: 1,
    name: "Beat Masters DJ",
    category: "DJ",
    location: "Mumbai, India",
    price: "₹15,000 - ₹50,000",
    reviews: 95,
    rating: 4.7,
    image: WeVendorr2,
    description: "Spinning the best tracks for your big day.",
  },
  {
    id: 2,
    name: "Soundwave DJs",
    category: "DJ",
    location: "Delhi, India",
    price: "₹18,000 - ₹55,000",
    reviews: 82,
    rating: 4.6,
    image: WeVendorr2,
    description: "High energy DJ performances with great vibes.",
  },
  {
    id: 3,
    name: "Groove Factory",
    category: "DJ",
    location: "Bangalore, India",
    price: "₹12,000 - ₹45,000",
    reviews: 75,
    rating: 4.5,
    image: WeVendorr2,
    description: "Mixing beats that keep the party alive.",
  },
  {
    id: 4,
    name: "Rhythm Riders",
    category: "DJ",
    location: "Hyderabad, India",
    price: "₹16,000 - ₹52,000",
    reviews: 88,
    rating: 4.8,
    image: WeVendorr2,
    description: "Expert DJs with a passion for music.",
  },
];

export default function DJ() {
  const [sortType, setSortType] = useState('popular');
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    let sorted = [...vendorData];
    if (sortType === 'popular') {
      sorted.sort((a, b) => b.reviews - a.reviews);
    } else if (sortType === 'newest') {
      sorted.sort((a, b) => b.id - a.id);
    }
    setVendors(sorted);
  }, [sortType]);

  return (
    <>
     

      {/* Vendor Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
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
                <FaStar size={14} className="text-yellow-400 mr-1" /> {vendor.rating}
              </span>
            </div>
            <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.category}</p>
                <h5 className="text-lg font-semibold mb-1 leading-snug">{vendor.name}</h5>
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
        ))}
      </div>
    </>
  );
}
