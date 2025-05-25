import React from "react";
import { Link } from "react-router-dom";
import WeddingVenuesCity from "./WeddingVenuesCity";
import BrowseVenues from "./BrowserVenues";

export default function WeddingVenues() {
  return (
    <div className="relative">

      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-playfair text-[#1A2A3A]">
              Find Your Perfect Venue
            </h1>
            <p className="mb-8 text-sm sm:text-base md:text-lg text-white">
              Discover beautiful venues for weddings, corporate events, and special occasions
            </p>
            <div className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 border-none focus-visible:ring-0 text-gray-800 p-2 rounded-md"
              />
              <button
                style={{ borderRadius: '5px' }}
                className="bg-[#09365d] hover:bg-[#062b4b] text-white p-2"
              >
                Search Venue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Browse Venues Section */}
      <div >
        <BrowseVenues />
      </div>

      {/* City Venues Section */}
      <div>
        <WeddingVenuesCity />
      </div>
    </div>
  );
}
