import React, { useState } from 'react';
import { FaStar, FaEye, FaPen, FaTrash } from 'react-icons/fa';
import cardImage1 from "../../assets/navImage/VendorManagement003.png";
import cardImage2 from "../../assets/navImage/VendorManagement004.png";
import cardImage3 from "../../assets/navImage/VendorManagement005.png";
import cardImage5 from "../../assets/navImage/Dream001.jpeg";

const vendorsData = [
  {
    name: "Dream Wedding Photography",
    category: "Photographer",
    rating: 4.8,
    reviews: 124,
    location: "Delhi, India",
    description: "Capturing your special moments with creativity and passion.",
    image: cardImage1
  },
  {
    name: "Royal Palace Banquet",
    category: "Venue",
    rating: 4.5,
    reviews: 87,
    location: "Mumbai, India",
    description: "Elegant venue for your dream wedding celebration.",
    image: cardImage2,
  },
  {
    name: "Glamour Makeup Studio",
    category: "MakeupArtist",
    rating: 4.6,
    reviews: 95,
    location: "Bangalore, India",
    description: "Professional makeup services for your big day.",
    image: cardImage3
  },
  {
    name: "Glamour Makeup Studio",
    category: "MakeupArtist",
    rating: 4.6,
    reviews: 95,
    location: "Bangalore, India",
    description: "Professional makeup services for your big day.",
    image: cardImage3
  },
  {
    name: "Glamour Makeup Studio",
    category: "MakeupArtist",
    rating: 4.6,
    reviews: 95,
    location: "Bangalore, India",
    description: "Professional makeup services for your big day.",
    image: cardImage1
  },
  {
    name: "Glamour Makeup Studio",
    category: "MakeupArtist",
    rating: 4.6,
    reviews: 95,
    location: "Bangalore, India",
    description: "Professional makeup services for your big day.",
    image: cardImage1
  },
];

const categories = ["All Categories", "Photographer", "Venue", "Makeup Artist"];

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 3;

  const filteredVendors = vendorsData.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startIdx = (currentPage - 1) * vendorsPerPage;
  const paginatedVendors = filteredVendors.slice(startIdx, startIdx + vendorsPerPage);
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  const handleView = (vendor) => alert(`Viewing profile: ${vendor.name}`);
  const handleEdit = (vendor) => alert(`Editing vendor: ${vendor.name}`);
  const handleDelete = (vendor) => {
    if (window.confirm(`Delete ${vendor.name}?`)) {
      alert(`Deleted vendor: ${vendor.name}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">

      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Vendor Management</h2>
          <p className="text-sm text-gray-500">Manage all registered vendors on the platform</p>
        </div>
        
        <div className="flex flex-wrap gap-x-4 items-center">
  <input
    type="text"
    placeholder="Search vendors..."
    className="border px-3 py-2 rounded-md text-sm w-64"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="border px-3 py-2 rounded-md text-sm w-48"
  >
    {categories.map((cat, i) => (
      <option key={i} value={cat}>{cat}</option>
    ))}
  </select>
</div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedVendors.map((vendor, idx) => (
          <div key={idx} className="border rounded-xl shadow-sm overflow-hidden">
            <img src={vendor.image} alt={vendor.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg ">{vendor.name}</h3>
                <span className="text-xs px-2 py-1 bg-[#0f4c81] text-white rounded-full inline-block">{vendor.category}</span>
              </div>
              <div className="flex items-center text-sm mb-1 inline-flex">
                <FaStar className="mr-1 " style={{ color: "#FFD700" }} />
                <span>{vendor.rating} ({vendor.reviews})</span>
                <span className="ml-2 text-gray-500">{vendor.location}</span>
              </div>
              {/* <div className="text-sm text-gray-500 mb-1">{vendor.location}</div> */}
              <p className="text-sm text-gray-700 mb-3">{vendor.description}</p>
              <div className="flex justify-between items-center">
                <button className="px-3 py-1 border rounded text-sm" onClick={() => handleView(vendor)}>View Profile</button>
                <div className="space-x-2 ">
                  <button  className="p-1" onClick={() => handleEdit(vendor)}><FaPen className="text-yellow-500 " /></button>
                  <button  className="p-1" onClick={() => handleDelete(vendor)}><FaTrash className="text-red-500" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
        <span>Showing {startIdx + 1}-{Math.min(startIdx + vendorsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors</span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >Previous</button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >Next</button>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;
