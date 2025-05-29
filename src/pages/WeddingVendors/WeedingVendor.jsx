import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera, Video, Music, Wallet, Car, Mail, Gift, Flower, Pencil, Activity,
  Smile, Cake, Sparkles, MapPin, Plane, Drum, Tent, Megaphone, Utensils,
} from 'lucide-react';

import WeVendorr1 from '../../assets/newPics/WeVendorr1.avif';
import WeVendorr2 from '../../assets/newPics/WeVendor2avif.avif';
import WeVendorr3 from '../../assets/newPics/WeVendor3.avif';
import WeVendorr4 from '../../assets/newPics/WeVendor4.avif';
import WeVendorr5 from '../../assets/newPics/WeVendor5.avif';

const vendorCategories = [
  { title: 'Wedding Photographers', path: '/photographers', icon: Camera },
  { title: 'Wedding Videography', path: '/videography', icon: Video },
  { title: 'Wedding Music', path: '/music', icon: Music },
  { title: 'Caterers', path: '/vendors/caterer', icon: Utensils },
  { title: 'Wedding Transportation', path: '/vendors/transportation', icon: Car },
  { title: 'Wedding Invitations', path: '/vendors/invitations', icon: Mail },
  { title: 'Wedding Gifts', path: '/vendors/wedding-gifts', icon: Gift },
  { title: 'Florists', path: '/vendors/florists', icon: Flower },
  { title: 'Wedding Planners', path: '/vendors/wedding-planners', icon: Pencil },
];

const additionalServices = [
  { title: 'Wedding Choreographers', path: '/vendors/choreographers', icon: Activity },
  { title: 'Photobooth', path: '/vendors/photobooth', icon: Smile },
  { title: 'Wedding DJ', path: '/vendors/dj', icon: Music },
  { title: 'Wedding Cakes', path: '/vendors/cakes', icon: Cake },
  { title: 'Wedding Decorators', path: '/vendors/decorators', icon: Sparkles },
  { title: 'Party Places', path: '/vendors/party-places', icon: MapPin },
  { title: 'Honeymoon', path: '/vendors/honeymoon', icon: Plane },
  { title: 'Wedding Entertainment', path: '/vendors/entertainment', icon: Drum },
  { title: 'Tent House', path: '/vendors/tent-house', icon: Tent },
  { title: 'Promotions', path: '/vendors/promotions', icon: Megaphone },
];

const vendors = [
  {
    id: 1,
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
    id: 2,
    name: "Melodious Tunes",
    category: "Wedding Music",
    location: "Mumbai, India",
    price: "₹15,000 - ₹40,000",
    reviews: 89,
    rating: 4.7,
    image: WeVendorr2,
    description: "Setting the perfect ambiance for your wedding ceremony.",
  },
  {
    id: 3,
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
    id: 4,
    name: "Blossom Decor",
    category: "Wedding Decor",
    location: "Jaipur, India",
    price: "₹20,000 - ₹70,000",
    reviews: 112,
    rating: 4.9,
    image: WeVendorr4,
    description: "Elegant and creative floral arrangements.",
  },
  {
    id: 5,
    name: "Sweet Delights Bakery",
    category: "Bakers",
    location: "Chennai, India",
    price: "₹2,000 - ₹8,000",
    reviews: 64,
    rating: 4.7,
    image: WeVendorr5,
    description: "Delicious and customized wedding cakes and desserts.",
  },
  {
    id: 6,
    name: "Neon Notes",
    category: "Wedding Music",
    location: "Bangalore, India",
    price: "₹25,000 - ₹55,000",
    reviews: 73,
    rating: 4.8,
    image: WeVendorr1,
    description: "Live bands & DJ setups to elevate your celebration.",
  },
];

export default function WeedingVendor() {
  const [activeTab, setActiveTab] = useState('primary');
  const categories = activeTab === 'primary' ? vendorCategories : additionalServices;
  const [activeBtn, setActiveBtn] = useState("popular");

  return (
    <div className="relative">
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
            <div className="bg-white rounded-lg p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="flex-1 border-none focus-visible:ring-0 text-gray-800 p-2 rounded-md"
              />
              <button
                style={{ borderRadius: '5px' }}
                className="bg-[#09365d] hover:bg-[#062b4b] text-white p-2"
              >
                Search Venue
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Tabs */}
      <div className="py-16 bg-gray-50">
        <div className="w-full  p-5">
          <h2 className="text-3xl font-bold text-center mb-6 font-playfair text-corporate-dark">
            Start Hiring Your Vendors
          </h2>

          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-200 rounded-md overflow-hidde">
              <button
                onClick={() => setActiveTab('primary')}
                className={`px-2 py-2 font-medium transition ${activeTab === 'primary'
                  ? 'bg-corporate-primary text-[#09365d]'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Primary Vendors
              </button>
              <button
                onClick={() => setActiveTab('additional')}
                className={`px-2 py-2 text-sm transition ${activeTab === 'additional'
                  ? 'bg-corporate-primary text-black'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Additional Services
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 py-2">
            {categories.map(({ title, path, icon: Icon }, idx) => (
              <Link
                key={idx}
                to={path}
                style={{ textDecoration: 'none' }}
                className="flex items-center rounded-md transition group bg-white py-2 w-full "
              >
                <div className=" flex items-center justify-center mr-2 px-3 py-2">
                  <Icon className="w-9 h-9 text-black bg-gray-100 px-2 rounded-full text-corporate-primary" />
                </div>
                <span className="font-medium text-gray-800">
                  {title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Vendors */}
      <div className="p-3">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h3 className="text-2xl font-semibold ">Featured Vendors</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveBtn("popular")}
              style={{ borderRadius: '5px' }}
              className={`px-4 py-2 border rounded-2xl font-medium hover:bg-yellow-300 ${activeBtn === "popular" ? "bg-[#09365d] text-white" : "bg-corporate-primary text-black"}`}>
              Popular
            </button>
            <button
              onClick={() => setActiveBtn("newest")}
              style={{ borderRadius: '5px' }}
              className={`px-4 py-2 border rounded-2xl font-medium hover:bg-yellow-300 ${activeBtn === "newest" ? "bg-blue-600 text-white" : "text-gray-700 bg-transparent"}`}>
              Newest
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
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
                <span className="absolute top-3 left-4 bg-yellow-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow">
                  ⭐ {vendor.rating}
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
                <div className="border-t pt-3 mt-auto flex justify-between items-center text-sm text-gray-500">
                  <span>{vendor.price}</span>
                  <span>{vendor.reviews} reviews</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
