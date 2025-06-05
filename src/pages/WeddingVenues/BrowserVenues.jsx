import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';

const allLocations = [
  "All India", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad",
  "Kolkata", "Pune", "Jaipur", "Udaipur", "Goa", "Ahmedabad", "Lucknow",
  "Chandigarh", "Kochi", "Indore", "Nagpur", "Bhopal", "Patna", "Agra"
];

const BrowseVenues = ({ onLocationSelect, currentLocation, searchTerm = "" }) => {
  const navigate = useNavigate();
  const { city: urlCity } = useParams();
  const [activeLocation, setActiveLocation] = useState("All India");
  const [scrollIndex, setScrollIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setVisibleCount(width < 768 ? 1 : width < 1024 ? 3 : 5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fromProp = currentLocation;
    const fromURL = urlCity
      ? urlCity.split('-').map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ')
      : null;

    if (fromProp || fromURL) {
      setActiveLocation(fromProp || fromURL);
    }
  }, [currentLocation, urlCity]);

  const handleLocationClick = (location) => {
    setActiveLocation(location);
    onLocationSelect?.(location);
    navigate(`/locations/${location.replace(/\s+/g, '-').toLowerCase()}`);
  };

  const filteredLocations = allLocations.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const maxIndex = Math.max(0, filteredLocations.length - visibleCount);
  const handlePrev = () => setScrollIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setScrollIndex((prev) => Math.min(prev + 1, maxIndex));

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
                className={`w-full flex items-center justify-center py-4 text-sm font-medium transition-colors duration-200 border rounded
                  ${location === activeLocation
                    ? 'bg-[#0f4c81] text-white'
                    : 'hover:bg-[#f3f3f3] text-gray-700 hover:text-gray-900'
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
            <button
              onClick={handlePrev}
              aria-label="Scroll left"
              style={{ borderRadius: '25px' }}
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-white text-gray-600 border p-2 shadow-md hover:bg-yellow-100"
            >
              <IoIosArrowRoundBack className="text-2xl hover:text-yellow-500" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Scroll right"
              style={{ borderRadius: '25px' }}
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-white text-gray-600 border p-2 shadow-md hover:bg-yellow-100"
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
