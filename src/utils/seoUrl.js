// Generate SEO-friendly URL for vendor profiles
export const generateVendorSeoUrl = (vendor) => {
  console.log('🛠️ Raw vendor data:', {
    city: vendor.city,
    serviceAreas: vendor.serviceAreas,
    businessType: vendor.businessType,
    vendorType: vendor.vendorType,
    venueType: vendor.venueType,
    category: vendor.category,
    businessName: vendor.businessName,
    name: vendor.name,
    nearLocation: vendor.nearLocation,
    location: vendor.location
  });
  
  // Handle city - use city, serviceAreas, or default (robust parsing)
  const normalize = (value) => {
    if (Array.isArray(value)) return value[0] || '';
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.startsWith('[')) {
        try {
          const arr = JSON.parse(trimmed);
          if (Array.isArray(arr)) return arr[0] || '';
        } catch (_) {}
      }
      return trimmed;
    }
    return '';
  };

  let city = 'location';
  if (vendor.city && typeof vendor.city === 'string') {
    city = vendor.city;
  } else if (vendor.serviceAreas && vendor.serviceAreas.length > 0) {
    city = normalize(vendor.serviceAreas);
  } else if (vendor.address?.city) {
    city = vendor.address.city;
  }
  city = String(city)
    .replace(/^\[\"?/, '')
    .replace(/\"?\]$/, '')
    .toLowerCase()
    .split('-')[0]
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'delhi';
  
  // Handle business type
  let businessType = vendor.businessType || 'vendor';
  
  // Handle vendor/venue type
  let type = 'service';
  if (vendor.vendorType) {
    type = vendor.vendorType;
  } else if (vendor.venueType) {
    type = vendor.venueType;
    businessType = 'venue';
  } else if (vendor.category) {
    type = vendor.category;
  }
  type = String(type).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'service';
  
  // Handle business name
  let businessName = 'business';
  if (vendor.businessName) {
    businessName = vendor.businessName;
  } else if (vendor.name) {
    businessName = vendor.name;
  }
  businessName = String(businessName).toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') || 'business';
  
  // Handle location - use nearLocation, address details, or fallbacks
  let location = 'central-delhi';
  if (vendor.nearLocation) {
    location = vendor.nearLocation;
  } else if (vendor.address?.locality) {
    location = vendor.address.locality;
  } else if (vendor.address?.area) {
    location = vendor.address.area;
  } else if (vendor.location) {
    location = vendor.location;
  } else if (vendor.serviceAreas && vendor.serviceAreas.length > 0) {
    location = vendor.serviceAreas[0].split(',')[0]; // Take first part of service area
  }
  
  location = String(location).toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') || 'central-delhi';
  
  const slug = `${businessName}-in-${location}`;
  const finalUrl = `/${businessType}/${city}/${type}/${slug}`;
  
  console.log('✅ Generated URL parts:', { city, businessType, type, businessName, location, finalUrl });
  
  return finalUrl;
};

// Navigate to vendor profile with SEO URL
export const navigateToVendor = (navigate, vendor) => {
  console.log('🔍 Vendor data for SEO URL:', vendor);
  const seoUrl = generateVendorSeoUrl(vendor);
  console.log('🔗 Generated SEO URL:', seoUrl);
  navigate(seoUrl);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
