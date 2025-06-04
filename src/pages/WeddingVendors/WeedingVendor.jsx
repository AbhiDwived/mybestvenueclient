import React, { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import {
  Camera, Video, Music, Utensils, Car, Mail, Gift, Flower, Pencil,
  Activity, Smile, Cake, Sparkles, Tent, Plane, Drum, Megaphone,
} from 'lucide-react';

import WeVendorr1 from '../../assets/newPics/WeVendorr1.avif';
import WeVendorr2 from '../../assets/newPics/WeVendor2avif.avif';
import WeVendorr3 from '../../assets/newPics/WeVendor3.avif';
import WeVendorr4 from '../../assets/newPics/WeVendor4.avif';
import WeVendorr5 from '../../assets/newPics/WeVendor5.avif';
import { FaStar } from "react-icons/fa";

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
  { title: 'Honeymoon', icon: Plane },
  { title: 'Wedding Entertainment', icon: Drum },
  { title: 'Promotions', icon: Megaphone },
];

const vendors = [
  //########################## Wedding MakeUp ##########################
  {
    id: 1,
    name: "Glam MakeUp Studio",
    category: "Wedding MakeUp",
    location: "Mumbai, India",
    price: "₹15,000 - ₹40,000",
    reviews: 89,
    rating: 4.7,
    image: WeVendorr2,
    description: "Bringing out your bridal glow with professional touch.",
  },
  {
    id: 2,
    name: "Bridal Beauty Parlour",
    category: "Wedding MakeUp",
    location: "Pune, India",
    price: "₹10,000 - ₹35,000",
    reviews: 76,
    rating: 4.6,
    image: WeVendorr2,
    description: "Elegance and charm for your wedding look.",
  },
  {
    id: 3,
    name: "Divine Beauty Studio",
    category: "Wedding MakeUp",
    location: "Delhi, India",
    price: "₹18,000 - ₹45,000",
    reviews: 95,
    rating: 4.8,
    image: WeVendorr2,
    description: "A divine touch for your special day.",
  },
  {
    id: 4,
    name: "Royal Bridal MakeUp",
    category: "Wedding MakeUp",
    location: "Chennai, India",
    price: "₹20,000 - ₹50,000",
    reviews: 81,
    rating: 4.7,
    image: WeVendorr2,
    description: "Makeup fit for royalty.",
  },

  //########################## Caterers ##########################
  {
    id: 5,
    name: "Delicious Catering",
    category: "Caterers",
    location: "Hyderabad, India",
    price: "₹500 - ₹1,500 per plate",
    reviews: 156,
    rating: 4.6,
    image: WeVendorr3,
    description: "Exquisite cuisine for your wedding celebration.",
  },
  {
    id: 6,
    name: "Spice Garden Catering",
    category: "Caterers",
    location: "Delhi, India",
    price: "₹400 - ₹1,200 per plate",
    reviews: 178,
    rating: 4.6,
    image: WeVendorr3,
    description: "Authentic Indian flavours for your special day.",
  },
  {
    id: 7,
    name: "Golden Plate Catering",
    category: "Caterers",
    location: "Mumbai, India",
    price: "₹600 - ₹1,800 per plate",
    reviews: 132,
    rating: 4.5,
    image: WeVendorr3,
    description: "Delicious menus tailored to your event.",
  },
  {
    id: 8,
    name: "Taste Buds Catering",
    category: "Caterers",
    location: "Bangalore, India",
    price: "₹550 - ₹1,600 per plate",
    reviews: 145,
    rating: 4.6,
    image: WeVendorr3,
    description: "Flavours that linger long after the event.",
  },

  //########################## Wedding Music ##########################
  {
    id: 9,
    name: "Neon Notes",
    category: "Wedding Music",
    location: "Bangalore, India",
    price: "₹25,000 - ₹55,000",
    reviews: 73,
    rating: 4.8,
    image: WeVendorr1,
    description: "Live bands & DJ setups to elevate your celebration.",
  },
  {
    id: 10,
    name: "Sweet Delights Band",
    category: "Wedding Music",
    location: "Chennai, India",
    price: "₹20,000 - ₹50,000",
    reviews: 64,
    rating: 4.7,
    image: WeVendorr5,
    description: "Melodies that make your moments magical.",
  },
  {
    id: 11,
    name: "Melody Makers",
    category: "Wedding Music",
    location: "Delhi, India",
    price: "₹30,000 - ₹60,000",
    reviews: 82,
    rating: 4.9,
    image: WeVendorr1,
    description: "Setting the perfect vibe for your special day.",
  },
  {
    id: 12,
    name: "The Wedding Beats",
    category: "Wedding Music",
    location: "Mumbai, India",
    price: "₹28,000 - ₹58,000",
    reviews: 91,
    rating: 4.8,
    image: WeVendorr1,
    description: "Feel the rhythm of love on your big day.",
  },

  //########################## Wedding Photographers ##########################
  {
    id: 13,
    name: "Dream Wedding Photography",
    category: "Wedding Photographers",
    location: "Delhi, India",
    price: "₹10,000 - ₹50,000",
    reviews: 124,
    rating: 4.8,
    image: WeVendorr1,
    description: "Capturing your special moments with creativity and passion.",
  },
  {
    id: 14,
    name: "Perfect Moments Studio",
    category: "Wedding Photographers",
    location: "Mumbai, India",
    price: "₹12,000 - ₹45,000",
    reviews: 85,
    rating: 4.7,
    image: WeVendorr2,
    description: "Beautiful candid shots with expert editing.",
  },
  {
    id: 15,
    name: "Eternal Memories Photography",
    category: "Wedding Photographers",
    location: "Bangalore, India",
    price: "₹15,000 - ₹50,000",
    reviews: 99,
    rating: 4.8,
    image: WeVendorr2,
    description: "Creating timeless treasures from your big day.",
  },
  {
    id: 16,
    name: "Royal Wedding Clicks",
    category: "Wedding Photographers",
    location: "Kolkata, India",
    price: "₹13,000 - ₹47,000",
    reviews: 87,
    rating: 4.7,
    image: WeVendorr2,
    description: "Premium wedding photography with elegance.",
  },

  //########################## Wedding Decorators ##########################
  {
    id: 17,
    name: "Blossom Decor",
    category: "Wedding Decorators",
    location: "Jaipur, India",
    price: "₹20,000 - ₹70,000",
    reviews: 112,
    rating: 4.9,
    image: WeVendorr4,
    description: "Elegant and creative floral arrangements.",
  },
  {
    id: 18,
    name: "Perfect Decor",
    category: "Wedding Decorators",
    location: "Mumbai, India",
    price: "₹25,000 - ₹65,000",
    reviews: 98,
    rating: 4.7,
    image: WeVendorr2,
    description: "Transforming venues into magical wedding settings.",
  },
  {
    id: 19,
    name: "Elite Wedding Designs",
    category: "Wedding Decorators",
    location: "Delhi, India",
    price: "₹22,000 - ₹68,000",
    reviews: 105,
    rating: 4.8,
    image: WeVendorr2,
    description: "Luxury decor crafted to perfection.",
  },
  {
    id: 20,
    name: "Royal Touch Decor",
    category: "Wedding Decorators",
    location: "Hyderabad, India",
    price: "₹18,000 - ₹60,000",
    reviews: 91,
    rating: 4.6,
    image: WeVendorr2,
    description: "Stylish and budget-friendly wedding decor.",
  },

  //########################## Wedding Planners ##########################
  {
    id: 21,
    name: "Big Day Planners",
    category: "Wedding Planners",
    location: "Mumbai, India",
    price: "₹35,000 - ₹90,000",
    reviews: 101,
    rating: 4.8,
    image: WeVendorr2,
    description: "Planning every detail to perfection.",
  },
  {
    id: 22,
    name: "Elegant Events",
    category: "Wedding Planners",
    location: "Delhi, India",
    price: "₹30,000 - ₹85,000",
    reviews: 94,
    rating: 4.7,
    image: WeVendorr2,
    description: "Tailor-made planning for your big day.",
  },
  {
    id: 23,
    name: "Royal Wedding Planners",
    category: "Wedding Planners",
    location: "Chennai, India",
    price: "₹40,000 - ₹95,000",
    reviews: 88,
    rating: 4.9,
    image: WeVendorr2,
    description: "Experience grand weddings effortlessly.",
  },
  {
    id: 24,
    name: "Blissful Knot Planners",
    category: "Wedding Planners",
    location: "Kolkata, India",
    price: "₹32,000 - ₹80,000",
    reviews: 77,
    rating: 4.6,
    image: WeVendorr2,
    description: "From start to finish, we plan it all.",
  },

  //########################## Party Places ##########################
  {
    id: 25,
    name: "The Grand Venue",
    category: "Party Places",
    location: "Delhi, India",
    price: "₹60,000 - ₹1,50,000",
    reviews: 102,
    rating: 4.8,
    image: WeVendorr2,
    description: "A luxurious space for your special celebrations.",
  },
  {
    id: 26,
    name: "Bliss Banquets",
    category: "Party Places",
    location: "Mumbai, India",
    price: "₹55,000 - ₹1,30,000",
    reviews: 89,
    rating: 4.7,
    image: WeVendorr2,
    description: "Perfect party venue with top-class amenities.",
  },
  {
    id: 27,
    name: "Celebration Halls",
    category: "Party Places",
    location: "Hyderabad, India",
    price: "₹50,000 - ₹1,20,000",
    reviews: 93,
    rating: 4.6,
    image: WeVendorr2,
    description: "Spacious halls with beautiful decor options.",
  },
  {
    id: 28,
    name: "Elite Garden Venue",
    category: "Party Places",
    location: "Chennai, India",
    price: "₹45,000 - ₹1,10,000",
    reviews: 79,
    rating: 4.5,
    image: WeVendorr2,
    description: "Outdoor celebrations surrounded by nature.",
  },
];


