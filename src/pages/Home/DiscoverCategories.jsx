import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DiscoverImage from "../../assets/newPics/discoverImage.jpg";
import BrowseVenues from '../WeddingVenues/BrowserVenues';
import { useGetAllPublicVendorsQuery } from '../../features/vendors/vendorAPI';
import Loader from '../../components/{Shared}/Loader';
import { MapPin, Building2, Camera, Music, Utensils, Car, Flower, Users, Star, ChevronRight } from 'lucide-react';

const DiscoverCategories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('All India');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Helper: Find the most similar city from a list
  function findNearestCity(target, cityList) {
    if (!target || !cityList || cityList.length === 0) return 'All India';
    const targetLower = target.toLowerCase();
    // Prefer substring match first
    let best = cityList.find(city => city.toLowerCase().includes(targetLower));
    if (best) return best;
    // Otherwise, use Levenshtein distance
    function levenshtein(a, b) {
      const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
      for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
      for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + (a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1)
          );
        }
      }
      return matrix[a.length][b.length];
    }
    let minDist = Infinity;
    let nearest = cityList[0];
    for (const city of cityList) {
      const dist = levenshtein(target, city);
      if (dist < minDist) {
        minDist = dist;
        nearest = city;
      }
    }
    return nearest;
  }

  // Category icons mapping
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Photography': Camera,
      'Catering': Utensils,
      'Music': Music,
      'Transportation': Car,
      'Decoration': Flower,
      'Venue': Building2,
      'Event Planning': Users,
      'default': Star
    };
    
    const IconComponent = iconMap[category] || iconMap.default;
    return <IconComponent className="w-4 h-4 text-blue-600" />;
  };

  // Fetch all vendors to get categories
  const { data: vendorData, isLoading } = useGetAllPublicVendorsQuery();

  const uniqueCities = useMemo(() => {
    if (!vendorData?.locations) return [];
    const cities = vendorData.locations.map(loc => loc.split(',')[0]);
    return [...new Set(cities)];
  }, [vendorData]);

  // Reference for the search container
  const searchContainerRef = useRef(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user's current location on component mount
  useEffect(() => {
    if (!vendorData) return; // Wait for vendor data to be available

    const getUserLocation = async () => {
      setIsLoadingLocation(true);
      
      const locationProviders = [
        async () => {
          return new Promise((resolve) => {
            if (!navigator.geolocation) {
              resolve('All India');
              return;
            }
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const { latitude, longitude } = position.coords;
                  const response = await fetch(
                    `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
                  );
                  if (!response.ok) throw new Error('Failed to fetch location');
                  const data = await response.json();
                  const city = data.address?.city || 
                              data.address?.town || 
                              data.address?.village || 
                              data.address?.state || 
                              'All India';
                  resolve(city);
                } catch {
                  resolve('All India');
                }
              },
              () => resolve('All India'),
              { timeout: 5000, enableHighAccuracy: false }
            );
          });
        },
        async () => {
          try {
            const response = await fetch('/api/ip-location');
            if (!response.ok) throw new Error('Failed to fetch IP location');
            const data = await response.json();
            return data.city || data.region_name || 'All India';
          } catch {
            return 'All India';
          }
        }
      ];
      
      for (const provider of locationProviders) {
        try {
          const city = await provider();
          if (city && city !== 'All India') {
            const nearestCity = findNearestCity(city, uniqueCities);
            setSelectedCity(nearestCity);
            setIsLoadingLocation(false);
            return;
          }
        } catch {
          // ignore and continue
        }
      }
      
      setSelectedCity('All India');
      setIsLoadingLocation(false);
    };
    getUserLocation();
  }, [vendorData]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Close suggestions dropdown
    setShowSuggestions(false);
    
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
        className="w-full h-[525px] bg-cover bg-center flex items-center"
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

          <div className="relative" ref={searchContainerRef}>
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-5 max-w-4xl bg-white rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden p-2"
            >
              {/* Section 1: Search Input with Dropdown */}
              <div className="flex flex-1 items-center px-4 py-2 relative">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
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
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search venues or vendors..."
                    className="w-full outline-none text-gray-700 text-lg pr-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={() => setShowSuggestions(true)}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <svg 
                      className="w-4 h-4 text-gray-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Section 2: Categories Dropdown */}
              <div className="md:border-l border-gray-200 px-4 py-2">
                <select
                  className="w-full outline-none text-gray-700 bg-transparent text-lg"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option key="all-categories" value="">All Categories</option>
                  {vendorData?.categories?.map((cat, index) => (
                    <option key={`${cat}-${index}`} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section 3: Current Location */}
              <div className="md:border-l border-gray-200 px-4 py-2 flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                <select
                  className="w-full outline-none text-gray-700 bg-transparent text-lg"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option key="all-india" value="All India">All India</option>
                  {isLoadingLocation ? (
                    <option key="loading" disabled>Detecting location...</option>
                  ) : (
                    uniqueCities.map((city, index) => (
                      <option key={`${city}-${index}`} value={city}>
                        {city}
                      </option>
                    ))
                  )}
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
            
            {/* Enhanced Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mx-auto max-w-4xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Vendors Section */}
                  <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-blue-600" />
                        <h3 className="text-xs font-semibold text-gray-700">Top Vendors</h3>
                      </div>
                    </div>
                    <div>
                      {vendorData?.vendors?.length > 0 ? (
                        vendorData.vendors
                          .filter(vendor => 
                            !searchTerm || 
                            vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .slice(0, 8)
                          .map(vendor => (
                            <div 
                              key={vendor._id} 
                              className="px-3 py-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-all duration-200 group"
                              onClick={() => {
                                setSearchTerm(vendor.businessName);
                                setShowSuggestions(false);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Building2 className="w-3 h-3 text-blue-600" />
                                  </div>
                                  <span className="text-xs text-gray-800">{vendor.businessName}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="py-4 text-center">
                          <Building2 className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">No vendors available</p>
                        </div>
                      )}
                      
                      {vendorData?.vendors?.length > 8 && (
                        <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100">
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                            onClick={() => {
                              navigate('/search');
                              setShowSuggestions(false);
                            }}
                          >
                            View all vendors <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Categories Section */}
                  <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100">
                    <div className="px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-purple-600" />
                        <h3 className="text-xs font-semibold text-gray-700">Popular Categories</h3>
                      </div>
                    </div>
                    <div>
                      {vendorData?.categories?.length > 0 ? (
                        vendorData.categories
                          .filter(cat => 
                            !searchTerm || 
                            cat.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .slice(0, 8)
                          .map(cat => (
                            <div 
                              key={cat} 
                              className="px-3 py-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-all duration-200 group"
                              onClick={() => {
                                setCategory(cat);
                                setShowSuggestions(false);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                    {getCategoryIcon(cat)}
                                  </div>
                                  <span className="text-xs text-gray-800">{cat}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="py-4 text-center">
                          <Star className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">No categories available</p>
                        </div>
                      )}
                      
                      {vendorData?.categories?.length > 8 && (
                        <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-purple-50 border-t border-gray-100">
                          <button 
                            className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
                            onClick={() => {
                              navigate('/search?category=all');
                              setShowSuggestions(false);
                            }}
                          >
                            View all categories <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Locations Section */}
                  <div className="md:w-1/3">
                    <div className="px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-green-600" />
                        <h3 className="text-xs font-semibold text-gray-700">Popular Locations</h3>
                      </div>
                    </div>
                    <div>
                      {vendorData?.locations?.length > 0 ? (
                        vendorData.locations
                          .filter(loc => 
                            !searchTerm || 
                            loc.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .slice(0, 8)
                          .map(loc => (
                            <div 
                              key={loc} 
                              className="px-3 py-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-all duration-200 group"
                              onClick={() => {
                                setSelectedCity(loc);
                                setShowSuggestions(false);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-3 h-3 text-green-600" />
                                  </div>
                                  <span className="text-xs text-gray-800">{loc}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-green-600 transition-colors" />
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="py-4 text-center">
                          <MapPin className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">No locations available</p>
                        </div>
                      )}
                      
                      {vendorData?.locations?.length > 8 && (
                        <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-green-50 border-t border-gray-100">
                          <button 
                            className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1 transition-colors"
                            onClick={() => {
                              navigate('/locations');
                              setShowSuggestions(false);
                            }}
                          >
                            View all locations <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* No Results */}
                {searchTerm && 
                 !vendorData?.vendors?.some(v => v.businessName.toLowerCase().includes(searchTerm.toLowerCase())) &&
                 !vendorData?.categories?.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())) &&
                 !vendorData?.locations?.some(l => l.toLowerCase().includes(searchTerm.toLowerCase())) && (
                  <div className="py-4 px-3 text-center border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 mb-2">No results found for "{searchTerm}"</p>
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <Link 
              to='/contactUs'
              style={{borderRadius:'5px', textDecoration:'none'}}
              className="px-6 py-2 bg-white/10 text-white border border-white rounded-md backdrop-blur-sm hover:text-black hover:bg-white/20 transition-colors text-lg"
            >
              Contact Us
            </Link>
            <a
              href="/about"
              style={{textDecoration:'none'}}
              className="px-6 py-2 bg-[#445D7B] text-white border border-white rounded-md hover:bg-[#3a4f6a] transition-colors text-lg"
            >
              About
            </a>
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
