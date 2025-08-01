import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DiscoverImage from "../../assets/newPics/discoverImage.jpg";
import BrowseVenues from '../WeddingVenues/BrowserVenues';
import { useGetAllPublicVendorsQuery } from '../../features/vendors/vendorAPI';
import Loader from '../../components/{Shared}/Loader';

const DiscoverCategories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('All India');

  // Fetch all vendors to get categories
  const { data: vendorData, isLoading } = useGetAllPublicVendorsQuery();

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Build the search query parameters
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (category) params.set('category', category);
    if (selectedCity !== 'All India') params.set('city', selectedCity);

    // Navigate to search results page with query parameters
    navigate(`/search?${params.toString()}`);
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="w-full">
      <div
        className="w-full h-[700px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 76, 129, 0.7), rgba(26, 42, 58, 0.8)), url(${DiscoverImage})`,
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-extrabold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
            Discover Your Perfect Venue
          </h1>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Connect with trusted professionals for weddings, corporate events, and special occasions.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-5 max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden p-2"
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
                className="w-full outline-none text-gray-700 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:border-l border-gray-200 px-4 py-2">
              <select
                className="w-full outline-none text-gray-700 bg-transparent text-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {vendorData?.categories?.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{ borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}
              className="px-8 py-2 bg-[#0f4c81] text-white font-semibold hover:bg-[#0d3d6a] transition-colors text-lg"
            >
              Search
            </button>
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link 
              to='/contactUs'
              style={{borderRadius:'5px', textDecoration:'none'}}
              className="px-6 py-2 bg-white/10 text-white border border-white rounded-md backdrop-blur-sm hover:text-black hover:bg-white/20 transition-colors text-lg"
            >
              Contact Us
            </Link>
            <Link
              to="/about"
              style={{textDecoration:'none' }}
              className="px-6 py-2 bg-[#445D7B] text-white border border-white rounded-md hover:bg-[#3a4f6a] transition-colors text-lg"
            >
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Browse Venues Section */}
      <div className="w-full">
        <BrowseVenues
          currentLocation={selectedCity}
          onLocationSelect={setSelectedCity}
        />
      </div>
    </div>
  );
};

export default DiscoverCategories;
