import React from 'react';
import {
    Calendar, Users, Wallet, Pencil, Camera,
    Video,
    Music,
    Utensils,
    Car,
    Mail,
    Flower,
    CalendarCheck,
    Gift,
    MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
const tools = [
    {
        icon: <Calendar className="w-10 h-10 " />,
        title: 'Checklist',
        description: 'Stay organized with our comprehensive wedding checklist',
        link: '/checklist',
    },
    {
        icon: <Users />,
        title: 'Guests',
        description: 'Manage your guest list, send invitations and track RSVPs',
        link: '/guests',
    },
    {
        icon: <Wallet />,
        title: 'Budget',
        description: 'Set your budget and track expenses for your event',
        link: '/budget',
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
        link: '/hashtag-generate',
    },
];

// Vendor categories array
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
    return (
        <main className="relative">
            {/* HEADER SECTION */}
            <section className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-black">
                <div className="mx-auto text-center px-4 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-white">
                        Planning Tools
                    </h1>
                    <p className="mb-8 text-white text-base md:text-lg">
                        Everything you need to plan your perfect event from start to finish
                    </p>
                    <div className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            className="flex-1 border-none focus:outline-none text-gray-800 px-3 py-2 rounded"
                        />
                        <button
                            style={{ borderRadius: '5px' }}
                            className="bg-[#09365d] hover:bg-[#062945] text-white px-4 py-2"
                        >
                            Search Venue
                        </button>
                    </div>
                </div>
            </section>

            {/* TOOLS SECTION */}
            <section className="bg-gray-50 py-16 text-center">
                <div className='mx-auto px-4 text-center '>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-10">Essential Planning Tools</h1>
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {tools.map((tool, index) => (
                            <Link
                                to={tool.link}
                                key={index}
                                style={{ textDecoration: 'none' }}
                                className="border-none focus:outline-none"
                            >
                                <div className="bg-white rounded shadow p-6 hover:shadow-lg transition-all duration-200 h-full flex flex-col items-center text-center">
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
                                        Get Started
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h4 className="text-3xl font-bold text-center mb-6 font-playfair text-corporate-dark">
                        COMPLETE YOUR WEDDING TEAM
                    </h4>
                    <p className="text-center max-w-2xl mx-auto mb-12 text-gray-600 font-montserrat">
                        Start hiring the best professionals to make your event perfect
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
                        {vendorCategories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <Link
                                    to={category.path}
                                    key={index}
                                    style={{ textDecoration: 'none' }}
                                    className="flex items-center p-3 rounded-md  hover:bg-blue-50  transition-colors "
                                >
                                    <div>
                                        <Icon className="text-black w-10 h-10 p-2 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center mr-3" size={20} />
                                    </div>
                                    <span className="font-medium text-gray-700 group-hover:text-corporate-primary">
                                        {category.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="text-center mt-10">
                        <Link
                            to="/WeedingVendor"
                            style={{ textDecoration: 'none' }}
                            className="inline-block bg-[#0F4C81] px-6 py-3 text-white rounded-md hover:bg-[#0e3f6c] transition-colors"
                        >
                            Browse All Vendors
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}
