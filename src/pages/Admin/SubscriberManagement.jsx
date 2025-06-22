import React, { useState } from 'react';
import { 
  useGetAllSubscribersQuery,
  useUpdateSubscriberStatusMutation,
  useDeleteSubscriberMutation
} from '../../features/subscribers/subscriberAPI';
import { format } from 'date-fns';
import { FaSearch, FaTrash } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { toast } from 'react-toastify';
import { IoToggle } from "react-icons/io5";

// Custom Toggle Switch Component
const ToggleSwitch = ({ isActive, onToggle }) => {
  return (
    <div 
      className="relative inline-block w-12 h-6 cursor-pointer"
      onClick={onToggle}
    >
      <div className={`w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${
        isActive ? 'bg-green-500' : 'bg-gray-300'
      }`}>
        <div className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
          isActive ? 'transform translate-x-7 mt-0.5' : 'transform translate-x-0.5 mt-0.5'
        }`} />
      </div>
    </div>
  );
};

const SubscriberManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: subscribersData, isLoading, isError, error } = useGetAllSubscribersQuery();
  const [updateStatus] = useUpdateSubscriberStatusMutation();
  const [deleteSubscriber] = useDeleteSubscriberMutation();

  const handleStatusToggle = async (subscriberId, currentStatus) => {
    try {
      await updateStatus({
        subscriberId,
        isActive: !currentStatus
      }).unwrap();
      toast.success(`Subscriber ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      toast.error('Failed to update subscriber status');
      console.error('Error updating subscriber status:', err);
    }
  };

  const handleDelete = async (subscriberId) => {
    if (window.confirm('Are you sure you want to delete this subscriber? This action cannot be undone.')) {
      try {
        await deleteSubscriber(subscriberId).unwrap();
        toast.success('Subscriber deleted successfully');
      } catch (err) {
        toast.error('Failed to delete subscriber');
        console.error('Error deleting subscriber:', err);
      }
    }
  };

  const filteredSubscribers = subscribersData?.subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="text-center p-4">Loading subscribers...</div>;
  if (isError) return <div className="text-center text-red-500 p-4">Error: {error?.data?.message || 'Failed to load subscribers'}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subscriber Management</h2>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Subscribers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Subscribed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubscribers?.map((subscriber) => (
              <tr key={subscriber._id}>
                <td className="px-6 py-4 whitespace-nowrap">{subscriber.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(subscriber.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <ToggleSwitch 
                      isActive={subscriber.isActive}
                      onToggle={() => handleStatusToggle(subscriber._id, subscriber.isActive)}
                    />
                    <span className={`ml-2 text-sm ${subscriber.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                      {subscriber.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(subscriber._id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results Message */}
      {filteredSubscribers?.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No subscribers found
        </div>
      )}
    </div>
  );
};

export default SubscriberManagement; 