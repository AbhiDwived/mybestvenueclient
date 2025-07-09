import React from "react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { MapPin } from 'lucide-react';
import { useGetSavedVendorsQuery, useUnsaveVendorMutation, useSaveVendorMutation } from "../../../features/savedVendors/savedVendorAPI";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/{Shared}/Loader";
import { useNavigate } from "react-router-dom";

export default function SavedVendor() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
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
    const [saveVendor] = useSaveVendorMutation();

    // Extract data from API response
    const savedVendors = savedVendorsData?.data || [];
    const savedVendorIds = savedVendorsData?.data?.map(v => v._id || v.id) || [];

    // Handle unsave vendor
    const handleRemoveSavedVendor = async (e, vendorId) => {
        e.stopPropagation();
        try {
            await unsaveVendor(vendorId).unwrap();
            toast.success("Vendor removed from favorites");
        } catch (err) {
            toast.error(`Error removing vendor: ${err.data?.message || 'Unknown error'}`);
        }
    };

    const handleVendorClick = (vendorId) => {
        if (vendorId) {
            navigate(`/preview-profile/${vendorId}`);
        } else {
            toast.error('Unable to open vendor profile');
        }
    };

    const toggleFavorite = async (e, id) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Please log in to save vendors.');
            return;
        }
        if (savedVendorIds.includes(id)) {
            // Optionally, implement unsave logic here
        } else {
            try {
                await saveVendor(id).unwrap();
                toast.success('Vendor saved to favorites!');
            } catch (err) {
                toast.error(err?.data?.message || 'Failed to save vendor');
            }
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
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {savedVendors.map((vendor) => (
                                <div 
                                    key={vendor.id} 
                                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
                                    onClick={() => handleVendorClick(vendor.id)}
                                >
                                    <div className="relative group">
                                        <img
                                            src={vendor.featuredImage || 'default-vendor-image.jpg'}
                                            alt={vendor.name}
                                            className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 transform group-hover:scale-105"
                                        />
                                        <button
                                            onClick={(e) => toggleFavorite(e, vendor.id)}
                                            className="absolute top-3 right-3 bg-white border border-gray-300 rounded p-1 shadow flex items-center justify-center w-8 h-8 text-red-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            {savedVendorIds.includes(vendor.id) ? (
                                                <FaHeart className="text-red-500" />
                                            ) : (
                                                <FaRegHeart />
                                            )}
                                        </button>
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-col justify-between flex-grow p-2 font-serif">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1 uppercase">{vendor.category || "Vendor"}</p>
                                            <div className="flex justify-between items-center gap-2 mb-2">
                                                <h5 className="text-md font-semibold truncate max-w-[65%] font-serif">
                                                    {vendor.name || "Vendor Name"}
                                                </h5>

                                                <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 bg-blue-50 border rounded-full px-2 py-1 w-fit shadow-sm">
                                                    <FaStar size={18} className="text-yellow-500" />
                                                    <span>{vendor.rating || "4.5"}</span>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="flex items-center text-sm text-gray-500 gap-1 mb-1">
                                                <MapPin size={14} />
                                                <span className="truncate">{vendor.location || "Location not specified"}</span>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex items-center flex-wrap gap-2 text-xs text-gray-600 mt-1">
                                            </div>
                                        </div>

                                        {/* Price / Rooms / Pax */}
                                        <div className="border-t mt-3 pt-3 text-sm text-gray-800">
                                            <div className="flex items-start gap-8 mb-2">
                                                {/* Veg price */}
                                                <div>
                                                    <div className="text-xs text-gray-500">Veg</div>
                                                    <div className="text-base font-semibold text-gray-800">
                                                        ₹ {vendor.priceVeg || "999"} <span className="text-xs font-normal text-gray-500">per plate</span>
                                                    </div>
                                                </div>

                                                {/* Non-Veg price */}
                                                <div>
                                                    <div className="text-xs text-gray-500">Non veg</div>
                                                    <div className="text-base font-semibold text-gray-800">
                                                        ₹ {vendor.priceNonVeg || "1,200"} <span className="text-xs font-normal text-gray-500">per plate</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Capacity, Rooms, and More */}
                                            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                                                <span className="text-gray-600 p-1 rounded">
                                                    {(() => {
                                                        let raw = vendor.services || [];
                                                        let vendorServices = Array.isArray(raw)
                                                            ? raw.length === 1 && typeof raw[0] === "string"
                                                                ? raw[0].split(',').map(s => s.trim())
                                                                : raw
                                                            : [];

                                                        return vendorServices.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {vendorServices.slice(0, 2).map((service, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="bg-sky-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                                                                    >
                                                                        {service}
                                                                    </span>
                                                                ))}
                                                                {vendorServices.length > 2 && (
                                                                    <span className="text-sm text-gray-600 hover:underline">
                                                                        +{vendorServices.length - 2} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">No services available</span>
                                                        );
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FaHeart size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Saved Vendors</h3>
                            <p className="text-gray-600 mb-4">
                                You haven't saved any vendors yet. Browse vendors and click the heart icon to save them.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                            >
                                Browse Vendors
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
