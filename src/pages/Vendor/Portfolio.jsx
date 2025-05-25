

import React, { useState, useRef } from 'react';
import { LuImagePlus } from "react-icons/lu";

import Dream01 from "../../assets/navImage/Dream001.jpeg";
import Dream02 from "../../assets/navImage/Dream002.jpeg";
import Dream03 from "../../assets/navImage/Dream003.jpeg";

const PortfolioTab = () => {
  const [portfolioImages, setPortfolioImages] = useState([
    Dream01,
    Dream02,
    Dream03,
    Dream01,
    Dream02,
    Dream03
  ]);

  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const fileInputRef = useRef(null);

  // Add or edit image
  const handleAddImageClick = (index = null) => {
    setEditingImageIndex(index);
    fileInputRef.current.accept = 'image/*';
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setPortfolioImages((prev) => {
          if (editingImageIndex !== null) {
            const updated = [...prev];
            updated[editingImageIndex] = imageData;
            return updated;
          } else {
            return [...prev, imageData];
          }
        });
        setEditingImageIndex(null);
        fileInputRef.current.value = null;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Add video
  const handleAddVideoClick = () => {
    fileInputRef.current.accept = 'video/*';
    fileInputRef.current.click();
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoUrl(videoURL);
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow font-serif">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (fileInputRef.current.accept === 'image/*') {
            handleImageChange(e);
          } else {
            handleVideoChange(e);
          }
        }}
        className="hidden"
      />

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Portfolio Gallery</h2>
        <p className="text-sm text-gray-500">Showcase your best work to attract more clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolioImages.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow group">
            <img
              src={image}
              alt={`Portfolio ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddImageClick(index)}
                  className="px-3 py-1 bg-white text-sm text-black rounded hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Image Card */}
        <div
          onClick={() => handleAddImageClick(null)}
          className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
        >
          <LuImagePlus className="h-10 w-10 text-gray-400 mb-2" />
          <span className="text-sm font-medium">Add New Image</span>
          <span className="text-xs text-gray-500 mt-1">Upload JPG or PNG</span>
        </div>
      </div>

      {/* Video Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Video Showcase</h3>
        <div>
          <label htmlFor="video-url" className="block text-sm font-medium text-gray-700">
            YouTube, Vimeo or Upload Video
          </label>

          <div className="flex mt-2 ">
            <input
              type="text"
              id="video-url"
              placeholder="https://youtube.com/watch?v=...  or upload file"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1  px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:border-blue-400 text-sm"
            />
            <button
              type="button"
              onClick={handleAddVideoClick}
              className=" px-4 py-2  bg-[#0f4c81] text-white text-sm rounded hover:bg-[#0f4c81]"
            >
              Add Video
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Add a link to your showreel or best wedding video
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTab;


