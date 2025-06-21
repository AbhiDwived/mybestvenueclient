import React, { useState, useEffect } from "react";
import { Calendar, Bell, Lock, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateProfileMutation,
  useDeleteUserMutation,
  useUpdatePasswordMutation,
} from "../../../features/auth/authAPI";
import { setCredentials } from "../../../features/auth/authSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const user = authState.user ? { ...authState.user, _id: authState.user.id } : null;
  const token = authState.token;
  const isAuthenticated = authState.isAuthenticated;
  const navigate = useNavigate();

  // Mutation hooks
  const [deleteUser] = useDeleteUserMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  // Backend URL
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Form Data
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
    weddingDate: user?.weddingDate?.split("T")[0] || "",
    profilePhoto: user?.profilePhoto || null,
  });

  // Preview Image
  const [previewImage, setPreviewImage] = useState(
    user?.profilePhoto
      ? user.profilePhoto.startsWith("data:") ||
        user.profilePhoto.startsWith("http")
        ? user.profilePhoto
        : `${backendURL}/${user.profilePhoto.replace(/^\/+/, "")}`
      : null
  );

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications Toggle
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    inquiryResponses: true,
    checklistReminders: true,
    marketingEmails: false,
  });

  // Wedding Countdown
  const [daysUntilWedding, setDaysUntilWedding] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(142);

  // RTK Mutation
  const [triggerUpdateProfile, { isLoading }] = useUpdateProfileMutation();

  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Calculate days until wedding
  useEffect(() => {
    if (formData.weddingDate) {
      const weddingDate = new Date(formData.weddingDate);
      const today = new Date();
      const timeDiff = weddingDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setDaysUntilWedding(Math.max(0, daysDiff));
    }
  }, [formData.weddingDate]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image change and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    try {
      if (!user?._id) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }
      let finalPayload;
      if (formData.profilePhoto instanceof File) {
        finalPayload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            finalPayload.append(key, value);
          }
        });
      } else {
        finalPayload = { ...formData };
      }

      const response = await triggerUpdateProfile({
        userId: user._id,
        profileData: finalPayload,
      }).unwrap();

      const normalizedUser = {
        ...response.user,
        _id: response.user.id,
      };

      dispatch(setCredentials({
        token: localStorage.getItem("token"),
        user: normalizedUser,
      }));

      if (normalizedUser.profilePhoto) {
        const photoURL = normalizedUser.profilePhoto.startsWith("http")
          ? normalizedUser.profilePhoto
          : `${backendURL}/${normalizedUser.profilePhoto.replace(/^\/+/, "")}`;
        setPreviewImage(photoURL);
      }

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(`Failed to update profile: ${error?.data?.message || "Unknown error"}`);
    }
  };

  // Delete account handler
  const handleDelete = async () => {
    try {
      await deleteUser({ userId: user._id }).unwrap();
      toast.success("Account deleted successfully!");
      setTimeout(() => {
        navigate("/user/login");
      }, 1000);
    } catch (err) {
      toast.error("Failed to delete account.");
      console.error(err);
    }
  };

  // Handle password change fields
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle notifications
  const handleNotificationToggle = (setting) => {
    setNotifications((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error("All password fields are required");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long");
        return;
      }

      await updatePassword({
        userId: user._id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  if (!isAuthenticated) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className=" space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="flex justify-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No photo</span>
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800">
              Profile Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {["name", "email", "phone", "weddingDate"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field === "weddingDate" ? "Wedding Date" : field}
                  </label>
                  <input
                    type={field === "weddingDate" ? "date" : "text"}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {["address", "city", "state", "country"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full mt-1 border p-2 rounded-md"
              />
            </div>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className={`bg-[#0F4C81] hover:bg-[#0f4c81ea] text-white px-6 py-2 rounded-md w-full sm:w-auto ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Account Settings */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Lock className="h-5 w-5" /> Account Settings
            </h2>
            {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="password"
                  value={passwordData[field]}
                  onChange={(e) => handlePasswordChange(field, e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </div>
            ))}
            <button
              onClick={handlePasswordUpdate}
              disabled={isUpdatingPassword}
              className="bg-[#0F4C81] hover:bg-[#0f4c81ea] text-white px-6 py-2 w-full sm:w-auto rounded-md disabled:opacity-50"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
            <hr />
            <div>
              <h3 className="text-lg font-medium text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" /> Delete Account
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This will delete your account permanently.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Notifications + Wedding Countdown */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Bell className="h-5 w-5" /> Notification Settings
            </h2>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <p className="font-medium text-gray-800 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
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
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Calendar className="h-5 w-5 text-pink-500" /> Wedding Countdown
            </h2>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Wedding Date</p>
              <p className="font-medium text-gray-800">
                {new Date(formData.weddingDate).toDateString()}
              </p>
              <div className="bg-white mt-4 p-6 rounded-lg shadow">
                <p className="text-sm text-gray-600 mb-2">
                  Days until your wedding
                </p>
                <p className="text-4xl font-bold text-pink-600">
                  {daysUntilWedding}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Tasks completed</p>
                <div className="bg-white rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${(tasksCompleted / 200) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {tasksCompleted} / 200
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete your account permanently? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 "
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;