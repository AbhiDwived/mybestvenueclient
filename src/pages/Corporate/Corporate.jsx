import React, { useState } from 'react';
import { Briefcase, Users, CalendarDays, LayoutGrid } from "lucide-react";

import Corporate1 from '../../assets/newPics/Corporate1.avif';
import Corporate2 from '../../assets/newPics/Corporate2.avif';
import Corporate3 from '../../assets/newPics/Corporate3.avif';
import CoConference from '../../assets/newPics/CoConference.avif';
import Coconference2 from '../../assets/newPics/Coconference2.avif';
import CoTeam1 from '../../assets/newPics/CoTeam1.avif';
import CoTeam2 from '../../assets/newPics/CoTeam2.avif';
import CoTeam3 from '../../assets/newPics/CoTeam3.avif';
import CoEvent from '../../assets/newPics/CoEvent.avif';
import CoEvent2 from '../../assets/newPics/CoEvent2.avif';
import CoEvent3 from '../../assets/newPics/CoEvent3.avif';

const tabs = [
    { key: "meeting", label: "Meeting Venues", icon: LayoutGrid },
    { key: "conference", label: "Conferences", icon: Users },
    { key: "team", label: "Team Building", icon: Briefcase },
    { key: "events", label: "Corporate Events", icon: CalendarDays },
];

const services = {
    meeting: [
        {
            title: "Conference Rooms",
            description:
                "Professional meeting spaces equipped with the latest technology for presentations and discussions.",
            image: Corporate1,
        },
        {
            title: "Executive Boardrooms",
            description:
                "Elegant and private spaces for important board meetings and executive discussions.",
            image: Corporate2,
        },
        {
            title: "Training Facilities",
            description:
                "Spacious rooms designed for workshops, training sessions, and collaborative learning.",
            image: Corporate3,
        },
    ],
    conference: [
        {
            title: "Large Auditoriums",
            description:
                "Host large-scale conferences with state-of-the-art sound and projection systems.",
            image: CoConference,
        },
        {
            title: "Breakout Rooms",
            description: "Smaller rooms for side sessions and discussions during your conference.",
            image: Coconference2,
        },
        {
            title: "Panel Discussions",
            description: "Engage audiences with insightful panels in well-equipped spaces.",
            image: CoConference,
        },
    ],
    team: [
        {
            title: "Outdoor Retreats",
            description: "Bond with your team through activities in scenic outdoor locations.",
            image: CoTeam1,
        },
        {
            title: "Indoor Workshops",
            description: "Structured team-building exercises with professional facilitators.",
            image: CoTeam2,
        },
        {
            title: "Leadership Activities",
            description: "Programs focused on building leadership and communication skills.",
            image: CoTeam3,
        },
    ],
    events: [
        {
            title: "Award Nights",
            description: "Celebrate milestones and achievements with elegant award ceremonies.",
            image: CoEvent,
        },
        {
            title: "Product Launches",
            description: "Showcase new products with impressive setups and media coverage.",
            image: CoEvent2,
        },
        {
            title: "Networking Events",
            description: "Foster connections in a relaxed and professional environment.",
            image: CoEvent3,
        },
    ],
};

export default function Corporate() {
    const [selectedTab, setSelectedTab] = useState("meeting");

    return (
        <main className="relative">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-white">
                <div className="max-w-3xl mx-auto text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-[#1A2A3A]">
                        Corporate Meeting & Event Solutions
                    </h1>
                    <p className="mb-8 text-white">
                        Professional venues and services for your business gatherings, conferences, and corporate events
                    </p>
                    <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2">
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            className="flex-1 border-none focus-visible:ring-0 text-gray-800"
                        />
                        <button className="bg-[#09365d] hover:bg-[#072c4b] text-white p-2 rounded">
                            Search Venue
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-[#e9eff5] min-h-screen px-6 py-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Corporate Services</h2>
                    <p className="text-gray-600 mt-2">
                        Comprehensive solutions for all your business meeting and event needs
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center flex-wrap gap-4 mb-10 bg-gray-300 max-w-5xl mx-auto  rounded-md">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedTab(tab.key)}
                            className={`flex items-center justify-center gap-2 p-2 w-44 text-center rounded-md transition${selectedTab === tab.key
                                ? "bg-white text-black border-blue-600"
                                : "bg-gray-300 text-gray-700 border-gray-300"
                                }`}
                        >
                            <tab.icon size={16} />
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Service Cards */}
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {services[selectedTab].map((item, index) => (
                        <div key={index} className="bg-white rounded-md shadow-md overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h5 className="font-semibold text-lg mb-2 text-gray-800">{item.title}</h5>
                                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                                <button className="bg-[#0F4C81] text-white px-4 py-2 rounded w-full hover:bg-blue-900">
                                    View Options
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CONTACT */}
            <section className="bg-[#0F4C81] py-16 text-white">
                <div className="max-w-3xl mx-auto text-center px-4">
                    <h4 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-[#1A2A3A]">
                        Ready to Plan Your Corporate Event?
                    </h4>
                    <p className="mb-8 text-white text-center">
                        Our team of experienced event planners is ready to help you create <br/> the perfect corporate experience
                    </p>

                    {/* Centered button */}
                    <div className="flex justify-center">
                        <div className="bg-white text-black rounded-lg px-6 py-2">
                            <button className="font-semibold">Contact Us</button>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
