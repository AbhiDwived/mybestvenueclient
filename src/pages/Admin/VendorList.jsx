
import React from 'react';

const VendorList = () => {
  const vendors = [
    { id: 1, name: 'Sarthak', email: 'vendor.one@example.com', phone: '123-456-7890', status: 'Active', Location: 'Noida' },
    { id: 2, name: 'Anjali', email: 'vendor.two@example.com', phone: '098-765-4321', status: 'Inactive', Location: 'Greater Noida' },
    { id: 3, name: 'Akanksha', email: 'vendor.three@example.com', phone: '111-222-3333', status: 'Inactive', Location: 'New Delhi' },
    { id: 4, name: 'Priya', email: 'vendor.four@example.com', phone: '444-555-6666', status: 'Inactive', Location: 'Noida' },
    { id: 5, name: 'Sonu', email: 'vendor.five@example.com', phone: '777-888-9999', status: 'Inactive', Location: 'Greater Noida' },
    { id: 6, name: 'Dhruv', email: 'vendor.six@example.com', phone: '333-444-5555', status: 'Inactive', Location: 'Noida' },
    { id: 7, name: 'Divyanshi', email: 'vendor.seven@example.com', phone: '123-123-1234', status: 'Inactive', Location: 'Noida' },
    { id: 8, name: 'Vishnu', email: 'vendor.eight@example.com', phone: '567-890-1234', status: 'Inactive', Location: 'Noida' },
    { id: 9, name: 'Varsha', email: 'vendor.nine@example.com', phone: '789-456-1230', status: 'Inactive', Location: 'Noida' },
    { id: 10, name: 'Varsha', email: 'vendor.nine@example.com', phone: '789-456-1230', status: 'Inactive', Location: 'Noida' },
    { id: 11, name: 'Varsha', email: 'vendor.nine@example.com', phone: '789-456-1230', status: 'Inactive', Location: 'Noida' },
    { id: 12, name: 'Varsha', email: 'vendor.nine@example.com', phone: '789-456-1230', status: 'Active', Location: 'Noida' },
    { id: 13, name: 'Varsha', email: 'vendor.nine@example.com', phone: '789-456-1230', status: 'Active', Location: 'Noida' },
    { id: 14, name: 'Varsha', email: 'vendor.nine@example.com', phone: '789-456-1230', status: 'Active', Location: 'Noida' },
    { id: 15, name: 'Varsha', email: 'vendor.nine@example.com', phone: '789-456-1230', status: 'Active', Location: 'Noida' },
    { id: 16, name: 'Varsha', email: 'vendor.nine@example.com', phone: '789-456-1230', status: 'Active', Location: 'Noida' },
  ];

  const statusBadge = (status) => {
    const base = "inline-block px-2 py-1 text-xs rounded font-semibold";
    return status === 'Active'
      ? <span className={`${base} bg-green-100 text-green-700`}>Active</span>
      : <span className={`${base} bg-red-100 text-red-700`}>Inactive</span>;
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">📋 Vendor List</h2>


          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200 text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 border whitespace-nowrap">ID</th>
                  <th className="py-3 px-4 border whitespace-nowrap">Name</th>
                  <th className="py-3 px-4 border whitespace-nowrap">Email</th>
                  <th className="py-3 px-4 border whitespace-nowrap">Phone</th>
                  <th className="py-3 px-4 border whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 border whitespace-nowrap">Location</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, index) => (
                  <tr
                    key={vendor.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="py-2 px-4 border whitespace-nowrap">{vendor.id}</td>
                    <td className="py-2 px-4 border whitespace-nowrap">{vendor.name}</td>
                    <td className="py-2 px-4 border text-blue-600 whitespace-nowrap">{vendor.email}</td>
                    <td className="py-2 px-4 border whitespace-nowrap">{vendor.phone}</td>
                    <td className="py-2 px-4 border whitespace-nowrap">{statusBadge(vendor.status)}</td>
                    <td className="py-2 px-4 border whitespace-nowrap">{vendor.Location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorList;

