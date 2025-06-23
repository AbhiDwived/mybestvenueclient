import React from "react";
import { Heart, MapPin, Star, ExternalLink } from "lucide-react";
import { useGetSavedVendorsQuery, useUnsaveVendorMutation } from "../../../features/savedVendors/savedVendorAPI";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/{Shared}/Loader";

export default function SavedVendor() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    // RTK Query hooks
    const { 
        data: savedVendorsData, 
        isLoading, 
        isError, 
        error,
        refetch 
    } = useGetSavedVendorsQuery(undefined, {
        skip: !isAuthenticated,
    });
    
    const [unsaveVendor, { isLoading: isUnsaving }] = useUnsaveVendorMutation();

    // Extract data from API response
    const savedVendors = savedVendorsData?.data || [];

    // Handle unsave vendor
    const handleRemoveSavedVendor = async (vendorId) => {
        try {
            await unsaveVendor(vendorId).unwrap();
            toast.success("Vendor removed from favorites");
        } catch (err) {
            toast.error(`Error removing vendor: ${err.data?.message || 'Unknown error'}`);
        }
    };

    // Show loading state
    if (isLoading || isUnsaving) {
        return <Loader fullScreen />;
    }

    // Show error state
    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-2">Error loading saved vendors</p>
                    <button 
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <section className="w-full">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold mb-6">Saved Vendors</h2>

                    {savedVendors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedVendors.map((vendor) => (
                                <div key={vendor.id} className="border rounded-lg overflow-hidden shadow-sm">
                                    <div className="relative">
                                        <img
                                            src={vendor.featuredImage}
                                            alt={vendor.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <button
                                            onClick={() => handleRemoveSavedVendor(vendor.id)}
                                            disabled={isUnsaving}
                                            className="absolute top-2 right-2 bg-white p-1.5 rounded-full text-red-500 hover:text-red-700 disabled:opacity-50"
                                        >
                                            <Heart size={18} fill="currentColor" />
                                        </button>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-center mb-2">
                                            <span className="bg-wedding-blush-light text-wedding-blush px-2 py-1 rounded text-xs font-medium">
                                                {vendor.category}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold mb-2 text-wedding-dark">{vendor.name}</h3>

                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <MapPin size={14} className="mr-1" />
                                            <span>{vendor.location}</span>
                                        </div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <Star size={16} className="text-wedding-gold mr-1" fill="currentColor" />
                                                <span className="text-sm font-medium">{vendor.rating}</span>
                                                <span className="text-sm text-gray-500 ml-1">
                                                    ({vendor.reviewCount} reviews)
                                                </span>
                                            </div>
                                            <span className="text-wedding-dark font-semibold">{vendor.priceRange}</span>
                                        </div>

                                        <div className="flex space-x-2">
                                            <a
                                                href={`mailto:${vendor.contactEmail}`}
                                                className="flex-1 text-sm border border-gray-300 rounded-md py-2 text-center hover:bg-gray-50"
                                            >
                                                Message
                                            </a>
                                            <a
                                                href={`/vendors/${vendor.id}`}
                                                className="flex-1 text-sm bg-wedding-blush text-wedding-dark rounded-md py-2 text-center hover:bg-wedding-blush/90"
                                            >
                                                View Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Saved Vendors</h3>
                            <p className="text-gray-600 mb-4">
                                You haven't saved any vendors yet. Browse vendors and click the heart icon to save them.
                            </p>
                            <a
                                href="/vendors"
                                className="inline-block bg-wedding-blush text-wedding-dark px-4 py-2 rounded-md text-sm hover:bg-wedding-blush/90"
                            >
                                Browse Vendors
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
