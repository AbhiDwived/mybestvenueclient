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
  // console.log(" Data from store editttt:", vendor);
  const vendorId = vendor?._id || vendor?.id
  // const vendorId = localStorage.getItem('vendorId');
  const profileimg = vendor.profilePicture;
  



  const token = useSelector((state) => state.vendor.token);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [serviceAreas, setServiceAreas] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contactName, setcontactName] = useState('');

  const fileInputRef = useRef(null);
  const serverURL = "http://localhost:5000"





  useEffect(() => {
    if (vendor) {
      setBusinessName(vendor.businessName || 'Dream Wedding Photography');
      setCategory(vendor.vendorType || 'Photography');
      setBusinessDescription(vendor.description || 'This is a sample description.');
      setServiceAreas(vendor.serviceAreas || 'New Delhi, India');
      setPriceRange(vendor.pricing || '10000 - 50000');
      setContactEmail(vendor.email || 'mybestvenuehelp@gmail.com');
      setContactPhone(vendor.phone || '+91 9999999999');
      setWebsite(vendor.website || 'mybestvenue.com');
      setcontactName(vendor.contactName || 'John Doe');
      setCoverImage(vendor.profilePicture || null);
    }
  }, [vendor]);

  const prepareFormData = (imageFile = null) => {
    const formData = new FormData();
    formData.append("businessName", businessName);
    formData.append("vendorType", category);
    formData.append("description", businessDescription);

    const formattedServiceAreas = Array.isArray(serviceAreas)
      ? serviceAreas.join(",")
      : serviceAreas;
    formData.append("serviceAreas", formattedServiceAreas);

    formData.append("pricing", priceRange);
    formData.append("email", contactEmail);
    formData.append("phone", contactPhone);
    formData.append("website", website);
    formData.append("termsAccepted", true);
    formData.append("isApproved", true);
    formData.append("contactName", contactName);

    // If a new image file is provided, use it
    if (imageFile) {
      formData.append("profilePicture", imageFile);
    }
    // If there's a selected file but no new image file provided, use the selected file
    else if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }
    // If there's an existing image URL, preserve it
    else if (vendor.profilePicture) {
      formData.append("profilePicture", vendor.profilePicture);
    }

    return formData;
  };



  const handleSave = async () => {
    if (!vendorId) return alert("Vendor ID missing.");

    try {
      const formData = prepareFormData();
      const res = await updateProfile({ vendorId, profileData: formData }).unwrap();
      const updatedVendor = res.vendor || res;

      // Only update the image state if a new image was actually returned
      if (updatedVendor.profilePicture && updatedVendor.profilePicture !== coverImage) {
        setCoverImage(updatedVendor.profilePicture);
      }

      dispatch(setVendorCredentials({ vendor: updatedVendor, token }));
      alert("Vendor Record updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update vendor");
    }
  };
  const handleImageChange = async (file) => {
    if (!vendorId || !file) {
      alert("Unable to update image. Vendor ID or file missing.");
      return;
    }

    try {
      // Create a local preview immediately
      const localPreview = URL.createObjectURL(file);
      setSelectedFile(file);
      setCoverImage(localPreview);

      // Prepare and send the update
      const formData = prepareFormData(file);
      const res = await updateProfile({ vendorId, profileData: formData }).unwrap();
      const updatedVendor = res.vendor || res;
      
      // Update with the server path
      if (updatedVendor.profilePicture) {
        setCoverImage(updatedVendor.profilePicture);
        setSelectedFile(null); // Clear selected file after successful upload
      }
      
      dispatch(setVendorCredentials({ vendor: updatedVendor, token }));
      alert("Profile image updated successfully");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to update profile image");
      // Revert to previous image on error
      setCoverImage(vendor.profilePicture || null);
      setSelectedFile(null);
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
                <input type="text" className="form-control" value={serviceAreas} onChange={(e) => setServiceAreas(e.target.value)} />
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
              <img 
                src={coverImage ? (coverImage.startsWith('data:') ? coverImage : `${serverURL}${coverImage}`) : coverimage} 
                className="w-100 h-100 object-fit-cover" 
                alt="Cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = coverimage; // Fallback to default image
                }}
              />

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
                // onChange={(e) => handleImageChange(e.target.files[0])}
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
                <RiCheckboxCircleLine color='green' size={20} /><span className='ms-2'>FAQs (2/5 recommended)</span>
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