export default function WeedingVendor() {
  const [activeTab, setActiveTab] = useState('primary');
  const categories = activeTab === 'primary' ? vendorCategories : additionalServices;
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(prev =>
      prev === category ? null : category // toggle
    );
  };



  const [sortType, setSortType] = useState('popular');

  const sortedVendors = [...vendors]
    .filter((v) => v.category === selectedCategory)
    .sort((a, b) => {
      if (sortType === 'newest') return b.id - a.id;
      if (sortType === 'popular') return b.reviews - a.reviews;
      return 0;
    });

  const filteredVendors = sortedVendors;

  return (
    <div className='relative  font-serif'>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-playfair text-[#1A2A3A]">
              Find the Perfect Vendors
            </h1>
            <p className="mb-8 text-sm sm:text-base md:text-lg text-white">
              Connect with trusted professionals for your special event
            </p>
            <div className="bg-white text-sm rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 border focus:outline-none  text-gray-800 p-2 rounded-md"
              />
              <button
                style={{ borderRadius: '5px' }}
                className="bg-[#10497a] hover:bg-[#062b4b] text-white px-3"
              >
                Search Venue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="py-4 bg-gray-50">
        <div className="w-full  p-5">
          <h2 className="text-3xl font-bold text-center mb-6 font-playfair text-corporate-dark">
            Start Hiring Your Vendors
          </h2>

          <div className="flex justify-center mt-4 mb-8">
            <div className="inline-flex bg-gray-200 rounded-md overflow-hidden p-1">
              <button
                onClick={() => {
                  setActiveTab('primary');
                  setSelectedCategory(null);
                }}
                className={`px-1 py-1 font-medium transition ${activeTab === 'primary'
                  ? 'bg-corporate-primary text-[#09365d]'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Primary Vendors
              </button>
              <button
                onClick={() => {
                  setActiveTab('additional');
                  setSelectedCategory(null);
                }}
                className={`px-1  py-1 text-sm transition ${activeTab === 'additional'
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
            {categories.map(({ title, icon: Icon }, idx) => (

              <button
                key={idx}
                onClick={() => handleCategoryClick(title)}
                className={`flex items-center rounded transition group bg-white py-2 w-full 
    ${selectedCategory === title ? 'border-2 border-[#0f4c81]' : 'border border-transparent'} 
    hover:border-[#0f4c81]`}
              >
                <div className="flex items-center justify-center mr-2 px-3 py-2">
                  <Icon className="w-9 h-9 text-black bg-gray-100 px-2 rounded-full" />
                </div>
                <span className={`font-medium ${selectedCategory === title ? 'text-gray-800' : 'text-gray-800'}`}>
                  {title}
                </span>
              </button>

            ))}
          </div>
        </div>
      </div>


      {selectedCategory && (
        <div className="p-2 lg:mx-20 lg:mt-15">
          {/* Top Buttons */}

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4 ">
            <h3 className="text-xl font-bold">{selectedCategory}</h3>

            <div className="flex gap-2 justify-end ml-auto">
              <button
                onClick={() => setSelectedCategory(null)}
                className="border text-sm text-gray-700 px-2 py-2 rounded hover:bg-[#DEBF78] transition"
              >
                Back to Categories
              </button>

              <button
                onClick={() => setSortType('popular')}
                className={`text-sm px-2 py-2 rounded transition ${sortType === 'popular'
                  ? 'bg-[#0f4c81] text-white'
                  : 'border text-gray-700 hover:bg-[#0f4c81] hover:text-white'
                  }`}
              >
                Popular
              </button>

              <button
                onClick={() => setSortType('newest')}
                className={`text-sm px-2 py-2 rounded transition ${sortType === 'newest'
                  ? 'bg-[#DEBF78] text-gray-800'
                  : 'border text-gray-700 hover:bg-[#DEBF78]'
                  }`}
              >
                Newest
              </button>
            </div>
          </div>

          {/* Vendor Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-">
            {filteredVendors.length === 0 ? (
              <p>No vendors available for this category.</p>
            ) : (
              filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white border rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={vendor.image}
                      alt={vendor.name}
                      className="w-full h-[250px] object-cover"
                    />
                    <span className="absolute top-3 right-4 bg-white text-gray-600 text-xs font-medium px-2 py-1 rounded-full shadow flex flex-row">
                      <FaStar size={16} color='#FACC15' className='mr-1' />  {vendor.rating}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.category}</p>
                      <h5 className="text-lg font-playfair font-semibold mb-1 leading-snug">
                        {vendor.name}
                      </h5>
                      <p className="text-sm text-gray-600">{vendor.description}</p>
                      <div className="flex items-center text-sm text-gray-500 gap-1 mt-1">
                        <MapPin size={14} />
                        <span>{vendor.location}</span>
                      </div>
                    </div>
                    <div className="border-t pt-3 mt-auto flex justify-between items-center text-sm text-gray-800">
                      <span className=''>{vendor.price}</span>
                      <span>{vendor.reviews} reviews</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
