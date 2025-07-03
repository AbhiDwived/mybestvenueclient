import React, { useState, useRef, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import { RiCheckboxCircleLine } from "react-icons/ri";
import { FaExclamationCircle } from "react-icons/fa";
import coverimage from '../../assets/Images/Navneegt.jpeg';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateProfileMutation, useGetVendorByIdQuery } from "../../features/vendors/vendorAPI";
import { setVendorCredentials } from '../../features/vendors/vendorSlice';
import { MdOutlineAddCircle } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const VENDOR_TYPES = [
  'Banquet Halls',
  'Hotels',
  'Marriage Garden',
  'Kalyana Mandapams',
  'Wedding Resorts',
  'Wedding Lawns & Farmhouses',
  'Wedding Photographers',
  'Party Places',
  'Photographers',
  'Caterers',
  'Wedding Decorators',
  'Wedding Makeup',
  'Wedding Planners',
  'Gifts',
  'Florist',
  'Invitation',
  'Choreographers',
  'Photobooth',
  'DJ',
  'Cakes',
  'Musics',
  'TentHouse',
  'Transportation',
  'Videography',
  'Other'
];

const LOCATIONS = [
  'Delhi',
  'New Delhi',
  'Noida',
  'Greater Noida',
  'Gurgaon',
  'Faridabad',
  'Ghaziabad',
  'Indirapuram',
  'Dwarka',
  'Rohini',
  'Janakpuri',
  'Laxmi Nagar',
  'Vasant Kunj',
  'Connaught Place',
  'Saket',
  'Other'
];



