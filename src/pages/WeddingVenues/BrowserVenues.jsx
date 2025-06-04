import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const allLocations = [
  "All India", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad",
  "Kolkata", "Pune", "Jaipur", "Udaipur", "Goa", "Ahmedabad", "Lucknow",
  "Chandigarh", "Kochi", "Indore", "Nagpur", "Bhopal", "Patna", "Agra"
];

const BrowseVenues = ({ onLocationSelect, currentLocation, searchTerm = "" }) => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState("All India");
  const [scrollIndex, setScrollIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth < 768 ? 1 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentLocation) {
      setActiveLocation(currentLocation);
    }
  }, [currentLocation]);

  const handleLocationClick = (location) => {
    setActiveLocation(location);
    onLocationSelect?.(location);
    navigate(`/locations/${location.replace(/\s+/g, '-').toLowerCase()}`);
  };

  // Filter locations based on searchTerm
  const filteredLocations = allLocations.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxIndex = Math.max(0, filteredLocations.length - visibleCount);

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setScrollIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div className="w-full my-6 lg:px-20">
      <h5 className="text-xl font-semibold mb-4 text-center font-playfair">
        Browse Venues by Location
      </h5>

      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            width: `${(filteredLocations.length / visibleCount) * 100}%`,
            transform: `translateX(-${(scrollIndex * 100) / filteredLocations.length}%)`,
          }}
        >
          {filteredLocations.map((location) => (
            <div
              key={location}
              className="flex-shrink-0 px-2"
              style={{ width: `${100 / filteredLocations.length}%` }}
            >
              <button
                onClick={() => handleLocationClick(location)}
                className={`w-full flex items-center justify-center py-4 text-sm font-medium transition-colors duration-200 border rounded ${location === activeLocation
                  ? 'bg-[#0f4c81] text-white'
                  : 'bg-white text-gray-700 hover:bg-[#0f4c81] hover:text-gray-900'
                  }`}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {location}
              </button>
            </div>
          ))}
        </div>

        {filteredLocations.length > visibleCount && (
          <>
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              style={{ borderRadius: '25px' }}
              className="absolute left-5 top-1/2 -translate-y-1/2 transform bg-white text-gray-600 border rounded-full p-2 shadow-md hover:bg-yellow-100 transition-colors duration-200"
              aria-label="Scroll left"
            >
              <IoIosArrowRoundBack className="text-2xl hover:text-yellow-500" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              style={{ borderRadius: '25px' }}
              className="absolute right-5 top-1/2 -translate-y-1/2 transform bg-white text-gray-600 border rounded-full p-2 shadow-md hover:bg-yellow-100 transition-colors duration-200"
              aria-label="Scroll right"
            >
              <IoIosArrowRoundForward className="text-2xl hover:text-yellow-500" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseVenues;
