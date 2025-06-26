import React, { useState, useRef } from 'react';
import { LuImagePlus } from "react-icons/lu";
import { FaEdit, FaTrash, FaPlay } from "react-icons/fa";
import { MdVideoCameraBack } from "react-icons/md";

import Dream01 from "../../assets/navImage/Dream001.jpeg";
import Dream02 from "../../assets/navImage/Dream002.jpeg";
import Dream03 from "../../assets/navImage/Dream003.jpeg";

const PortfolioTab = () => {
  const [activeTab, setActiveTab] = useState('images');
  const [portfolioImages, setPortfolioImages] = useState([
    { type: 'image', url: Dream01, title: 'Wedding Ceremony' },
    { type: 'image', url: Dream02, title: 'Reception Decor' },
    { type: 'image', url: Dream03, title: 'Engagement Party' },
    { type: 'image', url: Dream01, title: 'Wedding Photoshoot' },
    { type: 'image', url: Dream02, title: 'Bridal Makeup' },
    { type: 'image', url: Dream03, title: 'Wedding Entertainment' }
  ]);

  const [videos, setVideos] = useState([
    { 
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', 
      title: 'Wedding Highlights',
      thumbnail: Dream01
    }
  ]);

  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState('');
  const fileInputRef = useRef(null);

  const handleAddImageClick = () => {
    setEditingImageIndex(null);
    setNewImageTitle('');
    setShowImageModal(true);
  };

  const handleEditImageClick = (index) => {
    setEditingImageIndex(index);
    setNewImageTitle(portfolioImages[index].title);
    setShowImageModal(true);
  };

  const handleImageUpload = () => {
    fileInputRef.current.accept = 'image/*';
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        if (editingImageIndex !== null) {
          setPortfolioImages((prev) => {
            const updated = [...prev];
            updated[editingImageIndex] = { 
              ...updated[editingImageIndex], 
              url: imageData,
              title: newImageTitle || `Image ${prev.length + 1}`
            };
            return updated;
          });
        } else {
          setPortfolioImages((prev) => [
            ...prev, 
            { 
              type: 'image',
              url: imageData, 
              title: newImageTitle || `Image ${prev.length + 1}`
            }
          ]);
        }
        setShowImageModal(false);
        setEditingImageIndex(null);
        setNewImageTitle('');
        fileInputRef.current.value = null;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    setPortfolioImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVideoClick = () => {
    setEditingVideoIndex(null);
    setVideoUrl('');
    setVideoTitle('');
    setShowVideoModal(true);
  };

  const handleEditVideoClick = (index) => {
    setEditingVideoIndex(index);
    setVideoUrl(videos[index].url);
    setVideoTitle(videos[index].title);
    setShowVideoModal(true);
  };

  const handleVideoUpload = () => {
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

  const handleSaveVideo = () => {
    if (videoUrl) {
      if (editingVideoIndex !== null) {
        setVideos((prev) => {
          const updated = [...prev];
          updated[editingVideoIndex] = { 
            ...updated[editingVideoIndex], 
            url: videoUrl,
            title: videoTitle || `Video ${prev.length + 1}`,
            thumbnail: Dream01 // Placeholder, would need real thumbnail generation
          };
          return updated;
        });
      } else {
        setVideos((prev) => [
          ...prev, 
          { 
            type: 'video',
            url: videoUrl, 
            title: videoTitle || `Video ${prev.length + 1}`,
            thumbnail: Dream01 // Placeholder, would need real thumbnail generation
          }
        ]);
      }
      setShowVideoModal(false);
      setEditingVideoIndex(null);
      setVideoUrl('');
      setVideoTitle('');
    }
  };

  const handleRemoveVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Hidden File Input */}
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

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Portfolio Gallery</h2>
        <p className="text-gray-600">Showcase your best work to attract more clients</p>
      </div>

      {/* Main Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button 
            onClick={() => setActiveTab('images')}
            className={`pb-2 font-medium ${activeTab === 'images' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
          >
            Images ({portfolioImages.length})
          </button>
          <button 
            onClick={() => setActiveTab('videos')}
            className={`pb-2 font-medium ${activeTab === 'videos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
          >
            Videos ({videos.length})
          </button>
        </div>
      </div>

      {/* Images Section */}
      {activeTab === 'images' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">My Portfolio Images</h3>
            <button 
              onClick={handleAddImageClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm transition-colors"
            >
              <LuImagePlus className="mr-2" />
              Add Image
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {portfolioImages.map((image, index) => (
              <div key={index} className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <h4 className="text-white font-medium truncate">{image.title}</h4>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditImageClick(index)}
                      className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Image Card */}
            <div 
              onClick={handleAddImageClick}
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-60 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <LuImagePlus size={36} className="text-gray-400 mb-3" />
              <p className="font-medium text-gray-600">Add New Image</p>
              <p className="text-gray-500 text-sm mt-1">Upload JPG or PNG</p>
            </div>
          </div>
        </div>
      )}

      {/* Videos Section */}
      {activeTab === 'videos' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">My Portfolio Videos</h3>
            <button 
              onClick={handleAddVideoClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm transition-colors"
            >
              <MdVideoCameraBack className="mr-2" size={18} />
              Add Video
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {videos.map((video, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md bg-white border border-gray-200">
                <div className="relative aspect-video">
                  <iframe 
                    src={getEmbedUrl(video.url)} 
                    title={video.title}
                    className="absolute w-full h-full" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4 flex justify-between items-center border-t">
                  <h4 className="font-medium text-gray-800 truncate">{video.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditVideoClick(index)}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleRemoveVideo(index)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Video Card */}
            <div 
              onClick={handleAddVideoClick}
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center aspect-video text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <MdVideoCameraBack size={36} className="text-gray-400 mb-3" />
              <p className="font-medium text-gray-600">Add New Video</p>
              <p className="text-gray-500 text-sm mt-1">YouTube, Vimeo, or Upload</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingImageIndex !== null ? 'Edit Image' : 'Add New Image'}
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Image Title
              </label>
              <input
                type="text"
                value={newImageTitle}
                onChange={(e) => setNewImageTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter image title"
              />
            </div>
            <div 
              onClick={handleImageUpload}
              className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200 mb-4"
            >
              <LuImagePlus size={36} className="text-gray-400 mb-3" />
              <p className="font-medium text-gray-600">Select Image</p>
              <p className="text-gray-500 text-sm mt-1">Upload JPG or PNG</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setEditingImageIndex(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUpload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                {editingImageIndex !== null ? 'Update' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingVideoIndex !== null ? 'Edit Video' : 'Add New Video'}
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter video title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Video URL or Upload
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <button
                  onClick={handleVideoUpload}
                  className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  <FaPlay className="inline mr-1" size={12} />
                  Upload
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">YouTube, Vimeo, or upload a video file</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setEditingVideoIndex(null);
                  setVideoUrl('');
                  setVideoTitle('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVideo}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                disabled={!videoUrl}
              >
                {editingVideoIndex !== null ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTab;



