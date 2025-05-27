import React from "react";
import { GrContact } from "react-icons/gr";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { FaPhoneAlt } from "react-icons/fa";

import {
  useGetPendingVendorsQuery,
  useApproveVendorMutation,
  useDeleteVendorByAdminMutation,
} from "../../features/admin/adminAPI";

const PendingVendorApprovals = () => {
  const { data, isLoading, isError } = useGetPendingVendorsQuery();
  const [approveVendor] = useApproveVendorMutation();
  const [deleteVendor] = useDeleteVendorByAdminMutation();

  // 🔒 Defensive check: supports both { vendors: [...] } or raw array
  const vendors = Array.isArray(data)
    ? data
    : Array.isArray(data?.vendors)
    ? data.vendors
    : [];

  const categoryClasses = {
    Decorator: "bg-purple-100 text-purple-700",
    Caterer: "bg-pink-100 text-pink-700",
    "Makeup Artist": "bg-blue-100 text-blue-700",
  };

  const handleApprove = async (vendorId) => {
    try {
      await approveVendor({ vendorId }).unwrap();
      alert("Vendor approved successfully!");
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Error approving vendor.");
    }
  };

  const handleReject = async (vendorId) => {
    if (window.confirm("Are you sure you want to reject this vendor?")) {
      try {
        await deleteVendor({ vendorId }).unwrap();
        alert("Vendor rejected and removed.");
      } catch (err) {
        console.error("Rejection failed:", err);
        alert("Error rejecting vendor.");
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
                  <h3 className="font-semibold text-lg text-gray-800">
                    {vendor.name}
                    <span
                      className={`ml-2 text-sm px-2 py-1 rounded-full ${
                        categoryClasses[vendor.category] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {vendor.category}
                    </span>
                  </h3>
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
                    className="bg-green-100 text-green-600 inline-flex items-center px-4 py-1 rounded text-sm hover:bg-green-200 transition"
                  >
                    <FaRegCheckCircle className="mr-1" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(vendor._id)}
                    className="bg-red-100 text-red-600 inline-flex items-center px-4 py-1 rounded text-sm hover:bg-red-200 transition"
                  >
                    <RxCrossCircled className="mr-1" /> Reject
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
    </div>
  );
};

export default PendingVendorApprovals;
