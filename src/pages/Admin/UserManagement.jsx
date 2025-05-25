
import React, { useState } from 'react';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';

const usersData = [
  { name: "Arjun & Meera Kumar", email: "arjun.meera@example.com", role: "User", status: "Active", dateJoined: "10/15/2023" },
  { name: "Vikram & Nisha Patel", email: "vikram.nisha@example.com", role: "User", status: "Active", dateJoined: "11/5/2023" },
  { name: "Dream Wedding Photography", email: "info@dreamwedding.com", role: "Vendor", status: "Active", dateJoined: "9/20/2023" },
  { name: "Royal Palace Banquet", email: "bookings@royalpalace.com", role: "Vendor", status: "Active", dateJoined: "8/12/2023" },
  { name: "Karan & Priya Malhotra", email: "karan.priya@example.com", role: "User", status: "Inactive", dateJoined: "11/25/2023" },
  { name: "Karan & Priya Malhotra", email: "karan.priya@example.com", role: "User", status: "Inactive", dateJoined: "11/25/2023" },
  { name: "Karan & Priya Malhotra", email: "karan.priya@example.com", role: "User", status: "Inactive", dateJoined: "11/25/2023" },
  { name: "Karan & Priya Malhotra", email: "karan.priya@example.com", role: "User", status: "Inactive", dateJoined: "11/25/2023" },
  { name: "Aditya & Suchita", email: "karan.priya@example.com", role: "User", status: "Inactive", dateJoined: "11/25/2023" },
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState([]);
  const usersPerPage = 5;

  const handleView = (user) => {
    alert(`Viewing user: ${user.name}`);
  };

  const handleEdit = (user) => {
    alert(`Editing user: ${user.name}`);
  };

  const handleDelete = (user) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${user.name}?`);
    if (confirmDelete) {
      alert(`Deleted user: ${user.name}`);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const matchedSuggestions = usersData.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setSuggestions([]);
  };

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + usersPerPage);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold">User Management</h2>
      <p className="text-sm text-gray-500 mb-4">Manage all registered users on the platform</p>

      <div className="flex justify-between items-center mb-4 relative">
        <div className="w-1/3 relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full rounded-md mt-1 shadow">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          className="w-40 px-3 py-2 border rounded-md text-sm"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Users</option>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-gray-200 rounded-full text-left text-gray-600 bg-gray-100">
              <th className="p-1">Name</th>
              <th className="p-1">Email</th>
              <th className="p-1">Role</th>
              <th className="p-1">Status</th>
              <th className="p-1">Date Joined</th>
              <th className="p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-1 font-medium">{user.name}</td>
                <td className="p-1 text-sm text-gray-700">{user.email}</td>
                <td className="p-1">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{user.role}</span>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{user.status}</span>
                </td>
                <td className="p-3 text-sm">{user.dateJoined}</td>
                <td className="p-3 space-x-3 text-gray-600">
                  <button onClick={() => handleView(user)}><FaEye className="w-6 h-6 inline p-1" /></button>
                  <button onClick={() => handleEdit(user)}><FaPen className="w-6 h-6 inline p-1" /></button>
                  <button onClick={() => handleDelete(user)}><FaTrash className="w-6 h-6 inline text-red-500 p-1" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
        <span>
          Showing {startIdx + 1}-{Math.min(startIdx + usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
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



