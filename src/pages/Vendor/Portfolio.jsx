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
    <div className="bg-white p-4 rounded shadow-sm font-family: Georgia, 'Times New Roman', Times, serif;">
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
        className="d-none"
      />

      <div className="mb-4">
        <h2 className="text-xl  font-family: Georgia, 'Times New Roman', Times, serif;">Portfolio Gallery</h2>
        <p className="text-muted small">Showcase your best work to attract more clients</p>
      </div>

      {/* Image Grid */}
      <div className="row g-3">
        {portfolioImages.map((image, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="position-relative overflow-hidden rounded shadow">
              <img
                src={image}
                alt={`Portfolio ${index + 1}`}
                className="img-fluid w-100 h-100 object-fit-cover"
                style={{ aspectRatio: '1 / 1' }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0 hover-opacity-100 transition-all">
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleAddImageClick(index)}
                    className="btn btn-light btn-sm hover-bg-blue "
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Image Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div
            onClick={() => handleAddImageClick(null)}
            className="border border-2 border-dashed rounded d-flex flex-column align-items-center justify-content-center h-100 py-4 text-center cursor-pointer bg-light"
            style={{ aspectRatio: '1 / 1' }}
          >
            <LuImagePlus size={32} className="text-muted mb-2" />
            <div className="fw-medium">Add New Image</div>
            <div className="text-muted small mt-1">Upload JPG or PNG</div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="mt-5">
        <h3 className="h6 fw-semibold mb-3">Video Showcase</h3>
        <label htmlFor="video-url" className="form-label small fw-medium">
          YouTube, Vimeo or Upload Video
        </label>
        <div className="d-flex mb-2">
          <input
            type="text"
            id="video-url"
            className="form-control form-control-sm me-2"
            placeholder="https://youtube.com/watch?v=... or upload file"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button type="button" className="btn btn-sm text-white" onClick={handleAddVideoClick} style={{ display: 'inline', backgroundColor: '#19599A' }}>AddVideo</button>
          {/* #19599A  bg-[#0f4c81]*/}
        </div>
        <p className="small text-muted">
          Add a link to your showreel or best wedding video
        </p>
      </div>
    </div>
  );
};

export default PortfolioTab;



