import React, { useMemo } from "react";
import { GrContact } from "react-icons/gr";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { FaPhoneAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  useGetPendingVendorsQuery,
  useApproveVendorMutation,
  useDeleteVendorByAdminMutation,
} from "../../features/admin/adminAPI";

// Visually distinct pastel color palette
const DISTINCT_COLORS = [
  "#FFD6E0", "#D6EFFF", "#D6FFD6", "#FFF5D6", "#E0D6FF",
  "#FFE0F7", "#D6FFF6", "#FFF0D6", "#F7FFD6", "#FFD6F7",
  "#D6F7FF", "#F0FFD6", "#FFD6D6", "#D6D6FF", "#F7D6FF",
];

// Get readable text color for a given background
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  const yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 180) ? "#222" : "#fff";
}

function getDistinctColor(value, usedMap) {
  if (!usedMap[value]) {
    const idx = Object.keys(usedMap).length % DISTINCT_COLORS.length;
    usedMap[value] = DISTINCT_COLORS[idx];
  }
  return usedMap[value];
}

const PendingVendorApprovals = () => {
  const { data, isLoading, isError } = useGetPendingVendorsQuery();
  const [approveVendor, { isLoading: isApproving }] = useApproveVendorMutation();
  const [deleteVendor, { isLoading: isDeleting }] = useDeleteVendorByAdminMutation();

  const vendors = Array.isArray(data)
    ? data
    : Array.isArray(data?.vendors)
    ? data.vendors
    : [];

  // Assign distinct colors for category and vendorType
  const categoryColorMap = useMemo(() => {
    const map = {};
    vendors.forEach((v) => {
      if (v.category) getDistinctColor(v.category, map);
    });
    return map;
  }, [vendors]);

  const vendorTypeColorMap = useMemo(() => {
    const map = {};
    vendors.forEach((v) => {
      if (v.vendorType) getDistinctColor(v.vendorType, map);
    });
    return map;
  }, [vendors]);

  const handleApprove = async (vendorId) => {
    try {
      await approveVendor({ vendorId }).unwrap();
      toast.success("Vendor approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error(err.data?.message || "Error approving vendor.");
    }
  };

  const handleReject = async (vendorId) => {
    if (window.confirm("Are you sure you want to reject this vendor?")) {
      try {
        await deleteVendor({ vendorId }).unwrap();
        toast.success("Vendor rejected and removed.");
      } catch (err) {
        console.error("Rejection failed:", err);
        toast.error(err.data?.message || "Error rejecting vendor.");
      }
    }
  };

  if (isLoading) return <p className="p-4">Loading vendors...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load vendors.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow p-2">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Pending Vendor Approvals</h2>
        <p className="text-sm text-gray-500 mb-6">New vendor applications awaiting approval</p>

        {vendors.length === 0 ? (
          <p className="text-center text-gray-500">No pending vendors.</p>
        ) : (
          vendors.map((vendor) => (
            <div
              key={vendor._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition mb-4"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h5 className="font-semibold text-lg text-gray-600 flex items-center gap-2 flex-wrap">
                    {vendor.businessName && (
                      <span className="font-bold text-gray-700">{vendor.businessName}</span>
                    )}
                    {vendor.category && (
                      <span
                        className="ml-2 px-2 py-1 rounded-full"
                        style={{
                          fontSize: "7px",
                          background: categoryColorMap[vendor.category] || "#eee",
                          color: getContrastYIQ(categoryColorMap[vendor.category] || "#eee"),
                          fontWeight: 600,
                          letterSpacing: "0.5px",
                          border: "1px solid #eee",
                        }}
                      >
                        {vendor.category}
                      </span>
                    )}
                    {vendor.vendorType && (
                      <span
                        className="ml-2 text-sm px-2 py-1 rounded-full border"
                        style={{
                          fontSize: "9px",
                          background: vendorTypeColorMap[vendor.vendorType] || "#eee",
                          color: getContrastYIQ(vendorTypeColorMap[vendor.vendorType] || "#eee"),
                          fontWeight: 600,
                          letterSpacing: "0.5px",
                          border: "1px solid #eee",
                        }}
                      >
                        {vendor.vendorType}
                      </span>
                    )}
                  </h5>
                  <h6 className="flex items-center text-sm text-gray-600 mt-1 mb-1">
                    <GrContact className="mr-1" /> {vendor.email}
                  </h6>
                  <h6 className="flex items-center text-sm text-gray-600 mt-1 mb-1">
                    <FaPhoneAlt className="mr-1" /> {vendor.phone}
                  </h6>
                  <p className="text-sm text-gray-600 mb-1">
                    Applied on {new Date(vendor.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleApprove(vendor._id)}
                    disabled={isApproving || isDeleting}
                    className={`bg-green-100 text-green-600 inline-flex items-center px-4 py-1 rounded text-sm hover:bg-green-200 transition ${
                      (isApproving || isDeleting) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaRegCheckCircle className="mr-1" /> 
                    {isApproving ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(vendor._id)}
                    disabled={isApproving || isDeleting}
                    className={`bg-red-100 text-red-600 inline-flex items-center px-4 py-1 rounded text-sm hover:bg-red-200 transition ${
                      (isApproving || isDeleting) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <RxCrossCircled className="mr-1" /> 
                    {isDeleting ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button className="text-gray-600 text-sm underline hover:text-gray-800 hover:bg-[#DEBF78] p-1 rounded">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PendingVendorApprovals;