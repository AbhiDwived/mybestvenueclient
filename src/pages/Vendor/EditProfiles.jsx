import React, { useState, useRef, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import { RiCheckboxCircleLine } from "react-icons/ri";
import { FaExclamationCircle } from "react-icons/fa";
import coverimage from '../../assets/Images/Navneegt.jpeg';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateProfileMutation } from "../../features/vendors/vendorAPI";
import { setVendorCredentials } from '../../features/vendors/vendorSlice';

const EditProfile = () => {
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state.vendor.vendor);
  const isAuthenticated = useSelector((state) => state.vendor.isAuthenticated);
  console.log(" Data from store editttt:", vendor);
  const vendorId = localStorage.getItem('vendorId');

  // console.log("vendorId", vendorId)



  const token = useSelector((state) => state.vendor.token);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [coverImage, setCoverImage] = useState(coverimage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contactName, setcontactName] = useState('');

  const fileInputRef = useRef(null);





  useEffect(() => {
    if (vendor) {
      setBusinessName(vendor.businessName || 'Dream Wedding Photography');
      setCategory(vendor.vendorType || 'Photography');
      setBusinessDescription(vendor.description || 'This is a sample description.');
      setLocation(vendor.address || 'New Delhi, India');
      setPriceRange(vendor.pricing || '10000 - 50000');
      setContactEmail(vendor.email || 'mybestvenuehelp@gmail.com');
      setContactPhone(vendor.phone || '+91 9999999999');
      setWebsite(vendor.website || 'mybestvenue.com');
      setcontactName(vendor.contactName || 'John Doe');
      if (!selectedFile) setCoverImage(vendor.profilePicture || coverimage);
      // setCoverImage(vendor.profilePicture || coverimage);
    }
  }, [vendor]);

  const handleSave = async () => {
    if (!vendorId) {
      alert("Vendor ID missing.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("businessName", businessName);
      formData.append("vendorType", category); // check backend expects "vendorType"
      formData.append("description", businessDescription);
      formData.append("address", location);
      formData.append("pricing", priceRange);
      formData.append("email", contactEmail);
      formData.append("phone", contactPhone);
      formData.append("website", website);
      formData.append("termsAccepted", true);
      formData.append("isApproved", true);
      formData.append("contactName", contactName);
      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }
      const res = await updateProfile({ vendorId, profileData: formData }).unwrap();
      // console.log("updateProfile response:", res);

      const updatedVendor = res.vendor || res;
      dispatch(setVendorCredentials({ vendor: updatedVendor, token }));

      alert("Vendor profile updated successfully");
    } catch (err) {
      // console.error("Error updating vendor:", err);
      alert("Failed to update vendor");
    }
  };

  const handleImageChange = async (file) => {
    if (!vendorId) {
      alert("Unable to update image. Vendor ID missing.");
      return;
    }

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      setSelectedFile(file);

      try {
        const formData = new FormData();
        formData.append("profilePicture", file);

        const res = await updateProfile({
          // vendorId: vendor._id,
          vendorId,
          profileData: formData
        }).unwrap();

        const updatedVendor = res.vendor;
        dispatch(setVendorCredentials({ vendor: updatedVendor, token }));

        alert("Profile image updated successfully");
      } catch (err) {
        // console.error("Error uploading image:", err);
        alert("Failed to update profile image");
      }
    }
  };

  if (!isAuthenticated) {
    return <h5 className='text-gray-600 font-bold'>You are not logged in.</h5>;
  }

  return (
    <div className="font-serif">
      <div className="row g-4">
        {/* Basic Info */}
        <div className="col-lg-8">
          <div className="card p-4">
            <h5>Basic Information</h5>
            <p className="text-muted small">Update your business information</p>
            <form>
              <div className="mb-3">
                <label className="form-label">Business Name</label>
                <input type="text" className="form-control" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Photographer</option>
                  <option>Venue</option>
                  <option>Cateree</option>
                  <option>Decorator</option>
                  <option>MakeUp Artist</option>
                  <option>Wedding Hall</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Business Description</label>
                <textarea className="form-control" rows="4" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Price Range</label>
                <input type="text" className="form-control" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} />
              </div>
              <button type="button" onClick={handleSave} className="btn text-white" style={{ backgroundColor: '#0f4c81' }}>
                {isLoading ? 'Saving...' : 'Save Information'}
              </button>
            </form>
          </div>
        </div>

        {/* Cover Image */}
        <div className="col-lg-4">
          <div className="border rounded p-3 mb-4">
            <h4>Cover Image</h4>
            <p className="text-muted small">This will be displayed as your profile banner</p>
            <div className="position-relative" style={{ height: '200px', overflow: 'hidden', borderRadius: '0.5rem' }}>
              <img src={coverImage} className="w-100 h-100 object-fit-cover" alt="Cover" />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0, transition: 'opacity 0.3s ease', cursor: 'pointer' }}
                onClick={() => fileInputRef.current.click()}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <button className="btn text-white d-flex align-items-center" style={{ backgroundColor: "#0f4c81" }}>
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

          {/* Profile Completion */}
          <div className="border rounded p-3">
            <h3>Profile Completion</h3>
            <p className="text-muted small">Complete your profile to attract more clients</p>
            <div className="mb-2 d-flex justify-content-between small">
              <span>Overall completion</span>
              <span className="text-success">85%</span>
            </div>
            <div className="progress mb-3">
              <div className="progress-bar" role="progressbar" style={{ width: '85%', backgroundColor: '#0f4c81' }}></div>
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
            <form>
              <div className="mb-3">
                <label className="form-label">Contact Email</label>
                <input type="email" className="form-control" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Phone</label>
                <input type="tel" className="form-control" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Website (optional)</label>
                <input type="url" className="form-control" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <button type="button" onClick={handleSave} className="btn text-white" style={{ backgroundColor: '#0f4c81' }}>
                {isLoading ? 'Saving...' : 'Save Contact Info'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;


