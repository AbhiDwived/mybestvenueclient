import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Lock, Trash2, Heart, Settings } from 'lucide-react';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: 'Arjun & Meera Kumar',
    email: 'arjun.meera@example.com',
    weddingDate: '2024-05-15',
    phoneNumber: '9876543210',
    weddingLocation: 'Delhi, India'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    inquiryResponses: true,
    checklistReminders: true,
    marketingEmails: false
  });

  const [daysUntilWedding, setDaysUntilWedding] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(142);

  useEffect(() => {
    const calculateDaysUntilWedding = () => {
      const weddingDate = new Date(formData.weddingDate);
      const today = new Date();
      const timeDiff = weddingDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysUntilWedding(Math.max(0, daysDiff));
    };

    calculateDaysUntilWedding();
  }, [formData.weddingDate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (setting) => {
    setNotifications(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSaveChanges = () => {
    alert('Profile information saved successfully!');
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      alert('Account deletion initiated.');
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info Card */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Names</label>
                <input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700">Wedding Date</label>
                <input type="date" id="weddingDate" value={formData.weddingDate} onChange={(e) => handleInputChange('weddingDate', e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input id="phoneNumber" value={formData.phoneNumber} onChange={(e) => handleInputChange('phoneNumber', e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
              </div>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Wedding Location</label>
              <input id="location" value={formData.weddingLocation} onChange={(e) => handleInputChange('weddingLocation', e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
            </div>
            <button onClick={handleSaveChanges} style={{borderRadius:'5px'}} className="bg-[#0F4C81] hover:bg-[#0f4c81ea] text-white px-6 py-2 rounded-md">
              Save Changes
            </button>
          </div>

          {/* Password Section */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Lock className="h-5 w-5" /> Account Settings
            </h2>
            <div className="space-y-4">
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field, idx) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <input
                    type="password"
                    value={passwordData[field]}
                    onChange={(e) => handlePasswordChange(field, e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
              ))}
              <button onClick={handleUpdatePassword} style={{borderRadius:'5px'}} className="bg-[#0F4C81] hover:bg-[#0f4c81ea] text-white px-6 py-2 ">
                Update Password
              </button>
            </div>

            <hr />

            <div>
              <h3 className="text-lg font-medium text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> Delete Account
              </h3>
              <p className="text-sm text-gray-600 mb-4">This will delete your account permanently.</p>
              <button onClick={handleDeleteAccount}  style={{borderRadius:'5px'}}  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Bell className="h-5 w-5" /> Notification Settings
            </h2>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationToggle(key)}
                  className="h-5 w-5"
                />
              </div>
            ))}
            <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              Save Notification Settings
            </button>
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-pink-500" /> Wedding Countdown
            </h2>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Wedding Date</p>
              <p className="font-medium text-gray-800">Wednesday, May 15, 2024</p>
              <div className="bg-white mt-4 p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-2">Days until your wedding</p>
                <p className="text-4xl font-bold text-pink-600">{daysUntilWedding}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Tasks completed</p>
                <div className="bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${(tasksCompleted / 200) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{tasksCompleted} / 200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
