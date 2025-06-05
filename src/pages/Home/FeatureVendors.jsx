import { useState } from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import image1 from "../../assets/newPics/featuredcard.jpg";
import image2 from "../../assets/newPics/featuredvendors.jpg";
import image3 from "../../assets/newPics/featuredVendors1.png";
import image4 from "../../assets/newPics/featuredVendors02.jpg";
import { Link } from "react-router-dom";

const vendors = [
  {
    id: 1,
    image: image1,
    category: "Photographer",
    name: "Dream Wedding Photography",
    location: "Delhi, India",
    rating: 4.8,
    reviews: 124,
    price: "₹10,000 - ₹50,000",
  },
  {
    id: 2,
    image: image2,
    category: "Venue",
    name: "Royal Palace Banquet",
    location: "Mumbai, India",
    rating: 4.5,
    reviews: 87,
    price: "₹1,00,000 - ₹5,00,000",
  },
  {
    id: 3,
    image: image3,
    category: "Makeup Artist",
    name: "Glam Makeup Studio",
    location: "Bangalore, India",
    rating: 4.9,
    reviews: 215,
    price: "₹5,000 - ₹25,000",
  },
  {
    id: 4,
    image: image4,
    category: "Caterer",
    name: "Delicious Catering",
    location: "Hyderabad, India",
    rating: 4.6,
    reviews: 156,
    price: "₹500 - ₹1,500 per plate",
  },
];

const FeaturedVendors = () => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className=" sm:px-6 md:px-10 lg:mx-4 xl:px-20 py-10">
      <div className="flex flex-col sm:flex-row justify-between  items-start sm:items-center mb-6 gap-4">
        <h1 className="text-gray-800">Featured Vendors</h1>
        <Link to="#" style={{textDecoration:'none'}} className="flex">
         <p className="text-[#052038] items-center flex"> View All</p> <IoIosArrowForward className="ml-1 mt-1 text-[#052038]" />
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
          >
            <div className="relative group">
              <img
                src={vendor.image}
                alt={vendor.name}
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
              />
              <button
                onClick={() => toggleFavorite(vendor.id)}
                className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-gray-800"
              >
                {favorites.includes(vendor.id) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-1 font-playfair-display">{vendor.category}</p>
              <h5 className="text-lg font-semibold text-gray-900 font-serif transition-colors break-words">
                {vendor.name}
              </h5>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MdLocationOn className="mr-1" />
                {vendor.location}
              </div>
              <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <span className="text-gray-900 font-bold font-playfair-display">
                    {vendor.rating}
                  </span>
                  <span className="text-gray-500">({vendor.reviews} reviews)</span>
                </div>
                <div className="text-black font-bold text-right">{vendor.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedVendors;
