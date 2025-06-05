import { useState } from 'react';
import DiscoverImage from "../../assets/newPics/discoverImage.jpg";
import BrowseVenues from '../WeddingVenues/BrowserVenues';
import LocationVendors from '../Location/LocationVendor'; // Make sure this is correct

const DiscoverCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('All India');

  const handleSearch = (e) => {
    e.preventDefault();
    // Add logic if you want to filter LocationVendors by category or search term
  };

  return (
    <>
      <div
        className="relative w-full h-[700px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 76, 129, 0.7), rgba(26, 42, 58, 0.8)), url(${DiscoverImage})`,
        }}
      >
        <div className="mx-auto px-4 text-center">
          <h1 className="font-extrabold text-white text-4xl md:text-5xl mb-6">
            Discover Your Perfect Venue
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mt-4 mx-auto">
            Connect with trusted professionals for weddings, corporate events, and special occasions.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-5 max-w-3xl bg-white rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden p-2"
          >
            <div className="flex flex-1 items-center px-4 py-2">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search venues or vendors..."
                className="w-full outline-none text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:border-l border-gray-200 px-4 py-2">
              <select
                className="w-full outline-none text-gray-700 bg-transparent"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="venues">Venues</option>
                <option value="photographer">Photographers</option>
                <option value="caterer">Caterers</option>
                <option value="decorator">Decorators</option>
                <option value="makeup-artist">Makeup Artists</option>
                <option value="wedding-planner">Wedding Planners</option>
              </select>
            </div>

            <button
              type="submit"
              style={{ borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
              className="px-4 py-1 bg-[#0f4c81] text-white font-semibold"
            >
              Search
            </button>
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <button
            style={{borderRadius:'5px'}}
              onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
              className="px-3 py-2 bg-white/10 text-white border border-white rounded-md backdrop-blur-sm hover:text-black hover:bg-white/20 transition-colors"
            >
              Browse Venues
            </button>
            <a
              href="/planning-tools"
              style={{textDecoration:'none'}}
              className="px-3 py-2 bg-[#445D7B] text-white rounded-md"
            >
              Planning Tools
            </a>
          </div>
        </div>
      </div>

      {/* Section to display location tabs and vendor UI */}
      <div>
        {/* Other parts of your component */}
        <BrowseVenues
          currentLocation={selectedCity}
          onLocationSelect={setSelectedCity} // directly passing setter
        />

      </div>
    </>
  );
};

export default DiscoverCategories;
