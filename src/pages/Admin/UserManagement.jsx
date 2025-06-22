import React, { useState } from 'react';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';
import { useGetAllUsersQuery, useGetAllVendorsQuery } from '../../features/admin/adminAPI';

const UserManagement = () => {
  const { data: usersDataRaw, isLoading: usersLoading, isError: usersError } = useGetAllUsersQuery();
  const { data: vendorsDataRaw, isLoading: vendorsLoading, isError: vendorsError } = useGetAllVendorsQuery();

  const usersData = Array.isArray(usersDataRaw) ? usersDataRaw : usersDataRaw?.users || [];
  const vendorsData = Array.isArray(vendorsDataRaw) ? vendorsDataRaw : vendorsDataRaw?.vendors || [];

  // Combine and format data with proper date handling
  const combinedData = [
    ...usersData.map(user => ({ 
      ...user, 
      role: 'user',
      sortDate: new Date(user.createdAt).getTime(),
      displayName: user.name
    })),
    ...vendorsData.map(vendor => ({ 
      ...vendor, 
      role: 'vendor',
      sortDate: new Date(vendor.appliedDate || vendor.createdAt).getTime(),
      displayName: vendor.businessName || vendor.name,
      vendorType: vendor.vendorType || vendor.category || '-' // Fallback to category if vendorType not available
    }))
  ].sort((a, b) => b.sortDate - a.sortDate); // Sort by date, newest first

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const filteredUsers = combinedData.filter(user => {
    const isApprovedVendor = user.role === "vendor";
    const isUser = user.role === "user";

    const shouldInclude = roleFilter === "all"
      ? isUser || isApprovedVendor
      : roleFilter === "vendor"
        ? isApprovedVendor
        : isUser;

    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.businessName || '').toLowerCase().includes(searchTerm.toLowerCase());

    return shouldInclude && matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + usersPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleView = (user) => alert(`Viewing profile: ${user.displayName}`);
  const handleEdit = (user) => alert(`Editing profile: ${user.displayName}`);
  const handleDelete = (user) => {
    if (window.confirm(`Delete ${user.displayName}?`)) {
      alert(`Deleted: ${user.displayName}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (usersLoading || vendorsLoading) return <p className="p-4">Loading users and vendors...</p>;
  if (usersError || vendorsError) return <p className="p-4 text-red-500">Failed to load data.</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">User & Vendor Management</h2>
      <p className="text-sm text-gray-500 mb-4">Manage all registered users and vendors on the platform</p>

      <div className="flex justify-between items-center mb-4 relative">
        <input
          type="text"
          placeholder="Search by name, business name, or email..."
          className="w-1/3 px-3 py-2 border rounded-md text-sm"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <select
          className="w-40 px-3 py-2 border rounded-md text-sm"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Users & Vendors</option>
          <option value="user">Users</option>
          <option value="vendor">Vendors</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 rounded-full">
              <th className="p-2">Name/Business</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date Joined</th>
              <th className="p-2">Vendor Type</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">No users or vendors found.</td>
              </tr>
            ) : (
              paginatedUsers.map((user, idx) => (
                <tr key={user._id || idx} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div>
                      <span className="font-medium">{user.displayName}</span>
                      {user.role === 'vendor' && user.name && user.name !== user.businessName && (
                        <span className="text-xs text-gray-500 block">Owner: {user.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 text-sm text-gray-700">{user.email || "-"}</td>
                  <td className="p-2">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2 text-sm">
                    {user.role === 'vendor' ? (
                      user.isApproved ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      )
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Inactive'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.status === 'Inactive' ? 'Inactive' : 'Active'}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-sm">
                    {formatDate(user.role === 'vendor' ? user.appliedDate || user.createdAt : user.createdAt)}
                  </td>
                  <td className="p-2 text-sm">{user.role === 'vendor' ? user.vendorType : "-"}</td>
                  <td className="text-gray-600">
                    <button onClick={() => handleView(user)} className="p-1 hover:bg-gray-100 rounded" title="View">
                      <FaEye className="inline w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(user)} className="p-1 hover:bg-gray-100 rounded mx-2" title="Edit">
                      <FaPen className="inline w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user)} className="p-1 hover:bg-gray-100 rounded" title="Delete">
                      <FaTrash className="inline w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
        <span>
          Showing {startIdx + 1}-{Math.min(startIdx + usersPerPage, filteredUsers.length)} of {filteredUsers.length} entries
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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

export default UserManagement;
