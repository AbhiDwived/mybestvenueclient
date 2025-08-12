import { useEffect, useState, useMemo } from "react";
import { FaStar, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MapPin } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useGetAllPublicVendorsQuery } from "../../features/vendors/vendorAPI";
import { useSaveVendorMutation, useGetSavedVendorsQuery, useUnsaveVendorMutation } from "../../features/savedVendors/savedVendorAPI";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useGetVendorsReviewStatsQuery } from '../../features/reviews/reviewAPI';
import { navigateToVendor } from "../../utils/seoUrl";

const WeddingVenuesByLocation = () => {
  const [selectedCity, setSelectedCity] = useState('All India');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Helper: Find the most similar city from a list
  function findNearestCity(target, cityList) {
    if (!target || !cityList || cityList.length === 0) return 'All India';
    
    // Clean and normalize the target city name - take only the first word
    const cleanTarget = target.toLowerCase().trim().split(/\s+/)[0];
    const targetLower = target.toLowerCase().trim();
    
    // First, try exact match (case insensitive)
    let exactMatch = cityList.find(city => 
      city.toLowerCase().trim() === targetLower
    );
    if (exactMatch) {
      return exactMatch;
    }
    
    // Second, try matching the first word of the city
    let firstWordMatch = cityList.find(city => {
      const cityFirstWord = city.toLowerCase().trim().split(/\s+/)[0];
      return cityFirstWord === cleanTarget;
    });
    if (firstWordMatch) {
      return firstWordMatch;
    }
    
    // Third, try substring match (target contains city or city contains target)
    let substringMatch = cityList.find(city => {
      const cityLower = city.toLowerCase().trim();
      return cityLower.includes(cleanTarget) || cleanTarget.includes(cityLower);
    });
    if (substringMatch) {
      return substringMatch;
    }
    
    // Fourth, try word-by-word matching with the first word
    let wordMatch = cityList.find(city => {
      const cityLower = city.toLowerCase().trim();
      return cityLower.includes(cleanTarget);
    });
    if (wordMatch) {
      return wordMatch;
    }
    
    // Fifth, use Levenshtein distance for fuzzy matching
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
      const dist = levenshtein(cleanTarget, city.toLowerCase().trim());
      if (dist < minDist) {
        minDist = dist;
        nearest = city;
      }
    }
    
    // Only return the nearest city if the distance is reasonable (not too different)
    if (minDist <= Math.max(cleanTarget.length, nearest.toLowerCase().length) * 0.5) {
      return nearest;
    }
    
    return cityList[0] || 'All India';
  }

  const { data: vendorsData, isLoading, error } = useGetAllPublicVendorsQuery();

  const uniqueCities = useMemo(() => {
    if (!vendorsData?.locations) return [];
    const cities = vendorsData.locations.map(loc => loc.split(',')[0]);
    return [...new Set(cities)];
  }, [vendorsData]);

  // Detect location and set selectedCity to detected city
  useEffect(() => {
    if (!vendorsData) return; // Wait for vendor data to be available

    const getUserLocation = async () => {
      setIsLoadingLocation(true);
      
      const locationProviders = [
        // Method 1: Browser Geolocation + Reverse Geocoding
        async () => {
          return new Promise((resolve) => {
            if (!navigator.geolocation) {
              resolve(null);
              return;
            }
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const { latitude, longitude } = position.coords;
                  
                  const response = await fetch(
                    `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
                  );
                  
                  if (!response.ok) {
                    resolve(null);
                    return;
                  }
                  
                  const data = await response.json();
                  
                  const city = data.address?.city || 
                              data.address?.town || 
                              data.address?.village || 
                              data.address?.state || 
                              data.address?.county ||
                              null;
                  
                  resolve(city);
                } catch (error) {
                  resolve(null);
                }
              },
              (error) => {
                resolve(null);
              },
              { 
                timeout: 10000, 
                enableHighAccuracy: false,
                maximumAge: 300000 // 5 minutes
              }
            );
          });
        },
        
        // Method 2: IP-based location
        async () => {
          try {
            const response = await fetch('/api/ip-location');
            
            if (!response.ok) {
              return null;
            }
            
            const data = await response.json();
            
            const city = data.city || data.region_name || data.region || null;
            return city;
          } catch (error) {
            console.error('Error in IP location:', error);
            return null;
          }
        },
        
        // Method 3: Timezone-based location estimation
        async () => {
          try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // Simple timezone to city mapping for India
            const timezoneMap = {
              'Asia/Kolkata': 'Mumbai',
              'Asia/Calcutta': 'Mumbai',
              'Asia/Dhaka': 'Kolkata',
              'Asia/Karachi': 'Delhi',
              'Asia/Colombo': 'Chennai',
              'Asia/Kathmandu': 'Delhi',
              'Asia/Thimphu': 'Delhi',
              'Asia/Yangon': 'Kolkata',
              'Asia/Bangkok': 'Kolkata',
              'Asia/Singapore': 'Chennai',
              'Asia/Jakarta': 'Chennai',
              'Asia/Manila': 'Chennai',
              'Asia/Tokyo': 'Delhi',
              'Asia/Seoul': 'Delhi',
              'Asia/Shanghai': 'Delhi',
              'Asia/Hong_Kong': 'Delhi',
              'Asia/Taipei': 'Delhi',
              'Asia/Saigon': 'Chennai',
              'Asia/Ho_Chi_Minh': 'Chennai',
              'Asia/Vientiane': 'Chennai',
              'Asia/Phnom_Penh': 'Chennai',
              'Asia/Kuala_Lumpur': 'Chennai',
              'Asia/Brunei': 'Chennai',
              'Asia/Makassar': 'Chennai',
              'Asia/Jayapura': 'Chennai',
              'Asia/Ulaanbaatar': 'Delhi',
              'Asia/Ulan_Bator': 'Delhi',
              'Asia/Pyongyang': 'Delhi',
              'Asia/Tehran': 'Delhi',
              'Asia/Baghdad': 'Delhi',
              'Asia/Riyadh': 'Delhi',
              'Asia/Kuwait': 'Delhi',
              'Asia/Qatar': 'Delhi',
              'Asia/Bahrain': 'Delhi',
              'Asia/Muscat': 'Delhi',
              'Asia/Dubai': 'Delhi',
              'Asia/Aden': 'Delhi',
              'Asia/Aqtau': 'Delhi',
              'Asia/Aqtobe': 'Delhi',
              'Asia/Ashgabat': 'Delhi',
              'Asia/Dushanbe': 'Delhi',
              'Asia/Tashkent': 'Delhi',
              'Asia/Samarkand': 'Delhi',
              'Asia/Bishkek': 'Delhi',
              'Asia/Almaty': 'Delhi',
              'Asia/Qyzylorda': 'Delhi',
              'Asia/Atyrau': 'Delhi',
              'Asia/Oral': 'Delhi',
              'Asia/Yekaterinburg': 'Delhi',
              'Asia/Novosibirsk': 'Delhi',
              'Asia/Novokuznetsk': 'Delhi',
              'Asia/Krasnoyarsk': 'Delhi',
              'Asia/Irkutsk': 'Delhi',
              'Asia/Chita': 'Delhi',
              'Asia/Yakutsk': 'Delhi',
              'Asia/Vladivostok': 'Delhi',
              'Asia/Magadan': 'Delhi',
              'Asia/Kamchatka': 'Delhi',
              'Asia/Anadyr': 'Delhi'
            };
            
            const estimatedCity = timezoneMap[timezone];
            return estimatedCity;
          } catch (error) {
            console.error('Error in timezone-based location:', error);
            return null;
          }
        }
      ];
      
      // Try each location provider
      for (let i = 0; i < locationProviders.length; i++) {
        try {
          const city = await locationProviders[i]();
          
          if (city && city !== 'All India' && city.trim() !== '') {
            const nearestCity = findNearestCity(city, uniqueCities);
            
            if (nearestCity && nearestCity !== 'All India') {
              setSelectedCity(nearestCity);
              setIsLoadingLocation(false);
              return;
            }
          }
        } catch (error) {
          // Error handling for location provider
        }
      }
      
      setSelectedCity('All India');
      setIsLoadingLocation(false);
    };
    
    getUserLocation();
  }, [vendorsData, uniqueCities]);
  const navigate = useNavigate();
  const [saveVendor] = useSaveVendorMutation();
  const [unsaveVendor] = useUnsaveVendorMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: savedVendorsData } = useGetSavedVendorsQuery(undefined, { skip: !isAuthenticated });
  const savedVendorIds = savedVendorsData?.data?.map(v => v._id || v.id) || [];

  const getDisplayLocation = (venue) => {
    const normalize = (value) => {
      if (Array.isArray(value)) return value[0] || '';
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.startsWith('[')) {
          try {
            const arr = JSON.parse(trimmed);
            if (Array.isArray(arr)) return arr[0] || '';
          } catch (_) {
            // fall through
          }
        }
        return trimmed;
      }
      return '';
    };

    const primary = venue.city && typeof venue.city === 'string' ? venue.city : '';
    const fallback = normalize(venue.serviceAreas) || venue.address?.city || '';
    const locationString = primary || fallback;
    if (locationString && typeof locationString === 'string') {
      return locationString.split(',')[0].replace(/^\["?/, '').replace(/"?\]$/, '').trim();
    }
    return 'Location not specified';
  }

  // Filter venues by location and venue type
  const baseVenues = useMemo(() => {
    if (!vendorsData?.vendors && !vendorsData?.data) {
      return [];
    }
    const vendors = vendorsData.vendors || vendorsData.data || [];
    
    const venues = vendors.filter(vendor => {
      if (vendor.businessType !== 'venue') return false;
      if (selectedCity === "All India") return true;
      
      const locationLower = selectedCity.toLowerCase();
      const cityMatch = (vendor.city && vendor.city.toLowerCase() === locationLower) ||
                      (vendor.address?.city && vendor.address.city.toLowerCase() === locationLower);
      
      return cityMatch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(vendor => ({
      id: vendor._id,
      image: vendor.profilePicture || vendor.galleryImages?.[0]?.url,
      category: vendor.venueType,
      name: vendor.businessName,
      businessName: vendor.businessName,
      vendorType: vendor.vendorType,
      venueType: vendor.venueType,
      businessType: vendor.businessType,
      city: vendor.city,
      nearLocation: vendor.nearLocation,
      serviceAreas: vendor.serviceAreas,
      address: vendor.address,
      services: vendor.services,
      pricing: vendor.pricing || [],
      location: vendor.location,
      createdAt: vendor.createdAt
    }));
    
    return venues;
  }, [vendorsData, selectedCity]);

  const locationVenues = useMemo(() => {
    if (baseVenues.length > 0 && baseVenues.length < 4) {
      const repeated = [];
      while (repeated.length < 20) {
        repeated.push(...baseVenues);
      }
      return repeated;
    }
    return baseVenues;
  }, [baseVenues]);

  const venueIds = useMemo(() => locationVenues.map(v => v.id).filter(id => id && id.trim() !== ''), [locationVenues]);
  const { data: statsData, isLoading: isLoadingStats } = useGetVendorsReviewStatsQuery(venueIds, { skip: !venueIds.length });
  const stats = statsData?.stats || {};

  const totalSlides = locationVenues.length;

  useEffect(() => {
    if (totalSlides > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => {
          const nextSlide = prev + 1;
          if (baseVenues.length < 4 && nextSlide >= totalSlides) {
            return 0;
          }
          return nextSlide % totalSlides;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [totalSlides, baseVenues.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const toggleFavorite = async (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save venues.');
      return;
    }
    if (savedVendorIds.includes(id)) {
      try {
        await unsaveVendor(id).unwrap();
        toast.success('Venue removed from favorites!');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to unsave venue');
      }
    } else {
      try {
        await saveVendor(id).unwrap();
        toast.success('Venue saved to favorites!');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to save venue');
      }
    }
  };

  const handleVenueClick = (venue) => {
    navigateToVendor(navigate, venue);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading venues...</div>;
  }

  if (error) {
    return null;
  }

  if (baseVenues.length === 0) {
    return null;
  }

  return (
    <div className="lg:mx-2 px-4 md:px-10 xl:px-20 py-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800 font-serif">
          Wedding Venues in {selectedCity}
        </h3>
        <div className="flex items-center gap-4">
          <select
            className="outline-none border border-gray-300 rounded px-2 py-1 text-gray-700 text-sm"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            disabled={isLoadingLocation}
          >
            <option value="All India">All India</option>
            {uniqueCities.map((city, idx) => (
              <option key={city + idx} value={city}>{city}</option>
            ))}
          </select>
          {baseVenues.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {locationVenues.map((venue, index) => {
            const stat = stats[venue.id] || { avgRating: 0, reviewCount: 0 };
            return (
              <div
                key={`${venue.id}-${index}`}
                className="flex-shrink-0 w-[24%] mr-[1%] bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
                onClick={() => handleVenueClick(venue)}
              >
                <div className="relative group">
                  <img
                    src={venue.image || 'default-vendor-image.jpg'}
                    alt={venue.name || venue.businessName}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
                  />
                  <button
                    onClick={(e) => toggleFavorite(e, venue.id)}
                    className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-gray-800"
                    aria-label={savedVendorIds.includes(venue.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {savedVendorIds.includes(venue.id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>
                <div className="flex flex-col justify-between flex-grow p-2 font-serif">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 uppercase">{venue.category}</p>
                    <div className="flex justify-between items-center gap-2 mb-2">
                      <h5 className="text-md font-semibold truncate max-w-[65%] font-serif">
                        {venue.name || venue.businessName || "Vendor Name"}
                      </h5>
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                        <FaStar size={18} className="text-yellow-500" />
                        <span>
                          {isLoadingStats
                            ? '0'
                            : typeof stat.avgRating === 'number' && !isNaN(stat.avgRating) && stat.avgRating !== 0
                              ? stat.avgRating === 5
                                ? '5'
                                : stat.avgRating.toFixed(1)
                              : '0'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                      <MapPin size={14} />
                      <span className="truncate">{getDisplayLocation(venue)}</span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 text-xs text-gray-600 mt-1"></div>
                  </div>
                  <div className="border-t mt-3 pt-3 text-sm text-gray-800">
                    <div className="flex items-center gap-5 text-sm text-gray-600 mb-3 border-amber-300">
                      {venue?.pricing?.filter(item => item?.type && item?.price)?.length > 0 ? (
                        venue.pricing
                          .filter(item => item?.type && item?.price)
                          .slice(0, 2)
                          .map((item, index) => (
                            <div key={item._id || index}>
                              <div className="text-sm text-gray-500">{item.type}</div>
                              <div className="flex items-center text-md font-bold text-gray-800">
                                ₹ {item.price.toLocaleString('en-IN')}
                                <span className="text-xs font-normal text-gray-500 ml-1">
                                  {item.unit || 'per person'}
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-sm text-gray-500">No Pricing Available</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      <span className="text-gray-600   p-1 rounded">
                        {(() => {
                          let raw = venue.services || [];
                          let vendorServices = Array.isArray(raw)
                            ? raw.length === 1 && typeof raw[0] === "string"
                              ? raw[0].split(',').map(s => s.trim())
                              : raw
                            : [];
                          return vendorServices.length > 0 ? (
                            <div className="flex flex-wrap gap-2 ">
                              {vendorServices.slice(0, 2).map((service, index) => (
                                <span
                                  key={index}
                                  className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md  "
                                >
                                  {service}
                                </span>
                              ))}
                              {vendorServices.length > 2 && (
                                <span className="text-sm text-gray-600 hover:underline">
                                  +{vendorServices.length - 2} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No services available</span>
                          );
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeddingVenuesByLocation;
