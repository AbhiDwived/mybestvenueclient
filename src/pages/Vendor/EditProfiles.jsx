
import React, { useState, useRef } from 'react';
import { FiUpload } from 'react-icons/fi';
import { RiCheckboxCircleLine } from "react-icons/ri";
import { FaExclamationCircle } from "react-icons/fa";
import coverimage from '../../assets/Images/Navneegt.jpeg';

const EditProfile = () => {
  const [businessName, setBusinessName] = useState('Dream Wedding Photography');
  const [category, setCategory] = useState('Photographer');
  const [businessDescription, setBusinessDescription] = useState(
    'Capturing your special moments with creativity and passion. We provide professional wedding photography services across all major cities in India.'
  );
  const [location, setLocation] = useState('Delhi, India');
  const [priceRange, setPriceRange] = useState('₹10,000 - ₹50,000');
  const [contactEmail, setContactEmail] = useState('info@dreamwedding.com');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [website, setWebsite] = useState('https://dreamwedding.com');
  const [coverImage, setCoverImage] = useState(coverimage);

  const fileInputRef = useRef(null);
  const profileCompletion = 85;

  const handleImageChange = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
    }
  };

  return (
    <div className=" font-serif">
      <div className="row g-4">
        {/* Basic Information */}
        <div className="col-lg-8">
          <div className="card p-4">
            <h5>Basic Information</h5>
            <p className="text-muted small">Update your business information</p>
            <form>
              <div className="mb-3">
                <label htmlFor="businessName" className="form-label">Business Name</label>
                <input type="text" className="form-control" id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select className="form-select" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Photographer</option>
                  <option>Venue</option>
                  <option>Cateree</option>
                  <option>Decorator</option>
                  <option>MakeUp Artist</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="businessDescription" className="form-label">Business Description</label>
                <textarea className="form-control" rows="4" id="businessDescription" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)}></textarea>
                <small className="form-text text-muted">Briefly describe your services, experience, and what makes you unique (max 500 characters).</small>
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input type="text" className="form-control" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="priceRange" className="form-label">Price Range</label>
                <input type="text" className="form-control" id="priceRange" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} />
              </div>
              <button type="button" className="btn text-white" style={{ backgroundColor: '#0f4c81' }}>Save Information</button>
            </form>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Cover Image Section */}
          <div className="border rounded p-3 mb-4">
            <h4>Cover Image</h4>
            <p className="text-muted small">This will be displayed as your profile banner</p>

            <div className="position-relative" style={{ height: '200px', overflow: 'hidden', borderRadius: '0.5rem' }}>
              <img
                src={coverImage}
                className="w-100 h-100 object-fit-cover"
                alt="Cover"
                style={{ objectFit: 'cover' }}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => fileInputRef.current.click()}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <button
                  className="btn text-white d-flex align-items-center"
                  style={{ backgroundColor: "#0f4c81", borderColor: "#0f4c81" }}
                >
                  <FiUpload className="me-2" />
                  Change Image
                </button>
              </div>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                ref={fileInputRef}
                onChange={(e) => handleImageChange(e.target.files[0])}
                className="d-none"
              />
            </div>
            <small className="text-muted d-block mt-2">Recommended size: 1280 x 720 pixels (16:9 ratio)</small>
          </div>

          {/* Profile Completion Section */}
          <div className="border rounded p-3">
            <h3>Profile Completion</h3>
            <p className="text-muted small">Complete your profile to attract more clients</p>
            <div className="mb-2 d-flex justify-content-between small">
              <span>Overall completion</span>
              <span className="text-success">{profileCompletion}%</span>
            </div>
            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${profileCompletion}%`, backgroundColor: '#0f4c81' }}
              ></div>
            </div>
            <ul className="list-unstyled">
              <li className="d-flex align-items-center mb-2">
                <RiCheckboxCircleLine color='green' size={20} /><span className='ms-2'>Basic information</span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <RiCheckboxCircleLine color='green' size={20} /><span className='ms-2'>Contact details</span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <RiCheckboxCircleLine color='green' size={20} /><span className='ms-2'>Profile photo</span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <RiCheckboxCircleLine color='green' size={20} /><span className='ms-2'>Portfolio (6/8)</span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <FaExclamationCircle color='#ffff4d' size={20} /><span className='ms-2'>FAQs (2/5 recommended)</span>
              </li>
            </ul>
          </div>
        </div>


        {/* Contact Info */}
        <div className="col-lg-8">
          <div className="card p-4">
            <h5>Contact Information</h5>
            <p className="text-muted small">Update how clients can reach you</p>
            <form>
              <div className="mb-3">
                <label htmlFor="contactEmail" className="form-label">Contact Email</label>
                <input type="email" className="form-control" id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="contactPhone" className="form-label">Contact Phone</label>
                <input type="tel" className="form-control" id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="website" className="form-label">Website (optional)</label>
                <input type="url" className="form-control" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <button type="button" className="btn text-white" style={{ backgroundColor: '#0f4c81' }}>Save Contact Info</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
