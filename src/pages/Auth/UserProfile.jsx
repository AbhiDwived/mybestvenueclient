import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Heading and Image in one row */}
      <div className="flex flex-row justify-center items-center mb-8 gap-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
          <img
            src={
              user.profilePhoto ||
              "https://via.placeholder.com/150?text=No+Image"
            }
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>


      {/* Form Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "name",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "country",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {field}
              </label>
              <input
                type="text"
                readOnly
                value={user[field] || ""}
                className="w-full border border-gray-300 px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Edit Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/edit-profile")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-lg font-medium transition duration-300"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
