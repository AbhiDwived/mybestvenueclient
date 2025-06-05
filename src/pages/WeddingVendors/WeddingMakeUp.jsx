import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import WeVendorr2 from '../../assets/newPics/WeVendor2avif.avif';

const vendorData = [
    {
        id: 1,
        name: "Glamour Bridal MakeUp",
        category: "Wedding MakeUp",
        location: "Mumbai, India",
        price: "₹15,000 - ₹40,000",
        reviews: 78,
        rating: 4.7,
        image: WeVendorr2,
        description: "Bringing out your natural beauty on your special day.",
    },
    {
        id: 2,
        name: "Elegant Touch MakeUp",
        category: "Wedding MakeUp",
        location: "Delhi, India",
        price: "₹12,000 - ₹35,000",
        reviews: 84,
        rating: 4.8,
        image: WeVendorr2,
        description: "Flawless bridal looks with professional touch.",
    },
    {
        id: 3,
        name: "Royal Glow Artists",
        category: "Wedding MakeUp",
        location: "Bangalore, India",
        price: "₹14,000 - ₹38,000",
        reviews: 90,
        rating: 4.9,
        image: WeVendorr2,
        description: "Creating timeless bridal makeup masterpieces.",
    },
    {
        id: 4,
        name: "Blissful Beauty",
        category: "Wedding MakeUp",
        location: "Hyderabad, India",
        price: "₹10,000 - ₹30,000",
        reviews: 72,
        rating: 4.6,
        image: WeVendorr2,
        description: "Personalized makeup to highlight your best features.",
    },
];

export default function WeddingMakeUp() {
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
                {vendors.map(vendor => (
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
