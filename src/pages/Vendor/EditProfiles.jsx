import React, { useState, useRef } from 'react';
import { FiUpload } from 'react-icons/fi';
import { RiCheckboxCircleLine } from "react-icons/ri";
import { FaExclamationCircle } from "react-icons/fa";
import coverimage from '../../assets/Images/Navneegt.jpeg';


const EditProfile = () => {
  // State for form inputs
  const [businessName, setBusinessName] = useState('Dream Wedding Photography');
  const [attachImage, setAttachImage] = useState('');
  const [category, setCategory] = useState('Photographer');
  const [businessDescription, setBusinessDescription] = useState(
    'Capturing your special moments with creativity and passion. We provide professional wedding photography services across all major cities in India.'
  );
  const [location, setLocation] = useState('Delhi, India');
  const [priceRange, setPriceRange] = useState('₹10,000 - ₹50,000');
  const [contactEmail, setContactEmail] = useState('info@dreamwedding.com');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [website, setWebsite] = useState('https://dreamwedding.com ');


  // Inside component
  const fileInputRef = useRef(null);

  // Handle image file selection
  const handleImageChange = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };


  // State for cover image
  const [coverImage, setCoverImage] = useState(
    coverimage
  );

  // Profile completion percentage (mock data)
  const profileCompletion = 85;

  // Function to handle form submission (simulated save)
  const handleSaveInfo = () => {
    alert('Information saved successfully!');
  };

  const handleSaveContactInfo = () => {
    alert('Contact information saved successfully!');
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800 font-serif">


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="col-span-2 bg-white p-4 rounded border">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <p className="text-sm text-gray-500 mb-2">Update your business information</p>

          <form>
            <div className="mb-4">
              <label htmlFor="businessName" className="block text-sm font-medium">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:border-[#DEBF78]  "
              >
                <option className='hover:bg-yellow-100'>Photographer</option>
                <option className='hover:bg-yellow-100'>Venue</option>
                <option >Cateree</option>
                <option >Decorator</option>
                <option >MakeUp Artist</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="businessDescription" className="block text-sm font-medium">
                Business Description
              </label>
              <textarea
                id="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:border-blue-500 resize-none"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Briefly describe your services, experience, and what makes you unique (max 500 characters).
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="priceRange" className="block text-sm font-medium">
                Price Range
              </label>
              <input
                type="text"
                id="priceRange"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSaveInfo}
              className="bg-[#0f4c81] text-white px-4 py-2 rounded hover:bg-[#0d4071] transition duration-200"
            >
              Save Information
            </button>
          </form>
        </div>

        {/* Cover Image and Profile Completion */}


        <div className="bg-white p-2 rounded border col-span-1">


          <div className="relative group">
            <h2 className="text-lg font-semibold ">Cover Image</h2>
            <p className="text-sm text-gray-500 mb-2">
              This will be displayed as your profile banner
            </p>
            <img
              src={coverImage}
              alt="Cover Image"
              className="w-full h-48 object-cover rounded shadow-md"
            />

            {/* Hover overlay for changing image */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition duration-200 cursor-pointer"
              onClick={() => fileInputRef.current.click()} // 👈 Trigger hidden input
            >
              <div className="hidden group-hover:block flex flex-col items-center justify-center p-2 rounded z-10">
                <FiUpload size={20} className="text-white mb-1" />
                <span className="text-white text-sm">Change Image</span>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              ref={fileInputRef}
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="hidden"
            />
          </div>


          <p className="text-xs text-gray-500 mt-1">
            Recommended size: 1280 x 720 pixels (16:9 ratio)
          </p>

          {/* Profile Completion */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Profile Completion</h2>
            <p className="text-sm text-gray-500 mb-2">
              Complete your profile to attract more clients
            </p>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Overall completion</span>
                <span className="text-sm text-green-600">{profileCompletion}%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded">
                <div
                  className="h-4 bg-[#0f4c81] rounded"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>

            <ul className="space-y-2">
              <li className="flex items-center  ">

                <RiCheckboxCircleLine color='green' size={20} />
                <span className='ml-2'> Basic information</span>
              </li>
              <li className="flex items-center  ">

                <RiCheckboxCircleLine color='green' size={20} />
                <span className='ml-2'>Contact details</span>
              </li>
              <li className="flex items-center  ">

                <RiCheckboxCircleLine color='green' size={20} />
                <span className='ml-2'>  Profile photo</span>
              </li>
              <li className="flex items-center  ">

                <RiCheckboxCircleLine color='green' size={20} />
                <span className='ml-2'> Portfolio (6/8)</span>
              </li>
              <li className="flex items-center  ">

                <FaExclamationCircle color='#ffff4d' size={20} />
                <span className='ml-2'>  FAQs (2/5 recommended)</span>
              </li>


            </ul>
          </div>
        </div>

       {/* Contact Information */}
        <div className="bg-white p-4 rounded border col-span-2">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <p className="text-sm text-gray-500 mb-2">
            Update how clients can reach you
          </p>

          <form>
            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-medium">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="contactPhone" className="block text-sm font-medium">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="website" className="block text-sm font-medium">
                Website (optional)
              </label>
              <input
                type="url"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded focus:ring focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSaveContactInfo}
              className="bg-[#0f4c81] text-white px-4 py-2 rounded hover:bg-[#0d4071] transition duration-200"
            >
              Save Contact Info
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;