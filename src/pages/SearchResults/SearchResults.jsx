import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useGetAllPublicVendorsQuery } from '../../features/vendors/vendorAPI';
import DiscoverImage from "../../assets/newPics/discoverImage.jpg";
import Loader from "../../components/{Shared}/Loader";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const selectedCity = searchParams.get('city') || 'All India';

  const { data: vendorData, isLoading, error } = useGetAllPublicVendorsQuery();

  const filteredVendors = React.useMemo(() => {
    if (!vendorData?.vendors) return [];
    
    return vendorData.vendors.filter(vendor => {
      const matchesSearch = searchTerm === '' || 
        vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.serviceAreas?.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = category === '' || vendor.vendorType === category;

      const matchesLocation = selectedCity === 'All India' || 
        vendor.serviceAreas?.includes(selectedCity) ||
        vendor.address?.city === selectedCity;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [vendorData, searchTerm, category, selectedCity]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error loading vendors: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {searchTerm && <span>Search: "{searchTerm}"</span>}
          {category && <span>Category: {category}</span>}
          {selectedCity !== 'All India' && <span>Location: {selectedCity}</span>}
        </div>
        <p className="mt-2 text-gray-600">{filteredVendors.length} vendors found</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <div key={vendor._id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-48">
              <img
                src={vendor.profilePicture || DiscoverImage}
                alt={vendor.businessName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 right-0 m-2 px-2 py-1 bg-blue-500 text-white rounded">
                {vendor.vendorType}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{vendor.businessName}</h3>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  {vendor.serviceAreas?.join(', ') || vendor.address?.city || 'Location not specified'}
                </p>
                
                {vendor.pricingRange && (
                  <p className="text-sm text-gray-600">
                    <i className="fas fa-tag mr-2"></i>
                    Price Range: {vendor.pricingRange.currency} {vendor.pricingRange.min} - {vendor.pricingRange.max}
                  </p>
                )}
                
                <p className="text-sm text-gray-500 line-clamp-2">
                  {vendor.description || 'No description available'}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <Link
                  to={`/vendor/${vendor._id}`}
                  className="px-4 py-2 bg-[#0f4c81] text-white rounded hover:bg-[#0d3d6a] transition-colors"
                >
                  View Details
                </Link>
                
                <button
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Add to Wishlist"
                >
                  <i className="far fa-heart"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No vendors found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          <Link
            to="/"
            className="px-6 py-2 bg-[#0f4c81] text-white rounded hover:bg-[#0d3d6a] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 