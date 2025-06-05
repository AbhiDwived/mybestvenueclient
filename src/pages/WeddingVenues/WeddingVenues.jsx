import React, { useState } from "react";
import BrowseVenues from "./BrowserVenues"; // corrected the filename (your previous was BrowserVenues, check your actual file)
import WeddingVenuesCity from "./WeddingVenuesCity";

export default function WeddingVenues() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All India");

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
              Discover beautiful venues for weddings, corporate events, and special
              occasions
            </p>
            <div className="bg-white text-sm rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                style={{ borderRadius: "5px" }}
                className="bg-[#10497a] hover:bg-[#062b4b] text-white px-3 py-2"
              // You can add an onClick here if needed
              >
                Search Venue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Browse Venues Section */}
      <div>
        <BrowseVenues
          currentLocation={selectedCity}
          onLocationSelect={(city) => setSelectedCity(city)}
          searchTerm={searchTerm} // pass searchTerm if BrowseVenues supports it
        />
        {/* <LocationVendors selectedCity={selectedCity} /> */}
      </div>

      {/* City Venues Section */}
      <div>
        <WeddingVenuesCity searchTerm={searchTerm} />
      </div>
    </div>
  );
}
