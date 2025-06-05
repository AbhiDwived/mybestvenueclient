import React, { useState } from 'react';
import {
    Calendar, Users, Wallet, Pencil, Camera,
    Video, Music, Utensils, Car, Mail,
    Flower, CalendarCheck, Gift, MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

const tools = [
    {
        icon: <Calendar className="w-10 h-10" />,
        title: 'Checklist',
        description: 'Stay organized with our comprehensive wedding checklist',
        link: '/wedding-checklist',
    },
    {
        icon: <Users />,
        title: 'Guests',
        description: 'Manage your guest list, send invitations and track RSVPs',
        link: '/wedding-guests',
    },
    {
        icon: <Wallet />,
        title: 'Budget',
        description: 'Set your budget and track expenses for your event',
        link: '/wedding-budget',
    },
    {
        icon: <MapPin />,
        title: 'Wedding Vendors',
        description: 'Find and manage all your event vendors in one place',
        link: '/wedding-vendor',
    },
    {
        icon: <Pencil />,
        title: 'Wedding Website',
        description: 'Create a beautiful website for your special day',
        link: '/wedding-website',
    },
    {
        icon: <Gift />,
        title: 'Hashtag Generator',
        description: 'Create a unique hashtag for your wedding day',
        link: '/hashtag-generator',
    },
];

const vendorCategories = [
    { title: 'Photographer', path: '/vendors/photographer', icon: Camera },
    { title: 'Wedding Videography', path: '/vendors/Videography', icon: Video },
    { title: 'Wedding Music', path: '/vendors/Music', icon: Music },
    { title: 'Caterers', path: '/vendors/caterer', icon: Utensils },
    { title: 'Wedding Transportation', path: '/vendors/transportation', icon: Car },
    { title: 'Wedding Invitations', path: '/vendors/invitations', icon: Mail },
    { title: 'Wedding Gifts', path: '/vendors/wedding-gifts', icon: Gift },
    { title: 'Florists', path: '/vendors/florists', icon: Flower },
    { title: 'Wedding Planners', path: '/vendors/wedding-planners', icon: CalendarCheck },
];

export default function PlanningTools() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchQuery = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredTools = tools.filter((tool) =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredVendors = vendorCategories.filter((category) =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative">
            {/* HEADER SECTION */}
            <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-black">
                <div className="mx-auto text-center px-4 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-white">
                        Planning Tools
                    </h1>
                    <p className="mb-8 text-white text-base md:text-lg">
                        Everything you need to plan your perfect event from start to finish
                    </p>
                    <div className="bg-white text-sm rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchQuery}
                            placeholder="Search by name or location..."
                            className="flex-1 border focus:outline-none  text-gray-800 p-2 rounded-md"
                        />
                        <button
                            style={{ borderRadius: '5px' }}
                            className="bg-[#10497a] hover:bg-[#062b4b] text-white px-3 py-2"
                        >
                            Search Venue
                        </button>
                    </div>
                </div>
            </div>

            {/* TOOLS SECTION */}
            <div className="bg-gray-50 py-16 text-center">
                <div className='mx-auto px-4 text-center '>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-10">Essential Planning Tools</h1>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {filteredTools.map((tool, index) => (
                            <div key={index}>
                                <div className="bg-white rounded border p-6 hover:shadow-lg transition-all duration-200 h-full flex flex-col items-center text-center">
                                    <div className="text-2xl text-[#0F4C81] mb-4 flex justify-center items-center">
                                        {tool.icon}
                                    </div>
                                    <h5 className="text-lg font-semibold text-black mb-2">
                                        {tool.title}
                                    </h5>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {tool.description}
                                    </p>
                                    <button className="text-white bg-[#0F4C81] px-4 py-2 rounded hover:bg-[#0f4c81e4] transition-colors text-sm mt-auto ">
                                        <Link to={tool.link} className='nav-link'>Get Started</Link>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredTools.length === 0 && (
                            <p className='text-gray-600 col-span-3'>Not Found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* VENDORS SECTION */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <h4 className="text-3xl font-bold text-center mb-6 font-playfair text-corporate-dark">
                        COMPLETE YOUR WEDDING TEAM
                    </h4>
                    <p className="text-center max-w-2xl mx-auto mb-12 text-gray-600 font-montserrat">
                        Start hiring the best professionals to make your event perfect
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
                        {filteredVendors.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <Link
                                    to={category.path}
                                    key={index}
                                    style={{ textDecoration: 'none' }}
                                    className="flex items-center p-2 text-sm rounded-md bg-gray-50 hover:bg-blue-50 transition-colors "
                                >
                                    <div>
                                        <Icon className="text-black w-10 h-10 p-2 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center mr-1" />
                                    </div>
                                    <span className="font-medium text-gray-700 group-hover:text-corporate-primary">
                                        {category.title}
                                    </span>
                                </Link>
                            );
                        })}
                        {filteredVendors.length === 0 && (
                            <p className="text-center col-span-3 text-gray-600">No vendors found</p>
                        )}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            to="/wedding-vendor"
                            style={{ textDecoration: 'none' }}
                            className="inline-block bg-[#0F4C81] p-2 text-white rounded-md hover:bg-[#0e3f6c] transition-colors"
                        >
                            Browse All Vendors
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
