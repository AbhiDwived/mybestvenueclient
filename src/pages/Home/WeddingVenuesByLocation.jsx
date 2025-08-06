import { useEffect, useState, useMemo } from "react";
import { FaStar, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MapPin } from 'lucide-react';
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllPublicVendorsQuery } from "../../features/vendors/vendorAPI";
import { useSaveVendorMutation, useGetSavedVendorsQuery, useUnsaveVendorMutation } from "../../features/savedVendors/savedVendorAPI";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useGetVendorsReviewStatsQuery } from '../../features/reviews/reviewAPI';
import { navigateToVendor } from "../../utils/seoUrl";

const WeddingVenuesByLocation = () => {
  const [currentLocation, setCurrentLocation] = useState('All India');
  const [detectedCity, setDetectedCity] = useState('All India');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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

  const { data: vendorsData, isLoading, error } = useGetAllPublicVendorsQuery();

  // Detect location and set currentLocation to detected/nearest city
  useEffect(() => {
    const getUserLocation = async () => {
      setIsLoadingLocation(true);
      let foundCity = 'All India';
      try {
        if (navigator.geolocation) {
          await new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const { latitude, longitude } = position.coords;
                  const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                  );
                  const data = await response.json();
                  foundCity = data.city || data.locality || data.principalSubdivision || 'All India';
                  setDetectedCity(foundCity);
                  resolve();
                } catch (error) {
                  await getIPLocation(resolve);
                }
              },
              async () => {
                await getIPLocation(resolve);
              }
            );
          });
        } else {
          await new Promise((resolve) => getIPLocation(resolve));
        }
      } catch (error) {
        setDetectedCity('All India');
      } finally {
        setIsLoadingLocation(false);
      }
    };

    const getIPLocation = async (resolve) => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const city = data.city || data.region || 'All India';
        setDetectedCity(city);
        resolve && resolve();
      } catch (error) {
        setDetectedCity('All India');
        resolve && resolve();
      }
    };

    getUserLocation();
  }, []);

  // When vendorData.locations or detectedCity changes, set currentLocation
  useEffect(() => {
    const locations = vendorsData?.locations || [];
    if (
      detectedCity &&
      detectedCity !== 'All India' &&
      locations.length > 0
    ) {
      if (locations.includes(detectedCity)) {
        setCurrentLocation(detectedCity);
      } else {
        // Find nearest city
        const nearest = findNearestCity(detectedCity, locations);
        setCurrentLocation(nearest);
      }
    } else {
      setCurrentLocation('All India');
    }
  }, [detectedCity, vendorsData?.locations]);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  // const { data: vendorsData, isLoading, error } = useGetAllPublicVendorsQuery(); // Duplicate removed
  const [saveVendor] = useSaveVendorMutation();
  const [unsaveVendor] = useUnsaveVendorMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: savedVendorsData } = useGetSavedVendorsQuery(undefined, { skip: !isAuthenticated });
  const savedVendorIds = savedVendorsData?.data?.map(v => v._id || v.id) || [];

  // Filter venues by location and venue type - show only latest from each venue type
  const baseVenues = useMemo(() => {
    if (!vendorsData?.vendors && !vendorsData?.data) {
      return [];
    }
    
    // Handle both possible data structures
    const vendors = vendorsData.vendors || vendorsData.data || [];
    
    const venues = vendors.filter(vendor => {
      // Filter by businessType = 'venue' OR venue-related keywords in name
      const isVenueByType = vendor.businessType === 'venue';
      const businessName = (vendor.businessName || '').toLowerCase();
      const isVenueByName = businessName.includes('banquet') ||
                           businessName.includes('hotel') ||
                           businessName.includes('resort') ||
                           businessName.includes('farmhouse') ||
                           businessName.includes('farm') ||
                           businessName.includes('venue') ||
                           businessName.includes('hall') ||
                           businessName.includes('garden') ||
                           businessName.includes('palace') ||
                           businessName.includes('manor') ||
                           businessName.includes('residency') ||
                           businessName.includes('grand') ||
                           businessName.includes('plaza') ||
                           businessName.includes('inn') ||
                           businessName.includes('suites');
      
      const isVenue = isVenueByType || isVenueByName;
      
      if (!isVenue) return false;
      
      if (currentLocation === "All India") return true;
      
      // Location matching
      const locationLower = currentLocation.toLowerCase();
      const matchesLocation = 
        vendor.serviceAreas?.some(area => 
          area && area.toLowerCase().includes(locationLower)
        ) || 
        (vendor.address?.city && vendor.address.city.toLowerCase().includes(locationLower)) ||
        (vendor.address?.state && vendor.address.state.toLowerCase().includes(locationLower)) ||
        (vendor.city && vendor.city.toLowerCase().includes(locationLower)) ||
        (vendor.state && vendor.state.toLowerCase().includes(locationLower));
      
      return matchesLocation;
    });
    
    // Sort by creation date (latest first)
    const sortedVenues = venues.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // If location is "All India", show the latest 8 venues regardless of type.
    // Otherwise, group by venue type to show variety for a specific location.
    if (currentLocation === "All India") {
      return sortedVenues
        .slice(0, 8)
        .map(vendor => ({
          id: vendor._id,
          image: vendor.profilePicture || vendor.galleryImages?.[0]?.url,
          category: vendor.venueType || vendor.vendorType || vendor.businessType || 'Venue',
          name: vendor.businessName,
          displayLocation: vendor.serviceAreas?.length > 0
            ? vendor.serviceAreas[0]
            : vendor.address?.city && vendor.address?.state
              ? `${vendor.address.city}, ${vendor.address.state}`
              : vendor.city && vendor.state
                ? `${vendor.city}, ${vendor.state}`
                : vendor.address?.city || vendor.address?.state || vendor.city || vendor.state || 'Location not specified',
          services: vendor.services,
          pricing: vendor.pricing || [],
          ...vendor
        }));
    }

    // Group by venue type for specific locations
    const venuesByType = {};
    sortedVenues.forEach(vendor => {
      const venueType = vendor.venueType || vendor.vendorType || vendor.businessType || 'Venue';
      if (!venuesByType[venueType]) {
        venuesByType[venueType] = vendor;
      }
    });
    
    // Convert to array and limit to 8 venues
    return Object.values(venuesByType)
      .slice(0, 8)
      .map(vendor => ({
        id: vendor._id,
        image: vendor.profilePicture || vendor.galleryImages?.[0]?.url,
        category: vendor.venueType || vendor.vendorType || vendor.businessType || 'Venue',
        name: vendor.businessName,
        displayLocation: vendor.serviceAreas?.length > 0
          ? vendor.serviceAreas[0]
          : vendor.address?.city && vendor.address?.state
            ? `${vendor.address.city}, ${vendor.address.state}`
            : vendor.city && vendor.state
              ? `${vendor.city}, ${vendor.state}`
              : vendor.address?.city || vendor.address?.state || vendor.city || vendor.state || 'Location not specified',
        services: vendor.services,
        pricing: vendor.pricing || [],
        // Add all original vendor fields for SEO URL generation
        ...vendor
      }));
  }, [vendorsData, currentLocation]);

  // Use a single array for slider
  const locationVenues = baseVenues;

  // Fetch review stats for venues
  const venueIds = useMemo(() => locationVenues.map(v => v.id), [locationVenues]);
  const { data: statsData, isLoading: isLoadingStats } = useGetVendorsReviewStatsQuery(venueIds, { skip: !venueIds.length });
  const stats = statsData?.stats || {};

  const slidesToShow = 4;
  const totalSlides = baseVenues.length;

  // Auto-slider functionality (simple loop)
  useEffect(() => {
    if (locationVenues.length <= slidesToShow) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % (locationVenues.length - slidesToShow + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [locationVenues.length, slidesToShow]);

  const nextSlide = () => {
    setCurrentSlide(prev => {
      const nextSlide = prev + 1;
      if (nextSlide >= totalSlides) {
        setTimeout(() => setCurrentSlide(0), 50);
        return totalSlides;
      }
      return nextSlide;
    });
  };

  const prevSlide = () => {
    setCurrentSlide(prev => {
      if (prev <= 0) {
        setTimeout(() => setCurrentSlide(totalSlides - 1), 50);
        return -1;
      }
      return prev - 1;
    });
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
    navigateToVendor(navigate, {
      ...venue,
      city: currentLocation !== 'All India' ? currentLocation : venue.city
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading venues...</div>;
  }

  if (error) {
    return null;
  }

  // Show message if no venues found
  if (baseVenues.length === 0) {
    return null;
  }

  return (
    <div className="lg:mx-2 px-4 md:px-10 xl:px-20 py-10">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800 font-serif">
          Wedding Venues in {currentLocation}
        </h3>
        
        <div className="flex items-center gap-4">
          <Link 
            style={{ textDecoration: 'none' }} 
            to={`/search?category=venue&city=${currentLocation !== 'All India' ? currentLocation : ''}`} 
            className="flex text-[#052038] hover:underline"
          >
            <p className="text-[#052038] hover:text-black">View All</p>
            <IoIosArrowForward className="ml-1 mt-1 text-[#052038]" />
          </Link>
          
          {baseVenues.length > slidesToShow && (
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
          className={`flex gap-6 transition-transform duration-500 ease-in-out`}
          style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
        >
          {locationVenues.map((venue, index) => {
            const stat = stats[venue.id] || { avgRating: 0, reviewCount: 0 };
            return (
              <div
                key={`${venue.id}-${index}`}
                className="flex-shrink-0 w-1/4 bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
                onClick={() => handleVenueClick(venue)}
              >
                <div className="relative group">
                  <img
                    src={venue.image || 'default-venue-image.jpg'}
                    alt={venue.name}
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
                        {venue.name || "Venue Name"}
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
                      <span className="truncate">{venue.displayLocation || "Location not specified"}</span>
                    </div>
                  </div>
                  
                  <div className="border-t mt-3 pt-3 text-sm text-gray-800">
                    <div className="flex items-center gap-5 text-sm text-gray-600 mb-3">
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
                      <span className="text-gray-600 p-1 rounded">
                        {(() => {
                          let raw = venue.services || [];
                          let venueServices = Array.isArray(raw)
                            ? raw.length === 1 && typeof raw[0] === "string"
                              ? raw[0].split(',').map(s => s.trim())
                              : raw
                            : [];
                          return venueServices.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {venueServices.slice(0, 2).map((service, index) => (
                                <span
                                  key={index}
                                  className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                                >
                                  {service}
                                </span>
                              ))}
                              {venueServices.length > 2 && (
                                <span className="text-sm text-gray-600 hover:underline">
                                  +{venueServices.length - 2} more
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
