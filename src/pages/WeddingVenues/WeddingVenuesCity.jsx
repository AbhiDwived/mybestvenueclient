import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import VenueNoida1 from '../../assets/VenueNoida1.jpg';
import VenueNoida2 from '../../assets/VenueNoida2.jpg';
import VenueNoida3 from '../../assets/VenueNoida3.webp';
import VenueNoida4 from '../../assets/VenueNoida4.webp';
import { LuHotel } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";


export default function WeddingVenuesCity() {
    const navigate = useNavigate();
    const location = useLocation();

    const [displayVenues, setDisplayVenues] = useState(3);
    const [selectedCategory, setSelectedCategory] = useState(null); // for filtering without routing

    const venues = [
        {
            images: VenueNoida1,
            name: "Blue Dimond",
            category: "banquet-halls",
            rating: 5.0,
            reviews: 7,
            location: "Greater Noida",
            price: "From ₹1,000",
            capacity: "100 to 3000 Guests",
            promotion: "1 promotion - 5% Discount",
            route: "/blue-dimond-venue",
        },
        {
            images: VenueNoida2,
            name: "Hotel Prince Inn By",
            category: "hotels",
            rating: 2.0,
            reviews: 7,
            location: "Greater Noida",
            price: "From ₹1,200",
            capacity: "100 to 3000 Guests",
            promotion: "1 promotion - 5% Discount",
            route: "/Hotel-Prince-Inn-By",
        },
        {
            images: VenueNoida3,
            name: "Hotel Prience Stay",
            category: "hotels",
            rating: 4.0,
            reviews: 7,
            location: "Greater Noida",
            price: "From ₹1,500",
            capacity: "100 to 3000 Guests",
            promotion: "1 promotion - 5% Discount",
            route: "/Hotel-Prience-Stay",
        },
        {
            images: VenueNoida4,
            name: "Hotel Culture By Dsy",
            category: "marriage-garden",
            rating: 3.0,
            reviews: 7,
            location: "Greater Noida",
            price: "From ₹1,900",
            capacity: "100 to 3000 Guests",
            promotion: "1 promotion - 5% Discount",
            route: "/Hotel-Culture-By-Dsy",
        },
        {
            images: VenueNoida1,
            name: "Royal Palace",
            category: "banquet-halls",
            rating: 4.5,
            reviews: 12,
            location: "Greater Noida",
            price: "From ₹1,800",
            capacity: "200 to 4000 Guests",
            promotion: "Limited Time Offer",
            route: "/royal-palace",
        },
        {
            images: VenueNoida2,
            name: "Grand Imperia",
            category: "wedding-resorts",
            rating: 5,
            reviews: 20,
            location: "Greater Noida",
            price: "From ₹2,500",
            capacity: "150 to 2500 Guests",
            promotion: "Free Decoration",
            route: "/grand-imperia",
        },
        {
            images: VenueNoida3,
            name: "Elite Banquets",
            category: "banquet-halls",
            rating: 3.8,
            reviews: 9,
            location: "Greater Noida",
            price: "From ₹2,000",
            capacity: "100 to 2000 Guests",
            promotion: "10% Off",
            route: "/elite-banquets",
        },
        {
            images: VenueNoida4,
            name: "Star Wedding Hall",
            category: "wedding-lawns-farmhouses",
            rating: 4.2,
            reviews: 15,
            location: "Greater Noida",
            price: "From ₹2,200",
            capacity: "300 to 3500 Guests",
            promotion: "Flat 5% Off",
            route: "/star-wedding-hall",
        },
        {
            images: VenueNoida1,
            name: "Moonlight Garden",
            category: "wedding-lawns-farmhouses",
            rating: 4.6,
            reviews: 18,
            location: "Greater Noida",
            price: "From ₹2,800",
            capacity: "250 to 5000 Guests",
            promotion: "Special Summer Deal",
            route: "/moonlight-garden",
        },
    ];

    const venueTypes = [
        { icon: <LuHotel />, name: "Banquet Halls", venues: "124 venues", category: "banquet-halls" },
        { icon: <LuHotel />, name: "Hotels", venues: "98 venues", category: "hotels" },
        { icon: <IoLocationOutline />, name: "Marriage Garden", venues: "76 venues", category: "marriage-garden" },
        { icon: <LuHotel />, name: "Kalyana Mandapams", venues: "45 venues", category: "kalyana-mandapams" },
        { icon: <LuHotel />, name: "Wedding Resorts", venues: "67 venues", category: "wedding-resorts" },
        { icon: <IoHomeOutline />, name: "Wedding Lawns & Farmhouses", venues: "82 venues", category: "wedding-lawns-farmhouses" },
    ];

    useEffect(() => {
        if (location.pathname === "/Wedding_Venues_city") {
            setDisplayVenues(venues.length);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setDisplayVenues(3);
        }
    }, [location.pathname, venues.length]);

    const handleShowAll = () => {
        navigate('/Wedding_Venues_city');
    };

    const filteredVenues = selectedCategory
        ? venues.filter((venue) => venue.category === selectedCategory)
        : venues;

    return (
        <div>
            <div className="py-8 bg-gray-50">
                <div className="px-4 sm:px-6 lg:px-1 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-8 font-playfair font-bold text-[#1A2A3A]">
                        Browse by Venue Type
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-13">
                        {venueTypes.map((type, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedCategory(type.category)}
                                className={`bg-white shadow-md rounded-lg py-4 px-2 sm:px-4 cursor-pointer hover:shadow-xl transition-shadow ${selectedCategory === type.category ? 'border-2 border-black' : ''
                                    }`}
                            >
                                <div className="mb-3 text-black bg-gray-200 mx-auto p-3 rounded-full w-12 h-12 flex items-center justify-center text-lg sm:text-xl">
                                    {type.icon}
                                </div>
                                <h6 className="font-semibold mb-1 text-sm sm:text-base text-black">{type.name}</h6>
                                <p className="text-gray-600 text-xs sm:text-sm">{type.venues}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 px-4 sm:px-6 lg:px-12">
                <h3 className="text-[#09365d] text-xl sm:text-2xl font-bold mb-4">
                    Venues In Noida {selectedCategory ? `- ${selectedCategory.replace(/-/g, ' ')}` : ''}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVenues.slice(0, displayVenues).map((venue, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(venue.route)}
                            className="relative bg-white cursor-pointer rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                        >
                            <div className="absolute top-3 left-3 bg-[#09365d] text-white text-xs p-1 px-3 rounded-xl z-10 capitalize">
                                {venue.category.replace(/-/g, ' ')}
                            </div>
                            <img
                                src={venue.images}
                                alt={venue.name}
                                className="w-full h-[200px] sm:h-[230px] md:h-[250px] object-cover"
                            />
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-base sm:text-lg font-semibold text-black">{venue.name}</h5>
                                    <div className="bg-[#09365d] text-white px-3 py-1 text-sm rounded-full">
                                        {venue.rating}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
                                    <IoLocationOutline className="text-lg" />
                                    <span>{venue.location}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                                    <LuHotel className="text-lg" />
                                    <span>{venue.capacity}</span>
                                </div>
                                <div className="border-t mt-3 pt-3 flex justify-between text-sm font-medium text-gray-800">
                                    <span>{venue.price}</span>
                                    <span className="text-gray-500">{venue.reviews} reviews</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}
