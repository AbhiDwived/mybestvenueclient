import React from 'react';
import { useParams } from 'react-router-dom';

import sampleImage from '../../assets/VenueNoida1.jpg'; // Replace with real images

const sampleVendors = [
    {
        id: 1,
        name: 'Dream Wedding Photography',
        category: 'wedding-photographers',
        location: 'delhi',
        description: 'Capturing your special moments with creativity and passion.',
        image: sampleImage,
        price: '₹10,000 - ₹50,000',
        reviews: 124,
        rating: 4.8,
    },
    {
        id: 2,
        name: 'Golden Banquet Hall',
        category: 'banquet-halls',
        location: 'delhi',
        description: 'Perfect for grand weddings and receptions.',
        image: sampleImage,
        price: '₹50,000 - ₹2,00,000',
        reviews: 98,
        rating: 4.6,
    },
    {
        id: 3,
        name: 'Golden Banquet Hall',
        category: 'banquet-halls',
        location: 'delhi',
        description: 'Perfect for grand weddings and receptions.',
        image: sampleImage,
        price: '₹50,000 - ₹2,00,000',
        reviews: 98,
        rating: 4.6,
    },
    {
        id: 4,
        name: 'Golden Banquet Hall',
        category: 'banquet-halls',
        location: 'delhi',
        description: 'Perfect for grand weddings and receptions.',
        image: sampleImage,
        price: '₹50,000 - ₹2,00,000',
        reviews: 98,
        rating: 4.6,
    },
    {
        id: 5,
        name: 'Dream Wedding Photography',
        category: 'Hotels',
        location: 'Mumbai',
        description: 'Capturing your special moments with creativity and passion.',
        image: sampleImage,
        price: '₹10,000 - ₹50,000',
        reviews: 124,
        rating: 4.8,
    },
    // Add more sample vendors as needed
];

const VendorListPage = () => {
    const { location, category } = useParams();

    const filteredVendors = sampleVendors.filter(
        (vendor) =>
            vendor.location.toLowerCase() === location.toLowerCase() &&
            vendor.category.toLowerCase() === category.toLowerCase()
    );

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-16 py-12">
            <h1 className="text-3xl font-bold text-gray-800 capitalize mb-10">
                {category.replace(/-/g, ' ')} in {location}
            </h1>

            {filteredVendors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVendors.map((vendor) => (
                        <div
                            key={vendor.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                        >
                            <img
                                src={vendor.image}
                                alt={vendor.name}
                                className="h-48 w-full object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-1">{vendor.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{vendor.description}</p>
                                <p className="text-sm text-gray-700 font-medium mb-1">{vendor.price}</p>
                                <p className="text-sm text-yellow-500">
                                    ⭐ {vendor.rating} ({vendor.reviews} reviews)
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">No vendors found for this category in {location}.</div>
            )}
        </div>
    );
};

export default VendorListPage;
