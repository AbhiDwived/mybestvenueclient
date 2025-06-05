import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import WeVendorr1 from '../../assets/newPics/WeVendorr1.avif';
import WeVendorr2 from '../../assets/newPics/WeVendor3.avif';

const vendorData = [
    {
        id: 13,
        name: "Dream Wedding Photography",
        category: "Wedding Photographers",
        location: "Delhi, India",
        price: "₹10,000 - ₹50,000",
        reviews: 124,
        rating: 4.8,
        image: WeVendorr1,
        description: "Capturing your special moments with creativity and passion.",
    },
    {
        id: 14,
        name: "Perfect Moments Studio",
        category: "Wedding Photographers",
        location: "Mumbai, India",
        price: "₹12,000 - ₹45,000",
        reviews: 85,
        rating: 4.7,
        image: WeVendorr2,
        description: "Beautiful candid shots with expert editing.",
    },
    {
        id: 15,
        name: "Eternal Memories Photography",
        category: "Wedding Photographers",
        location: "Bangalore, India",
        price: "₹15,000 - ₹50,000",
        reviews: 99,
        rating: 4.8,
        image: WeVendorr2,
        description: "Creating timeless treasures from your big day.",
    },
    {
        id: 16,
        name: "Royal Wedding Clicks",
        category: "Wedding Photographers",
        location: "Kolkata, India",
        price: "₹13,000 - ₹47,000",
        reviews: 87,
        rating: 4.7,
        image: WeVendorr2,
        description: "Premium wedding photography with elegance.",
    },
];

export default function Photographers() {
    const [selectedCategory, setSelectedCategory] = useState("Wedding Photographers");
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
