import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterVendorMutation } from '../../features/vendors/vendorAPI';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeOff } from 'react-feather';
import { showToast } from '../../utils/toast';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Country, State, City } from 'country-state-city';



const VENDOR_TYPES = [
  'Photographers',
  'Makeup Artists',
  'Mehndi Artists',
  'Bands',
  'Cake Vendors',
  'Caterers',
  'Florists',
  'Decorators',
  'Bridal Wear',
  'Jewellers',
  'Groom Wear',
  'Choreographers',
  'Event Planners',
  'DJs',
  'Magicians',
  'Gift Providers',
  'Tent House Services',
  'Entertainers',
  'Bus On Rent',
  'Wedding Planners',
  'Wedding Photographers',
  'Astrologers'
];

const VENUE_TYPES = [
  'Art Gallery',
  'Amusement Park',
  'Auditorium',
  'Banquet halls',
  'Bars',
  'Clubs',
  'Pool Side',
  'Conference Rooms',
  'Farm Houses',
  'Hotels',
  'Party lawn',
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
  'Boat Yatch',
  'Vacation Homes',
  'Cafes',
  'Co-working spaces',
  'Business Centres',
  'Guest Houses',
  '5 Star Hotel',
  'Marriage Garden',
  'Wedding Hotels',
  'Marriage Lawn',
  'Wedding Resort',
  'Training Rooms',
  'Kids Play Area'
];

const NEAR_LOCATIONS = {
  'New Delhi': ['Connaught Place', 'India Gate', 'Red Fort', 'Karol Bagh', 'Paharganj'],
  'Mumbai': ['Bandra', 'Andheri', 'Juhu', 'Powai', 'Colaba', 'Marine Drive'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Jayanagar'],
  'Chennai': ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'OMR'],
  'Pune': ['Koregaon Park', 'Hinjewadi', 'Baner', 'Wakad', 'Kothrud'],
  'Gurgaon': ['Cyber City', 'Golf Course Road', 'Sohna Road', 'MG Road', 'Sector 14'],
  'Noida': ['Sector 18', 'Sector 62', 'Greater Noida', 'Sector 15', 'Sector 37']
};

