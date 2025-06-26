import React, { useState } from "react";
import { FaStar, FaPen, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useGetAllVendorsQuery,
  useDeleteVendorByAdminMutation,
} from "../../features/admin/adminAPI";
import Loader from "../../components/{Shared}/Loader";

const categories = [
  "All Categories",
  "Photographer",
  "Venue",
  "Makeup Artist",
  "Wedding Photographers",
  "Wedding Videography",
  "Wedding Music",
  "Caterers",
  "Wedding Transportation",
  "Wedding Invitations",
  "Wedding Gifts",
  "Florists",
  "Wedding Planners",
  "Wedding Choreographers",
  "Photobooth",
  "Wedding Cakes",
  "Wedding Decorators",
  "Party Places",
  "Honeymoon",
  "Wedding Entertainment",
  "Tent House",
  "Promotions",
];

const VendorManagement = () => {
  const navigate = useNavigate();
  const { data: vendorsData, isLoading, isError } = useGetAllVendorsQuery();
  const [deleteVendor] = useDeleteVendorByAdminMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 3;

  const allVendors = vendorsData?.vendors || [];

  const filteredVendors = allVendors.filter((vendor) => {
    const matchesSearch = vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         vendor.businessName?.toLowerCase().includes(searchTerm.toLowerCase());

    const normalizedCategory = vendor.category?.toLowerCase().replace(/\s/g, "") || 
                             vendor.vendorType?.toLowerCase().replace(/\s/g, "");
    const selectedCatNormalized = selectedCategory.toLowerCase().replace(/\s/g, "");
    const matchesCategory =
      selectedCategory === "All Categories" || normalizedCategory === selectedCatNormalized;

    return matchesSearch && matchesCategory;
  });

  const startIdx = (currentPage - 1) * vendorsPerPage;
  const paginatedVendors = filteredVendors.slice(startIdx, startIdx + vendorsPerPage);
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

  const handleView = (vendor) => {
    const vendorId = vendor._id || vendor.id;
    if (vendorId) {
      navigate(`/preview-profile/${vendorId}`);
    } else {
      console.error("Cannot navigate: Vendor ID is undefined");
      alert("Unable to view vendor profile: ID not found");
    }
  };
  const handleEdit = (vendor) => {
    const vendorId = vendor._id || vendor.id;
    if (vendorId) {
      // For now, we'll navigate to the UserManagement page where vendor approval can be managed
      // This could be updated to a dedicated vendor edit page if available
      navigate('/admin/user-management');
      
      // Alternatively, you could implement an edit modal directly in this component
      // similar to how it's done in UserManagement.jsx
    } else {
      console.error("Cannot edit: Vendor ID is undefined");
      alert("Unable to edit vendor: ID not found");
    }
  };

  const handleDelete = async (vendor) => {
    if (window.confirm(`Delete ${vendor.businessName || vendor.name}?`)) {
      try {
        await deleteVendor({ vendorId: vendor._id }).unwrap();
        alert(`Deleted vendor: ${vendor.businessName || vendor.name}`);

        // Refresh page or ideally trigger refetch
        setCurrentPage(1); // Optional: reset to first page
      } catch (err) {
        console.error("Failed to delete vendor:", err);
        alert("Failed to delete vendor. Please try again.");
      }
    }
  };

  if (isLoading) return <Loader fullScreen />;
  if (isError) return <div className="text-center text-red-500 p-4">Error loading vendors</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Vendor Management</h2>
          <p className="text-sm text-gray-500">Manage all registered vendors on the platform</p>
        </div>

        <div className="flex flex-wrap gap-4">
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
            className="border px-3 py-2 rounded-md text-sm w-64"
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedVendors.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No vendors found.</p>
        ) : (
          paginatedVendors.map((vendor, idx) => (
            <div key={vendor._id || idx} className="border rounded-xl shadow-sm overflow-hidden">
              {vendor.profilePicture ? (
                <img
                  src={vendor.profilePicture}
                  alt={vendor.businessName || vendor.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-profile.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400 text-lg">
                  No Image
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3
                    className="font-semibold text-lg leading-tight"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "3rem", // two-line height space
                    }}
                    title={vendor.businessName || vendor.name}
                  >
                    {vendor.businessName || vendor.name}
                  </h3>

                  <span className="text-xs px-2 py-1 bg-[#0f4c81] text-white rounded-full">
                    {vendor.vendorType || vendor.category}
                  </span>
                </div>

                <div className="flex items-center text-sm mb-1">
                  <FaStar className="mr-1 text-yellow-500" />
                  <span>
                    {vendor.rating ?? "N/A"} ({vendor.reviews ?? 0})
                  </span>
                  <span className="ml-2 text-gray-500">
                    {vendor.serviceAreas?.[0] || vendor.location || ""}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{vendor.description ?? ""}</p>

                <div className="flex justify-between items-center">
                  <button
                    className="px-3 py-1 border rounded text-sm"
                    onClick={() => handleView(vendor)}
                  >
                    View Profile
                  </button>
                  <div className="space-x-2">
                    <button className="p-1" onClick={() => handleEdit(vendor)}>
                      <FaPen className="text-yellow-500" />
                    </button>
                    <button className="p-1" onClick={() => handleDelete(vendor)}>
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
        <span>
          Showing {startIdx + 1}-{Math.min(startIdx + vendorsPerPage, filteredVendors.length)} of{" "}
          {filteredVendors.length} vendors
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorManagement;