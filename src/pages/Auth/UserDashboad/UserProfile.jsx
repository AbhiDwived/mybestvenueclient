import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUpdateProfileMutation } from "../../../features/auth/authAPI";
import { setCredentials } from "../../../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Calendar } from "lucide-react";

const TABS = ["profile", "Edit", "settings", "notifications", "countdown"];

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    profilePhoto: "",
    weddingDate: "", // for countdown tab
  });

  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        profilePhoto: user.profilePhoto || "",
        weddingDate: user.weddingDate || "",
      });

      // Example tasks data for countdown tab
      setTasks([{}, {}, {}, {}, {}]);
      setCompletedTasks(2);
    }
  }, [user]);

  // Profile Tab: just a view of info (can be edited or read-only)
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log("Updated profile:", profile);
  };

  // Edit Tab: This is the editable profile form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("profileImageInput").click();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        userId,
        profileData: profile,
      }).unwrap();

      const updatedUser = res.user || res;
      dispatch(setCredentials({ token: localStorage.getItem("token"), user: updatedUser }));
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        setActiveTab("profile"); // switch back to profile tab after update
      }, 2000);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update profile.");
    }
  };

  const completionPercentage = tasks.length
    ? (completedTasks / tasks.length) * 100
    : 0;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen ">
      <div className="flex-1">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
          {/* Tabs */}
          <div className="flex  border-b mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-4 py-2 font-medium border-b-2 ${activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-blue-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ["Your Name", "name", "text"],
                  ["Email", "email", "email"],
                  ["Phone", "phone", "text"],
                  ["Address", "address", "text"],
                  ["City", "city", "text"],
                  ["State", "state", "text"],
                  ["Country", "country", "text"],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium mb-1">{label}</label>
                    <input
                      type={type}
                      value={profile[key]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      className="w-full border border-gray-300 p-2 rounded"
                      readOnly
                    />
                  </div>
                ))}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Profile Photo</label>
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt="Profile"
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      No Photo
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* Edit Tab */}
          {activeTab === "Edit" && (
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Header and Profile Image */}
              <div className="sm:col-span-2 flex flex-col sm:flex-row justify-center items-center mb-8 gap-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
                <div
                  onClick={handleImageClick}
                  className="relative group cursor-pointer w-36 h-36 rounded-full border-4 border-blue-100 overflow-hidden shadow-md hover:shadow-lg transition duration-300"
                >
                  <img
                    src={profile.profilePhoto || "https://via.placeholder.com/150?text=Upload"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 text-white text-sm">
                    Click to change
                  </div>
                  <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form fields */}
              {Object.entries(profile).map(([key, value]) =>
                key === "profilePhoto" || key === "weddingDate" ? null : (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700 capitalize mb-1"
                    >
                      {key}
                    </label>
                    <input
                      id={key}
                      name={key}
                      type={key === "email" ? "email" : "text"}
                      value={value}
                      onChange={handleChange}
                      className="w-full border bg-gray-100 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder={`Enter ${key}`}
                      autoComplete="off"
                    />
                  </div>
                )
              )}

              {/* Submit button */}
              <div className="sm:col-span-2 text-center mt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#0f304d] hover:bg-[#0f304def] text-white px-6 py-2 rounded-md text-lg font-medium disabled:opacity-50 transition duration-300"
                >
                  {isLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Change Password</h3>
                <input
                  className="w-full mb-2 p-2 border rounded"
                  type="password"
                  placeholder="Current Password"
                />
                <input
                  className="w-full mb-2 p-2 border rounded"
                  type="password"
                  placeholder="New Password"
                />
                <input
                  className="w-full mb-4 p-2 border rounded"
                  type="password"
                  placeholder="Confirm New Password"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Update Password</button>
              </div>
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will permanently delete your account. This action is irreversible.
                </p>
                <button className="bg-red-600 text-white px-4 py-2 rounded">Delete Account</button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              {[
                ["Email Notifications", "Get updates and reminders via email."],
                ["Inquiry Responses", "Be notified when vendors respond."],
                ["Checklist Reminders", "Stay on track with your to-do list."],
                ["Marketing Emails", "Receive deals and offers."],
              ].map(([title, desc]) => (
                <div className="flex items-center justify-between" key={title}>
                  <div>
                    <label className="font-medium">{title}</label>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              ))}
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                Save Notification Settings
              </button>
            </div>
          )}

          {/* Countdown Tab */}
          {activeTab === "countdown" && (
            <div className="space-y-6">
              <div className="flex items-center">
                <Calendar className="mr-3 text-pink-500" />
                <div>
                  <p className="text-sm text-gray-600">Wedding Date</p>
                  <p className="font-medium">
                    {profile.weddingDate
                      ? new Date(profile.weddingDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "Not set"}
                  </p>
                </div>
              </div>
              <div className="bg-pink-100 p-4 rounded text-center">
                <p className="text-sm text-pink-700">Days until your wedding</p>
                <p className="text-3xl font-bold text-pink-600">
                  {profile.weddingDate
                    ? Math.max(
                      0,
                      Math.floor(
                        (new Date(profile.weddingDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                      )
                    )
                    : "--"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">
                  Tasks Completed: {completedTasks}/{tasks.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserProfile;