const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vendor = useSelector((state) => state.vendor.vendor);
  const isAuthenticated = useSelector((state) => state.vendor.isAuthenticated);
  const token = useSelector((state) => state.vendor.token);

  // Extract vendor ID with better validation
  const vendorId = vendor?._id || vendor?.id;

  const { data, error, isLoading: isLoadingVendor } = useGetVendorByIdQuery(vendorId);
  // console.log("data ff", data);


  // Ensure we have the vendor ID and redirect if not authenticated

  // console.log("descriptionqqqq", vendor);
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to access this page');
      navigate('/vendor/login');
      return;
    }

    if (!vendorId) {
      // console.error('Vendor ID is missing:', vendor);
      toast.error('Error: Vendor ID is missing. Please try logging in again.');
      navigate('/vendor/login');
    }
  }, [vendorId, isAuthenticated, navigate]);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const profileimg = vendor.profilePicture;

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
  const [address, setAddress] = useState('');
  const [services, setServices] = useState(['']);

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
      setAddress(vendor.address || 'New Delhi, India');
      // setServices(data?.vendor.services || 'Photographers,Gifts');
      const servicesData = data?.vendor?.services;
      if (Array.isArray(servicesData)) {
        setServices(servicesData);
      } else if (typeof servicesData === 'string') {
        setServices(servicesData.split(',').map(s => s.trim()));
      } else {
        // setServices(['Photographers', 'Gifts']);
        setServices(['']);

      }



    }
  }, [vendor, data]);



  const prepareFormData = (imageFile = null) => {
    const formData = new FormData();

    // Log the vendor ID being used
    // console.log('Preparing form data with vendor ID:', vendorId);

    formData.append("_id", vendorId); // Add vendor ID to form data
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

    formData.append("address", address);
    // formData.append("services", services);
    formData.append("services", Array.isArray(services) ? services.join(',') : services);


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
    if (!vendorId) {
      toast.error("Error: Vendor ID is missing. Please try logging in again.");
      navigate('/vendor/login');
      return;
    }

    try {
      // console.log('Attempting to update vendor with ID:', vendorId);
      const formData = prepareFormData();

      const res = await updateProfile({
        vendorId,
        profileData: formData,
      }).unwrap();

      const updatedVendor = res.vendor || res;

      // Only update the image state if a new image was actually returned
      if (updatedVendor.profilePicture && updatedVendor.profilePicture !== coverImage) {
        setCoverImage(updatedVendor.profilePicture);
      }

      dispatch(setVendorCredentials({ vendor: updatedVendor, token }));
      toast.success("Profile updated successfully!");
    } catch (err) {
      // console.error('Update failed:', err);
      if (err.status === 404) {
        toast.error("Error: Vendor not found. Please try logging in again.");
        navigate('/vendor/login');
      } else if (err.status === 401) {
        toast.error("Error: Unauthorized. Please try logging in again.");
        navigate('/vendor/login');
      } else {
        toast.error("Failed to update profile: " + (err.data?.message || err.message || "Unknown error"));
      }
    }
  };

  const handleImageChange = async (file) => {
    if (!vendorId || !file) {
      toast.error("Unable to update image. Vendor ID or file missing.");
      return;
    }

    try {
      // Create a local preview immediately
      const localPreview = URL.createObjectURL(file);
      setSelectedFile(file);
      setCoverImage(localPreview); // Set temporary preview

      // Prepare and send the update
      const formData = new FormData();
      formData.append("profilePicture", file);
      formData.append("_id", vendorId);

      // Keep existing data
      formData.append("businessName", businessName);
      formData.append("vendorType", category);
      formData.append("description", businessDescription);
      formData.append("serviceAreas", Array.isArray(serviceAreas) ? serviceAreas.join(",") : serviceAreas);
      formData.append("pricing", priceRange);
      formData.append("email", contactEmail);
      formData.append("phone", contactPhone);
      formData.append("website", website);
      formData.append("contactName", contactName);
      formData.append("address", address);
      formData.append("services", services);

      const res = await updateProfile({
        vendorId,
        profileData: formData,
      }).unwrap();

      // console.log("services", vendor.services)
      // Update with the server URL
      if (res.profilePicture) {
        setCoverImage(res.profilePicture);
        setSelectedFile(null); // Clear selected file after successful upload

        // Update the vendor state in Redux
        dispatch(setVendorCredentials({
          vendor: { ...vendor, profilePicture: res.profilePicture },
          token
        }));

        toast.success("Profile image updated successfully");
      } else {
        throw new Error("No profile picture URL received from server");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to update profile image: " + (err.message || "Unknown error"));
      // Revert to previous image on error
      setCoverImage(vendor.profilePicture || null);
      setSelectedFile(null);
    } finally {
      // Clean up the temporary object URL
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    }
  };



  const handleServiceChange = (index, value) => {
    const updated = [...services];
    updated[index] = value;
    setServices(updated);
  };

  const handleAddService = () => {
    setServices([...services, ""]);
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };


  if (!isAuthenticated || !vendorId) {
    return null; // Return null as useEffect will handle the redirect
  }

  return (
    <div className="font-serif p-2">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                <label className="form-label"> Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {VENDOR_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Business Description</label>
                <textarea className="form-control" rows="4" value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                {/* <input type="text" className="form-control" value={serviceAreas} onChange={(e) => setServiceAreas(e.target.value)} /> */}
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={serviceAreas}
                  onChange={(e) => setServiceAreas(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>




              <div className="mb-3">
                <label className="form-label">Services</label>
                {(services.length > 0 ? services : ['']).map((service, index) => (
                  <div key={index} className="d-flex align-items-center gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={service}
                      onChange={(e) => handleServiceChange(index, e.target.value)}
                    />

                    {/* ✅ Corrected Add button condition */}
                    {index === services.length - 1 && (
                      <button
                        type="button"
                        className="d-flex align-items-center justify-content-center rounded"
                        onClick={handleAddService}
                        style={{ padding: "6px 10px", backgroundColor: '#0f4c81' }}
                      >
                        <MdOutlineAddCircle size={20} color="white" />
                      </button>
                    )}

                    {services.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                        onClick={() => handleRemoveService(index)}
                        style={{ padding: "6px 10px" }}
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                ))}
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
                src={coverImage || vendor.profilePicture || coverimage}
                className="w-100 h-100 object-fit-cover"
                alt="Cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = coverimage; // Fallback to default image
                  console.error("Failed to load image:", coverImage);
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
                accept="image/*"
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


