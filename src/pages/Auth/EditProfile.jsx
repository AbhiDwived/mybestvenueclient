import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateProfileMutation } from "../../features/auth/authAPI";
import { setCredentials } from "../../features/auth/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    profilePhoto: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        profilePhoto: user.profilePhoto || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        userId,
        profileData: formData,
      }).unwrap();

      const updatedUser = res.user || res;
      dispatch(setCredentials({ token: localStorage.getItem("token"), user: updatedUser }));
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Header and Profile Image */}
      <div className="flex flex-row justify-center items-center mb-8 gap-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
        <div
          onClick={handleImageClick}
          className="relative group cursor-pointer w-36 h-36 rounded-full border-4 border-blue-100 overflow-hidden shadow-md hover:shadow-lg transition duration-300"
        >
          <img
            src={
              formData.profilePhoto ||
              "https://via.placeholder.com/150?text=Upload"
            }
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

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(formData).map(([key, value]) =>
          key === "profilePhoto" ? null : (
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
                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder={`Enter ${key}`}
                autoComplete="off"
              />
            </div>
          )
        )}
        <div className="col-span-full text-center mt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-lg font-medium disabled:opacity-50 transition duration-300"
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProfile;
