import React, { useState, useEffect } from 'react';
import {
  Camera, Video, Music, Utensils, Gift, Activity, Smile, Cake, Sparkles, Tent
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

// Components
import WeddingPhotographers from '../WeddingVendors/Photographers';
import Caterers from '../WeddingVendors/Caterers';
import WeddingDecorators from '../WeddingVendors/Decorators';
import WeddingMakeUp from '../WeddingVendors/WeddingMakeUp';
import WeddingPlanners from '../WeddingVendors/Planners';
import PartyPlaces from '../WeddingVendors/PartyPlaces';
import Choreographers from '../WeddingVendors/Choreographers';
import Photobooth from '../WeddingVendors/Photobooth';

// Data
const vendorCategories = [
  { title: 'Wedding Photographers', icon: Camera },
  { title: 'Caterers', icon: Utensils },
  { title: 'Wedding Decorators', icon: Gift },
  { title: 'Wedding MakeUp', icon: Gift },
  { title: 'Wedding Planners', icon: Utensils },
  { title: 'Party Places', icon: Video },
];

const additionalServices = [
  { title: 'Wedding Choreographers', icon: Activity },
  { title: 'Photobooth', icon: Smile },
  { title: 'Wedding DJ', icon: Music },
  { title: 'Wedding Cakes', icon: Cake },
  { title: 'Wedding Decorators', icon: Sparkles },
  { title: 'Party Places', icon: Tent },
];

const categoryComponents = {
  'Wedding Photographers': <WeddingPhotographers />,
  'Caterers': <Caterers />,
  'Wedding Decorators': <WeddingDecorators />,
  'Wedding MakeUp': <WeddingMakeUp />,
  'Wedding Planners': <WeddingPlanners />,
  'Party Places': <PartyPlaces />,
  'Wedding Choreographers': <Choreographers />,
  'Photobooth': <Photobooth />,
};

export default function WeddingVendor() {
  const [activeTab, setActiveTab] = useState('primary');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();
  const initialCategory = location.state?.category || null;
  const combinedCategories = [...vendorCategories, ...additionalServices];
  window.scrollTo({ top: 0, category: "top" })
  // Filtered categories based on active tab and search term
  const filteredCategories = searchTerm
    ? combinedCategories.filter(({ title }) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : activeTab === 'primary'
      ? vendorCategories
      : additionalServices;

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);

      const isPrimary = vendorCategories.some(cat => cat.title === initialCategory);
      const isAdditional = additionalServices.some(cat => cat.title === initialCategory);

      if (isPrimary) {
        setActiveTab('primary');
      } else if (isAdditional) {
        setActiveTab('additional');
      }
    }
  }, [initialCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(prev => (prev === category ? null : category));
  };

  return (
    <div className="relative font-serif">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-[#1A2A3A] font-playfair">
            Find the Perfect Vendors
          </h1>
          <p className="mb-8 text-sm sm:text-base md:text-lg">
            Connect with trusted professionals for your special event
          </p>
          <div className="flex justify-center mt-6">
            <div className="w-full max-w-2xl bg-white text-sm rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 border focus:outline-none text-gray-800 p-2 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                style={{ borderRadius: '5px' }}
                className="bg-[#10497a] hover:bg-[#062b4b] text-white px-3 py-2"
              >
                Search Venue
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs */}
      <div className="py-4 bg-gray-50">
        <div className="w-full p-5">
          <h2 className="text-3xl font-bold text-center mb-6 font-playfair text-corporate-dark">
            Start Hiring Your Vendors
          </h2>

          {/* Tab buttons */}
          <div className="flex justify-center mt-4 mb-8">
            <div className="inline-flex bg-gray-200 rounded-md overflow-hidden p-1">
              <button
                onClick={() => {
                  setActiveTab('primary');
                  setSelectedCategory(null);
                  setSearchTerm('');
                }}
                className={`px-3 py-2 text-sm font-medium transition ${activeTab === 'primary'
                  ? 'bg-corporate-primary text-black'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Primary Vendors
              </button>
              <button
                onClick={() => {
                  setActiveTab('additional');
                  setSelectedCategory(null);
                  setSearchTerm('');
                }}
                className={`px-3 py-2 text-sm font-medium transition ${activeTab === 'additional'
                  ? 'bg-corporate-primary text-black'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Additional Services
              </button>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 py-2 lg:ml-10">
            {filteredCategories.length > 0 ? (
              filteredCategories.map(({ title, icon: Icon }, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(title)}
                  className={`flex items-center rounded transition group bg-white py-2 w-full ${selectedCategory === title
                    ? 'border-2 border-[#0f4c81]'
                    : 'border border-transparent'
                    } hover:border-[#0f4c81]`}
                >
                  <div className="flex items-center justify-center mr-2 px-3 py-2">
                    <Icon className="w-9 h-9 text-black bg-gray-100 px-2 rounded-full" />
                  </div>
                  <span className="font-medium text-gray-800">{title}</span>
                </button>
              ))
            ) : (
              <div className="text-center col-span-full text-gray-500">
                No categories found for "{searchTerm}"
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Render Category Component if selected */}
      {selectedCategory && (
        <div className="p-2 lg:mx-20 lg:mt-15">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-bold">{selectedCategory}</h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className="border text-sm text-gray-700 px-3 py-2 rounded hover:bg-[#DEBF78] transition"
            >
              Back to Categories
            </button>
          </div>

          {activeTab === 'primary' &&
            vendorCategories.some((cat) => cat.title === selectedCategory) &&
            (categoryComponents[selectedCategory] || <p>No component available.</p>)
          }

          {activeTab === 'additional' &&
            additionalServices.some((cat) => cat.title === selectedCategory) &&
            (categoryComponents[selectedCategory] || <p>No component available.</p>)
          }
        </div>
      )}
    </div>
  );
}
