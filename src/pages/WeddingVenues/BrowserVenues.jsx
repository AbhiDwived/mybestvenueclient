import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const locations = [
  "All India", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad",
  "Kolkata", "Pune", "Jaipur", "Udaipur", "Goa", "Ahmedabad", "Lucknow",
  "Chandigarh", "Kochi", "Indore", "Nagpur", "Bhopal", "Patna", "Agra"
];

const BrowseVenues = ({ onLocationSelect, currentLocation }) => {
  const navigate = useNavigate();
  const [activeLocation, setActiveLocation] = useState("All India");
  const [scrollIndex, setScrollIndex] = useState(0);
  const visibleCount = 5;

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

  const handlePrev = () => {
    setScrollIndex((prev) =>
      prev === 0 ? locations.length - visibleCount : prev - 1
    );
  };

  const handleNext = () => {
    setScrollIndex((prev) =>
      prev >= locations.length - visibleCount ? 0 : prev + 1
    );
  };

  return (
    <div className="w-full my-6 ">
      <h5 className="text-xl font-semibold mb-4 text-center font-playfair">
        Browse Venues by Location
      </h5>

      <div className="relative w-full overflow-hidden p-7">
        <div
          className="flex transition-transform duration-300  ease-in-out"
          style={{ transform: `translateX(-${scrollIndex * 20}%)` }}
        >
          {locations.map((location) => (
            <div
              key={location}
              className="flex-shrink-0 w-1/2 sm:w-1/1 md:w-1/2 lg:w-1/5 mx-1"
            >
              <button
                onClick={() => handleLocationClick(location)}
                className={`flex items-center justify-center w-70 py-4 px-4 text-sm font-medium transition-colors duration-200 border rounded ${
                  location === activeLocation
                    ? 'bg-[#0f4c81] text-white'
                    : 'bg-white text-gray-700 hover:bg-[#0f4c81] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f4c81]'
                }`}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {location}
              </button>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          style={{ borderRadius: '25px' }}
          className="absolute left-10 top-1/2 -translate-y-1/2 transform bg-white text-gray-600 border rounded-full p-2 shadow-md hover:bg-yellow-100 transition-colors duration-200"
        >
          <IoIosArrowRoundBack className="text-lg hover:text-yellow-500" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          style={{ borderRadius: '25px' }}
          className="absolute right-10 top-1/2 -translate-y-1/2 transform bg-white text-gray-600 border rounded-full p-2 shadow-md hover:bg-yellow-100 transition-colors duration-200"
        >
          <IoIosArrowRoundForward className="text-lg hover:text-yellow-500" />
        </button>
      </div>
    </div>
  );
};

export default BrowseVenues;
