import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FiUpload } from 'react-icons/fi';
import { RiCheckboxCircleLine } from "react-icons/ri";
import { FaExclamationCircle } from "react-icons/fa";
import coverimage from '../../assets/Images/user.png';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateProfileMutation, useGetVendorByIdQuery, useDeleteVendorPricingItemMutation, useGetPortfolioImagesQuery, useGetVendorsFaqsMutation } from "../../features/vendors/vendorAPI";
import { setVendorCredentials } from '../../features/vendors/vendorSlice';
import { MdOutlineAddCircle } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const VENDOR_TYPES = [
  'Art Gallery',
  'Amusement Park',
  'Auditorium',
  'Banquet Halls',
  'Bars',
  'Clubs',
  'Pool Side',
  'Conference Rooms',
  'Farm Houses',
  'Hotels',
  'Party Lawn',
  'Resort',
  'Restaurants',
  'Seminar Halls',
  'Theater',
  'Unique Venues',
  'Roof Top',
  'Gaming Zone',
  'Villas',
  'Pubs',
  'Meeting Rooms',
  'Boat / Yatch',
  'Vacation Homes',
  'Cafes',
  'Co-working Spaces',
  'Business Centres',
  'Guest Houses',
  '5 Star Hotel',
  'Marriage Garden',
  'Wedding Hotels',
  'Marriage Lawn',
  'Wedding Resort',
  'Training Rooms',
  'Kids Play Area',
  'Wedding Photographers',
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

  const { data, error, isLoading: isLoadingVendor, refetch } = useGetVendorByIdQuery(vendorId);
  // console.log("data ff", data);

  const [deleteVendorPricingItem, { isLoading: isDeleting }] = useDeleteVendorPricingItemMutation();

  // Get portfolio and FAQ data for completion tracking
  const { data: portfolioData } = useGetPortfolioImagesQuery(vendorId, { skip: !vendorId });
  const [getVendorsFaqs, { data: faqData }] = useGetVendorsFaqsMutation();

  // State to store FAQ data
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);

  // Function to refresh FAQ data
  const refreshFaqData = async () => {
    if (vendorId) {
      try {
        setIsLoadingFaqs(true);
        const result = await getVendorsFaqs({ vendorId }).unwrap();
        if (result?.faqs) {
          setFaqs(result.faqs);
        } else {
          setFaqs([]);
        }
      } catch (error) {
        console.error('Error refreshing FAQs:', error);
        setFaqs([]);
      } finally {
        setIsLoadingFaqs(false);
      }
    }
  };

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
    } else {
      // Fetch FAQ data when vendor ID is available
      setIsLoadingFaqs(true);
      getVendorsFaqs({ vendorId })
        .unwrap()
        .then((result) => {
          if (result?.faqs) {
            setFaqs(result.faqs);
          } else {
            setFaqs([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching FAQs:', error);
          setFaqs([]); // Set empty array on error
        })
        .finally(() => {
          setIsLoadingFaqs(false);
        });
    }
  }, [vendorId, isAuthenticated, navigate, getVendorsFaqs]);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const profileimg = vendor.profilePicture;

  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [serviceAreas, setServiceAreas] = useState([]);
  const [priceRange, setPriceRange] = useState([
    { type: '', price: '', unit: 'per plate' }
  ]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [contactName, setcontactName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pinCode, setPincode] = useState('');
  const [services, setServices] = useState(['']);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  // Add state for contact errors
  const [contactErrors, setContactErrors] = useState({});


  const fileInputRef = useRef(null);
  const serverURL = "http://localhost:5000"

  // Calculate profile completion dynamically with useMemo
  const profileCompletion = useMemo(() => {
    const completionItems = {
      basicInfo: {
        name: 'Basic information',
        completed: !!(
          businessName?.trim() &&
          category?.trim() &&
          businessDescription?.trim() &&
          (Array.isArray(serviceAreas) ? serviceAreas.length > 0 && serviceAreas.some(area => area?.trim()) : serviceAreas?.trim())
        ),
        weight: 20
      },
      contactDetails: {
        name: 'Contact details',
        completed: !!(contactEmail?.trim() && contactPhone?.trim() && contactName?.trim() && address?.trim()),
        weight: 20
      },
      profilePhoto: {
        name: 'Profile photo',
        completed: !!(coverImage || vendor?.profilePicture),
        weight: 15
      },
      portfolio: {
        name: 'Portfolio',
        completed: (portfolioData?.images?.length || 0) > 0,
        count: portfolioData?.images?.length || 0,
        total: 8,
        weight: 25
      },
      faqs: {
        name: 'FAQs',
        completed: faqs?.length >= 2,
        count: faqs?.length || 0,
        recommended: 5,
        weight: 20
      }
    };

    let totalWeight = 0;
    let completedWeight = 0;

    Object.values(completionItems).forEach(item => {
      totalWeight += item.weight;
      if (item.completed) {
        completedWeight += item.weight;
      }
    });

    const percentage = Math.round((completedWeight / totalWeight) * 100);

    // Debug log for development
    console.log('Profile Completion Debug:', {
      businessName: !!businessName?.trim(),
      category: !!category?.trim(),
      businessDescription: !!businessDescription?.trim(),
      serviceAreas: Array.isArray(serviceAreas) ? serviceAreas.length > 0 : !!serviceAreas?.trim(),
      contactEmail: !!contactEmail?.trim(),
      contactPhone: !!contactPhone?.trim(),
      contactName: !!contactName?.trim(),
      address: !!address?.trim(),
      city: !!city?.trim(),
      state: !!state?.trim(),
      country: !!country?.trim(),
      pinCode: !!pinCode?.trim(),
      profilePhoto: !!(coverImage || vendor?.profilePicture),
      portfolioCount: portfolioData?.images?.length || 0,
      faqCount: faqs?.length || 0,
      percentage
    });

    return {
      percentage,
      items: completionItems
    };
  }, [businessName, category, businessDescription, serviceAreas, contactEmail, contactPhone, contactName, address, coverImage, vendor?.profilePicture, portfolioData?.images, faqs]);

  useEffect(() => {
    if (vendor) {
      setBusinessName(vendor.businessName || 'Dream Wedding Photography');
      setCategory(vendor.vendorType || 'Photography');
      setBusinessDescription(data?.vendor?.description || vendor.description || 'This is a sample description.');
      setServiceAreas(vendor.serviceAreas || 'New Delhi, India');
      // setPriceRange(vendor.pricing || '10000 - 50000');
      setContactEmail(vendor.email || 'mybestvenuehelp@gmail.com');
      setContactPhone(vendor.phone || '‪+91 9999999999‬');
      setWebsite(vendor.website || 'mybestvenue.com');
      setcontactName(vendor.contactName || 'John Doe');
      setCoverImage(vendor.profilePicture || null);
      // setAddress(vendor.address || 'No Address');
      setAddress(data?.vendor?.address || 'No Address');
      setCity(data?.vendor?.city || 'New Delhi');
      setState(data?.vendor?.state || 'Delhi');
      setCountry(data?.vendor?.country || 'India');
      setPincode(data?.vendor?.pinCode || '000000');
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


  useEffect(() => {
    if (data?.vendor) {
      const pricingData = data.vendor.pricing;

      if (Array.isArray(pricingData) && pricingData.length > 0) {
        setPriceRange(pricingData.map(item => ({ ...item, isNew: false })));
      } else {
        // This will make sure even when no pricing is present, a default input is shown
        setPriceRange([{ type: '', price: '', unit: 'per plate', isNew: true }]);
      }
    }
  }, [data?.vendor?.pricing]);




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

    // formData.append("pricing", priceRange);
    formData.append("email", contactEmail);
    formData.append("phone", contactPhone);
    formData.append("website", website);
    formData.append("termsAccepted", true);
    formData.append("isApproved", true);
    formData.append("contactName", contactName);

    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("pinCode", pinCode);
    // formData.append("services", services);
    formData.append("services", Array.isArray(services) ? services.join(',') : services);
    priceRange.forEach((item, index) => {
      formData.append(`pricing[${index}][type]`, item.type);
      formData.append(`pricing[${index}][price]`, item.price);
      formData.append(`pricing[${index}][currency]`, item.currency || 'INR');
      formData.append(`pricing[${index}][unit]`, item.unit || 'per plate');
    });

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

  // Validation function for contact info
  const validateContactInfo = () => {
    const errors = {};
    let phone = contactPhone.replace(/\D/g, '');
    if (phone.startsWith('91') && phone.length > 10) phone = phone.slice(-10);
    if (!phone) errors.contactPhone = 'Contact phone is required';
    else if (phone.length !== 10) errors.contactPhone = 'Phone number must be exactly 10 digits';
    else if (!/^[6-9]\d{9}$/.test(phone)) errors.contactPhone = 'Invalid Indian phone number';
    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update handleSave for contact
  const handleSave = async (type = "info") => {
    if (!vendorId) {
      toast.error("Error: Vendor ID is missing. Please try logging in again.");
      navigate('/vendor/login');
      return;
    }
    if (type === 'contact' && !validateContactInfo()) return;
    // if (type === 'info') setIsSavingInfo(true);
    // if (type === 'contact') setIsSavingContact(true);

    try {
      // console.log('Attempting to update vendor with ID:', vendorId);
      const formData = prepareFormData();

      const res = await updateProfile({
        vendorId,
        profileData: formData,
      }).unwrap();
      await refetch();

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
    finally {
      // Reset both loaders
      setIsSavingInfo(false);
      setIsSavingContact(false);
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
      // formData.append("pricing", priceRange);
      formData.append("email", contactEmail);
      formData.append("phone", contactPhone);
      formData.append("website", website);
      formData.append("contactName", contactName);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("pinCode", pinCode);
      formData.append("services", services);
      priceRange.forEach((item, index) => {
        formData.append(`pricing[${index}][type]`, item.type);
        formData.append(`pricing[${index}][price]`, item.price);
        formData.append(`pricing[${index}][currency]`, item.currency || 'INR');
        formData.append(`pricing[${index}][unit]`, item.unit || 'per plate');
      });

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


  // pricing 

  const handlePricingChange = (index, field, value) => {
    const updated = [...priceRange];
    updated[index][field] = value;
    setPriceRange(updated);
  };



  const handleAddPricing = () => {
    setPriceRange([
      ...priceRange,
      { type: '', price: '', unit: 'per plate', isNew: true }
    ]);
  };

  // const handleRemovePricing = (index) => {
  //   if (priceRange.length <= 1) return; // prevent deletion of the only row
  //   setPriceRange(priceRange.filter((_, i) => i !== index));
  // };

  const handleRemovePricing = async (index) => {
    const item = priceRange[index];


    if (item._id) {
      try {
        await deleteVendorPricingItem({ vendorId, pricingId: item._id }).unwrap();
        toast.success("Price range deleted Succesfully");
      } catch (err) {
        // console.error("Failed to delete from DB:", err);
        toast.error("Failed to delete pricing data");
        return;
      }
    }


    if (priceRange.length > 1) {
      setPriceRange(priceRange.filter((_, i) => i !== index));
    }
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
                <label className="form-label">City</label>
                <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">State</label>
                <input type="text" className="form-control" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Pin Code</label>
                <input type="text" className="form-control" value={pinCode} onChange={(e) => setPincode(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Country</label>

                <input type="text" className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} />
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

                {priceRange.map((item, index) => (
                  <div key={index} className="d-flex gap-2 mb-2 align-items-center">

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type (e.g. Veg)"
                      value={item.type}
                      onChange={(e) => handlePricingChange(index, 'type', e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handlePricingChange(index, 'price', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      list="pricing-units"
                      placeholder="Unit (e.g. per plate)"
                      value={item.unit}
                      onChange={(e) => handlePricingChange(index, 'unit', e.target.value)}
                    />
                    <datalist id="pricing-units">
                      <option value="per plate" />
                      <option value="per head" />
                      <option value="per person" />
                    </datalist>

                    {/* Show Add Button only on the last row */}
                    {index === priceRange.length - 1 && (
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{ padding: "6px 10px", backgroundColor: '#0f4c81' }}
                        onClick={handleAddPricing}
                        title="Add another pricing"
                      >
                        <MdOutlineAddCircle size={20} color="white" />
                      </button>
                    )}

                    {/* Show Remove Button only if it's NOT the first item */}
                    {index !== 0 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => handleRemovePricing(index)}
                        title="Remove pricing"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                ))}

              </div>


              {/* <button type="button" onClick={handleSave} className="btn text-white" style={{ backgroundColor: '#0f4c81' }}>
                {isLoading ? 'Saving...' : 'Save Information'}
              </button> */}
              <button
                type="button"
                onClick={() => handleSave("info")}
                className="btn text-white"
                style={{ backgroundColor: '#0f4c81' }}
              >
                {isSavingInfo ? 'Saving...' : 'Save Information'}
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
            {isLoadingFaqs && (
              <div className="text-center mb-2">
                <small className="text-muted">Loading completion data...</small>
              </div>
            )}
            <div className="mb-2 d-flex justify-content-between small">
              <span>Overall completion</span>
              <span className={`${(profileCompletion?.percentage || 0) >= 80 ? 'text-success' : (profileCompletion?.percentage || 0) >= 50 ? 'text-warning' : 'text-danger'}`}>
                {profileCompletion?.percentage || 0}%
              </span>
            </div>
            <div className="progress mb-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${profileCompletion?.percentage || 0}%`,
                  backgroundColor: '#0f4c81'
                }}
              ></div>
            </div>
            <ul className="list-unstyled">
              {profileCompletion?.items && Object.entries(profileCompletion.items).map(([key, item]) => (
                <li key={key} className="d-flex align-items-center mb-2">
                  {item.completed ? (
                    <RiCheckboxCircleLine color='green' size={20} />
                  ) : (
                    <FaExclamationCircle color='orange' size={18} />
                  )}
                  <span className='ms-2'>
                    {item.name}
                    {key === 'portfolio' && ` (${item.count || 0}/${item.total || 8})`}
                    {key === 'faqs' && ` (${item.count || 0}/${item.recommended || 5} recommended)`}
                  </span>
                </li>
              ))}
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
                <input type="email" className="form-control" value={contactEmail} readOnly disabled />
              </div>
              <div className="mb-3">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className={`form-control ${contactErrors.contactPhone ? 'border-red-500' : ''}`}
                  value={contactPhone}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.startsWith('91') && val.length > 10) val = val.slice(-10);
                    if (val.length > 10) val = val.slice(0, 10);
                    setContactPhone(val);
                  }}
                  maxLength={10}
                />
                {contactErrors.contactPhone && <span className="text-red-500 text-xs mt-1">{contactErrors.contactPhone}</span>}
              </div>
              <div className="mb-3">
                <label className="form-label">Website (optional)</label>
                <input type="url" className="form-control" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              {/* <button type="button" onClick={handleSave} className="btn text-white" style={{ backgroundColor: '#0f4c81' }}>
                {isLoading ? 'Saving...' : 'Save Contact Info'}
              </button> */}
              <button
                type="button"
                onClick={() => handleSave("contact")}
                className="btn text-white"
                style={{ backgroundColor: '#0f4c81' }}
              >
                {isSavingContact ? 'Saving...' : 'Save Contact Info'}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;