const VendorSignup = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    businessName: '',
    businessType: '',
    vendorType: '',
    venueType: '',
    otherVendorType: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    country: 'IN',
    state: '',
    city: '',
    nearLocation: '',
    customNearLocation: '',
    pinCode: '',
    address: '',
    serviceAreas: []
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [profilePicture, setProfilePicture] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [userType, setUserType] = useState('vendor');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerVendor] = useRegisterVendorMutation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [businessNameError, setBusinessNameError] = useState('');

  const nameInputRef = useRef(null);
    const isMounted = useRef(true);
    const timeoutRef = useRef();
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 'Weak',
    strengthColor: 'text-red-500',
    strengthWidth: '20%',
    failedCriteria: []
  });

  // useEffect(() => {
  //   isMounted.current = true;
  //   return () => {
  //     isMounted.current = false;
  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   };
  // }, []);
    useEffect(() => {
      isMounted.current = true;
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
      // Load Indian states on component mount
      const indianStates = State.getStatesOfCountry('IN');
      setStates(indianStates);
      return () => {
        isMounted.current = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

  const handleUserTypeSwitch = (type) => {
    if (type === 'couple') {
      navigate('/user/signup');
    } else {
      setUserType('vendor');
    }
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;

    if (name === 'businessName') {
      setBusinessNameError('');
    }

    if (name === 'country') {
      const countryStates = State.getStatesOfCountry(value);
      setStates(countryStates);
      setCities([]);
      setFormData(prev => ({
        ...prev,
        country: value,
        state: '',
        city: '',
        nearLocation: '',
        pinCode: ''
      }));
    } else if (name === 'state') {
      const stateCities = City.getCitiesOfState(formData.country, value);
      setCities(stateCities);
      setFormData(prev => ({
        ...prev,
        state: value,
        city: '',
        nearLocation: '',
        pinCode: ''
      }));
    } else if (name === 'city') {
      setFormData(prev => ({
        ...prev,
        city: value,
        nearLocation: ''
      }));
    } else if (name === 'pinCode') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 6) {
        setFormData(prev => ({ ...prev, pinCode: numericValue }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: inputType === 'checkbox' ? checked : value,
        ...(name === 'vendorType' && value !== 'Other' ? { otherVendorType: '' } : {})
      }));
    }
  };



  // Password strength validation logic (copied from UserSignup)
  const isStrongPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password);
  };

  const evaluatePasswordStrength = (password) => {
    const criteria = [
      { test: (p) => p.length >= 8 && p.length <= 20, message: "Length (8-20 characters)" },
      { test: (p) => /[A-Z]/.test(p), message: "At least 1 uppercase letter" },
      { test: (p) => /[a-z]/.test(p), message: "At least 1 lowercase letter" },
      { test: (p) => /\d/.test(p), message: "At least 1 number" },
      { test: (p) => /[@$!%*?&]/.test(p), message: "At least 1 special character" }
    ];
    const passedCriteria = criteria.filter(c => c.test(password));
    let strength = 'Weak';
    let strengthColor = 'text-red-500';
    let strengthWidth = '20%';
    if (passedCriteria.length === 5) {
      strength = 'Strong';
      strengthColor = 'text-green-500';
      strengthWidth = '100%';
    } else if (passedCriteria.length >= 4) {
      strength = 'Good';
      strengthColor = 'text-yellow-500';
      strengthWidth = '80%';
    } else if (passedCriteria.length >= 3) {
      strength = 'Medium';
      strengthColor = 'text-orange-500';
      strengthWidth = '60%';
    } else if (passedCriteria.length >= 2) {
      strength = 'Weak';
      strengthColor = 'text-red-500';
      strengthWidth = '40%';
    }
    return {
      strength,
      strengthColor,
      strengthWidth,
      failedCriteria: criteria.filter(c => !c.test(password)).map(c => c.message)
    };
  };

  // Render method for password strength scale
  const renderPasswordStrengthScale = () => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${passwordStrength.strengthColor.replace('text-', 'bg-')}`}
        style={{ width: passwordStrength.strengthWidth }}
      ></div>
    </div>
  );

  // Update password strength on change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      const strengthEvaluation = evaluatePasswordStrength(value);
      setPasswordStrength(strengthEvaluation);
    }
  };

  // Update confirm password change to check match
  const handleConfirmPasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formData.password !== value) {
      showToast("warn", "Passwords do not match");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    // Debug log for city and cities
    console.log('Submitting city:', formData.city, 'Available cities:', cities.map(c => c.name));

    // 🔹 Custom Required Fields
    if (!formData.contactName.trim()) errors.push("Full Name is required");
    if (!formData.businessName.trim()) errors.push("Business Name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.phone.trim()) errors.push("Phone number is required");
    if (!formData.password.trim()) errors.push("Password is required");
    if (!formData.confirmPassword.trim()) errors.push("Confirm Password is required");

    // 🔹 Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      errors.push("Please enter a valid email address");
    }

    // 🔹 Phone validation
    const phone = formData.phone.trim();
    if (!isValidPhoneNumber(phone)) {
      errors.push("Please enter a valid phone number.");
    }

    // 🔹 Password strength validation
    const strengthCheck = evaluatePasswordStrength(formData.password);
    if (strengthCheck.strength !== 'Strong') {
      errors.push("Please strengthen your password. Missing requirements: " + strengthCheck.failedCriteria.join(', '));
    }

    // 🔹 Password match
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    // 🔹 Business type validation
    if (!formData.businessType) {
      errors.push("Please select business type (Vendor or Venue)");
    }

    if (formData.businessType === 'vendor' && !formData.vendorType) {
      errors.push("Please select a vendor type");
    }

    if (formData.businessType === 'venue' && !formData.venueType) {
      errors.push("Please select a venue type");
    }

    if (formData.vendorType === "Other" && !formData.otherVendorType.trim()) {
      errors.push("Please specify your custom vendor type");
    }

    if (!formData.country) {
      errors.push("Please select a country");
    }

    if (!formData.state) {
      errors.push("Please select a state");
    }

    // 🔹 City validation (extra check)
    if (!formData.city) {
      errors.push("Please select a city");
    } else if (!cities.map(c => c.name).includes(formData.city)) {
      errors.push("Invalid city selected. Please choose a city from the list.");
    }

    if (!formData.pinCode || formData.pinCode.length !== 6) {
      errors.push("Please enter a valid 6-digit PIN code");
    }

    // 🔹 Terms and Conditions - Specific Toast Notification
    if (!formData.termsAccepted) {
      // Show a more descriptive toast notification
      showToast.warning("Please accept the Terms of Service and Privacy Policy to continue", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light"
      });

      // Prevent form submission
      e.preventDefault();
      return;
    }

    // Show errors if any
    if (errors.length > 0) {
      errors.forEach((err) => showToast.error(err));
      return;
    }


    if (isLoading) return;

    setIsLoading(true);
    const { confirmPassword, customNearLocation, ...vendorData } = formData;
    const data = new FormData();

    Object.entries(vendorData).forEach(([key, value]) => {
      if (key === "vendorType" && vendorData.vendorType === "Other") {
        data.append(key, vendorData.otherVendorType.trim());
      } else if (key === "nearLocation") {
        const finalNearLocation = value === 'other' ? customNearLocation : value;
        data.append(key, finalNearLocation || '');
      } else if (key === "contactName" || key === "businessName" || key === "email") {
        data.append(key, value.trim());
      } else if (key === "city") {
        // Defensive: always submit city as a string
        const cityValue = typeof value === 'string' ? value : (Array.isArray(value) ? value[0] : '');
        data.append(key, cityValue);
      } else if (
        key !== "otherVendorType" &&
        key !== "venueType" &&
        key !== "vendorType" &&
        key !== "serviceAreas" // Avoid appending empty array; we append properly below
      ) {
        data.append(key, value);
      } else if (key === "vendorType" && vendorData.businessType === "vendor") {
        data.append(key, value);
      } else if (key === "venueType" && vendorData.businessType === "venue") {
        data.append(key, value);
      }
    });

    const selectedState = states.find(s => s.isoCode === formData.state);
    const locationString = `${formData.city}, ${selectedState?.name || formData.state}, India`;
    if (formData.city && selectedState && locationString) {
      // Append serviceAreas exactly once as a JSON string array
      data.append("serviceAreas", JSON.stringify([locationString]));
    }
    data.append("termsAccepted", formData.termsAccepted ? "true" : "false");

    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    try {
      const res = await registerVendor(data).unwrap();
      console.log("Registration response:", res);

      // Ensure loading state is reset
      if (!isMounted.current) return;
      setIsLoading(false);

      const { email } = formData;
      if (email) {
        showToast.success("✅ Registration successful! Please check your email for the OTP.");

        // Prefetch the OTP verification page
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = `/vendor/verify-otp?email=${encodeURIComponent(email)}`;
        document.head.appendChild(link);

        // Use timeout similar to UserSignup for navigation
        timeoutRef.current = setTimeout(() => {
          if (isMounted.current) {
            navigate(`/vendor/verify-otp?email=${encodeURIComponent(email)}`, {
              state: {
                email: email,
                businessType: formData.businessType,
                vendorType: formData.businessType === 'vendor' ? (formData.vendorType === "Other" ? formData.otherVendorType : formData.vendorType) : null,
                venueType: formData.businessType === 'venue' ? formData.venueType : null
              }
            });
          }
        }, 1000);
      } else {
        showToast.error('Registration incomplete. Please try again.');
      }
    } catch (err) {
      // Ensure loading state is reset
      if (!isMounted.current) return;
      setIsLoading(false);

      const errorMessage = err.data?.message || 'Registration failed. Please try again.';
      if (errorMessage === 'Business name already taken') {
        setBusinessNameError('Business name already taken');
        const businessNameInput = document.getElementById('businessName');
        if (businessNameInput) businessNameInput.focus();
      }
      showToast.error(`❌ ${errorMessage}`);
    }
  };


  return (
    <div className="flex items-center justify-center px-4 mt-6">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">Create Vendor Account</h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join myBestVenue to showcase your services, connect with engaged couples, and grow your business.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => handleUserTypeSwitch('couple')}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${userType === 'couple' ? 'bg-white text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              User
            </button>
            <button
              onClick={() => handleUserTypeSwitch('vendor')}
              className={`flex-1 py-1 px-4 rounded-md transition-all ${userType === 'vendor' ? 'bg-white text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="John Doe"
                ref={nameInputRef}
                required
                maxLength="25"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name <span className="text-red-500">*</span></label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="ABC Photography"
                required
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${businessNameError ? 'border-red-500' : 'border-gray-300'}`}
                aria-invalid={!!businessNameError}
                aria-describedby={businessNameError ? 'businessName-error' : undefined}
              />
              {businessNameError && (
                <p id="businessName-error" className="text-red-500 text-xs mt-1">{businessNameError}</p>
              )}
            </div>

            {/* Business Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Business Type <span className="text-red-500">*</span></label>
              <div className="flex space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.businessType === 'vendor'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      businessType: prev.businessType === 'vendor' ? '' : 'vendor',
                      vendorType: '',
                      venueType: ''
                    }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Vendor Type</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.businessType === 'venue'}
                    onChange={() => setFormData(prev => ({
                      ...prev,
                      businessType: prev.businessType === 'venue' ? '' : 'venue',
                      vendorType: '',
                      venueType: ''
                    }))}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Venue Type</span>
                </label>
              </div>
            </div>

            {/* Vendor Type Dropdown */}
            {formData.businessType === 'vendor' && (
              <div>
                <label htmlFor="vendorType" className="block text-sm font-medium text-gray-700 mb-1">Vendor Type <span className="text-red-500">*</span></label>
                <select
                  id="vendorType"
                  name="vendorType"
                  value={formData.vendorType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a vendor type</option>
                  {VENDOR_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Venue Type Dropdown */}
            {formData.businessType === 'venue' && (
              <div>
                <label htmlFor="venueType" className="block text-sm font-medium text-gray-700 mb-1">Venue Type <span className="text-red-500">*</span></label>
                <select
                  id="venueType"
                  name="venueType"
                  value={formData.venueType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a venue type</option>
                  {VENUE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.vendorType === 'Other' && (
              <div>
                <label htmlFor="otherVendorType" className="block text-sm font-medium text-gray-700 mb-1">Other Vendor Type <span className="text-red-500">*</span></label>
                <input
                  id="otherVendorType"
                  name="otherVendorType"
                  type="text"
                  value={formData.otherVendorType}
                  onChange={handleChange}
                  placeholder="Enter your custom vendor type"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Country dropdown */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IN">India</option>
              </select>
            </div>

            {/* State dropdown */}
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City dropdown */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                disabled={!formData.state}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Near Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Near Location</label>
              <select
                value={formData.nearLocation === 'other' ? 'other' : (NEAR_LOCATIONS[formData.city]?.includes(formData.nearLocation) ? formData.nearLocation : '')}
                onChange={(e) => {
                  if (e.target.value === 'other') {
                    setFormData(prev => ({ ...prev, nearLocation: 'other', customNearLocation: '' }));
                  } else {
                    setFormData(prev => ({ ...prev, nearLocation: e.target.value, customNearLocation: '' }));
                  }
                }}
                disabled={!formData.city}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Near Location (Optional)</option>
                {formData.city && NEAR_LOCATIONS[formData.city]?.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
              {formData.nearLocation === 'other' && (
                <input
                  type="text"
                  placeholder="Enter your near location"
                  value={formData.customNearLocation || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, customNearLocation: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  autoFocus
                />
              )}
            </div>

            {/* Pin Code field */}
            <div>
              <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">Pin Code <span className="text-red-500">*</span></label>
              <input
                id="pinCode"
                name="pinCode"
                type="text"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter 6-digit PIN code"
                required
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                title="Please enter a valid email address (e.g. user@example.com)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
              <PhoneInput
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(value) => setFormData((prev) => ({ ...prev, phone: value }))}
                required
                defaultCountry="IN"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-gray-700">Password <span className="text-red-500">*</span></label>
                {formData.password && (
                  <span className={`text-xs font-semibold ${passwordStrength.strengthColor}`}>{passwordStrength.strength}</span>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  style={{ top: 0, bottom: 0 }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {formData.password && (
                  <div className="absolute inset-y-0 flex items-center right-10 w-16">
                    {renderPasswordStrengthScale()}
                  </div>
                )}
              </div>
              {formData.password && passwordStrength.failedCriteria.length > 0 && (
                <ul className="text-xs text-gray-500 mt-1">
                  {passwordStrength.failedCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              )}
            </div>
            {/* Confirm Password */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none mt-4"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <div className="flex items-center space-x-4">
                {profilePicture && (
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Preview"
                    className="h-16 w-16 rounded-full object-cover border"
                  />
                )}
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer inline-block px-4 py-2 text-white text-sm font-medium rounded-md shadow transition"
                  style={{ backgroundColor: 'rgb(15, 76, 129)' }}
                >
                  Choose File
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
              {profilePicture && (
                <p className="mt-2 text-sm text-gray-500">{profilePicture.name}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 mt-3">
              <input
                id="termsAccepted"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 text-[#0F4C81] border-gray-300 rounded focus:ring-[#0F4C81] mx-3"
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <a href="/terms" className="text-[#0F4C81] hover:text-[#0D3F6A] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#0F4C81] hover:text-[#0D3F6A] hover:underline">
                  Privacy Policy
                </a>
                <span className="text-red-500">*</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 mt-2 text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#0F4C81] 
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#0F4C81] hover:bg-[#0D3F6A]'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/vendor/login" className="text-[#0F4C81] font-medium hover:text-[#0D3F6A] hover:underline">
              Log In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
