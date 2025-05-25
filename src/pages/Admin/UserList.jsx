import React, { useState } from 'react';


const UserList = () => {
  const [records, setRecords] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', image: 'https://randomuser.me/api/portraits/men/1.jpg', idProof: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'Active' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', image: 'https://randomuser.me/api/portraits/women/1.jpg', idProof: 'https://randomuser.me/api/portraits/women/2.jpg', status: 'Inactive' },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', image: 'https://randomuser.me/api/portraits/women/3.jpg', idProof: 'https://randomuser.me/api/portraits/women/4.jpg', status: 'Inactive' },
    // other records...
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
    { id: 20, name: 'Bob Smith', email: 'bob.smith@example.com', image: 'https://randomuser.me/api/portraits/men/3.jpg', idProof: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'Active' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < Math.ceil(records.length / recordsPerPage) && setCurrentPage(currentPage + 1);
  const previousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded px-8 py-6">
          <h2 className="text-2xl font-bold mb-6">User List</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2">User ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Image</th>
                <th className="py-2">IdProof</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-100">
                  <td className="py-2">{record.id}</td>
                  <td className="py-2">{record.name}</td>
                  <td className="py-2">{record.email}</td>
                  <td className="py-2"><img src={record.image} alt="User" className="w-10 h-10 rounded-full object-cover" /></td>
                  <td className="py-2"><img src={record.idProof} alt="ID Proof" className="w-10 h-10 rounded-full object-cover" /></td>
                  <td className="py-2">
                    <span className={`${record.status === 'Active' ? 'bg-green-100' : 'bg-red-100'} py-1 px-2 rounded-full text-sm font-semibold`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={previousPage}>Previous</button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r" onClick={nextPage}>Next</button>
          </div>
          <div className="text-center mt-4">
            Page {currentPage} of {Math.ceil(records.length / recordsPerPage)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;

