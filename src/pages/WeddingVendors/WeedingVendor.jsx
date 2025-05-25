import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Video,
  Music,
  Wallet,
  Car,
  Mail,
  Gift,
  Flower,
  Pencil,
  Activity,
  Smile,
  Cake,
  Sparkles,
  MapPin,
  Plane,
  Drum,
  Tent,
  Megaphone,
  Utensils,
} from 'lucide-react';
import WeVendorr1 from '../../assets/newPics/WeVendorr1.avif'
import WeVendorr2 from '../../assets/newPics/WeVendor2avif.avif'
import WeVendorr3 from '../../assets/newPics/WeVendor3.avif'
import WeVendorr4 from '../../assets/newPics/WeVendor4.avif'
import WeVendorr5 from '../../assets/newPics/WeVendor5.avif'

const vendorCategories = [
  { title: 'Wedding Photographers', path: '/vendors/photographer', icon: Camera },
  { title: 'Wedding Videography', path: '/vendors/videography', icon: Video },
  { title: 'Wedding Music', path: '/vendors/music', icon: Music },
  { title: 'Caterers', path: '/vendors/caterer', icon: Utensils },
  { title: 'Wedding Transportation', path: '/vendors/transportation', icon: Car },
  { title: 'Wedding Invitations', path: '/vendors/invitations', icon: Mail },
  { title: 'Wedding Gifts', path: '/vendors/wedding-gifts', icon: Gift },
  { title: 'Florists', path: '/vendors/florists', icon: Flower },
  { title: 'Wedding Planners', path: '/vendors/wedding-planners', icon: Pencil },
];
const additionalServices = [
  { title: 'Wedding Choreographers', path: '/vendors/choreographers', icon: Activity }, // ✅ Fixed here
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
  const [activeBtn, setActiveBtn] = useState("popular"); // default active

  return (
    <main className="relative ">
      {/* HEADER SECTION */}
      <section className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-white">
        <div className="mx-auto  text-center p-1 max-h-screen">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-[#1A2A3A] ">
              Find the Perfect Vendors
            </h1>
            <p className="text-center mb-8 text-white">
              Connect with trusted professionals for your special event
            </p>
            <div className=" bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Search by name or location..."
                className=" flex-1 border-none focus-visible:ring-0 text-gray-800"
              />
              <button
                style={{ borderRadius: '5px' }}
                className="bg-[#09365d] hover:bg-[#09365d] text-white p-2"
              >
                Search Venue
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6 font-playfair text-corporate-dark">
            Start Hiring Your Vendors
          </h2>

          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-200  shadow-sm">
              <button
                onClick={() => setActiveTab('primary')}
                className={`px-6 py-2 font-medium rounded-l-full transition ${activeTab === 'primary'
                  ? 'bg-corporate-primary text-[#09365d]'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Primary Vendors
              </button>
              <button
                onClick={() => setActiveTab('additional')}
                className={`px-6 py-2 text-sm  transition ${activeTab === 'additional'
                  ? 'bg-corporate-primary text-black'
                  : 'bg-white text-gray-700 border border-gray-300'
                  }`}
              >
                Additional Services
              </button>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(({ title, path, icon: Icon }, idx) => (
              <Link
                key={idx}
                to={path}
                style={{ textDecoration: 'none' }}
                className={`flex items-center p-2 rounded-md  transition group ${activeTab === 'primary' ? ' hover:bg-blue-100' : ' hover:bg-blue-100'
                  }`}

              >
                <div className=" p-1 flex items-center justify-center mr-4 ">
                  <Icon className="w-10 h-10 text-black rounded-full bg-gray-300 p-2 text-corporate-primary" size={20} />
                </div>
                <span className="font-medium text-gray-800 group-hover:text-corporate-primary">
                  {title}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>
      <section className="max-w-11xl mx-auto px-5 py-8 ">
        <div className="flex justify-between items-center mb-6 px-5 ">
          <h4 className="text-2xl font-semibold">Featured Vendors</h4>
          <div className="flex gap-2 ">
            <button
              onClick={() => setActiveBtn("popular")}
              style={{borderRadius:'5px'}}
              className={`px-4 py-2 border rounded-2xl font-medium hover:bg-yellow-300 ${activeBtn === "popular" ? "bg-[#09365d] text-white" : "bg-corporate-primary text-black"}`}>
              Popular
            </button>
            <button
              onClick={() => setActiveBtn("newest")}
              style={{borderRadius:'5px'}}
              className={`px-4 py-2 border rounded-2xl font-medium hover:bg-yellow-300 ${activeBtn === "newest" ? "bg-blue-600 text-white" : "text-gray-700 bg-transparent"}`}>
              Newest
            </button>
          </div>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-5">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white border rounded-xl overflow-hidden flex flex-col  shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-[250px] object-cover rounded-lg"
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
                  <p className="text-sm text-gray-600  leading-relaxed">
                    {vendor.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 gap-1">
                    <MapPin size={14} />
                    <span>{vendor.location}</span>
                  </div>
                </div>
                <div className="border-t pt-3 mt-auto flex justify-between items-center text-sm text-gray-500 w-full">
                  <span className="text-gray-700">{vendor.price}</span>
                  <span className="text-gray-700">{vendor.reviews} reviews</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}

