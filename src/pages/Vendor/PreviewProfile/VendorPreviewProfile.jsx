import React, { useEffect, useState } from 'react';
import {  FaLinkedinIn, FaPhoneAlt,  } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineCalendar } from 'react-icons/hi';
import { ImCross } from "react-icons/im";
import { FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiShield } from "react-icons/fi";
import { BsInstagram } from "react-icons/bs";
import { FaCreditCard } from "react-icons/fa6";
import { useSelector } from 'react-redux';

const VendorPreviewProfile = ({ show, onClose }) => {

    // const [coverImage, setCoverImage] = useState("");
    const serverURL = "http://localhost:5000"

    const vendor = useSelector((state) => state.vendor.vendor);
    const isAuthenticated = useSelector((state) => state.vendor.isAuthenticated);

    // console.log(" Data from store editttt:", vendor);
    // console.log(" Data from servvvv:", vendor.serviceAreas);
    if (!show) return null;
    if (!isAuthenticated) {
        return <h5 className='text-gray-600 font-bold'>You are not logged in.</h5>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4 font-serif">
            <div className="bg-white w-full max-w-4xl rounded-lg p-6 overflow-y-auto max-h-[90vh] shadow-lg space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-semibold">Vendor Profile Preview</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl"><ImCross /></button>
                </div>


                <div className=" rounded-lg shadow-sm border p-6 flex flex-col space-y-4">
                    {/* Top Section - Flex in row on md */}
                    <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                        {/* Profile Image */}



                        <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {vendor?.profilePicture ? (
                                <img
                                    src={`${serverURL}${vendor.profilePicture}`}
                                    alt="Vendor"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
                            )}
                        </div>


                        {/* Details */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-2xl font-semibold text-gray-900">  {vendor.businessName || " DSY Hospitality Private limited"}</h2>

                                <div className="flex flex-wrap justify-start gap-2 mt-2 sm:mt-0 w-full">
                                    <span className="text-sm px-3 py-1 rounded-full text-white whitespace-nowrap "
                                        style={{ backgroundColor: vendor.status === "Active" ? "#34C759" : "#0f4c81" }}
                                    >
                                        {vendor.status || "InActive"}
                                    </span>

                                    <span className="text-sm px-3 py-1 rounded-full bg-white text-green-700 flex items-center gap-1 border-2 border-green-600 whitespace-nowrap">
                                        <FiShield className="text-green-600" size={16} />
                                        Verified
                                    </span>

                                    <span className="text-sm px-3 py-1 rounded-full text-[#0f4c81] border-2 border-[#0f4c81] whitespace-nowrap">
                                        Approved
                                    </span>
                                </div>

                            </div>

                            <p className="text-md text-gray-500">{vendor.vendorType || "Hospitality"}</p>
                            <p className="text-md text-gray-600">Contact: {vendor.phone || "Navneet Yadav"}</p>

                            <div className="flex items-center text-md text-gray-500">
                                <HiOutlineCalendar className="mr-1" />
                                8 years in business
                            </div>
                        </div>


                    </div>

                    {/* Description at the bottom from full start */}
                    <p className="text-md text-gray-700 text-left font-serif">
                        {vendor.description || "DSY Hospitality Private limited is a leading provider of"}
                        Premium hospitality services for weddings and corporate events. We specialize in creating
                        memorable experiences with our professional team and state-of-the-art facilities.
                    </p>
                </div>


                {/* Contact & Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded">
                        <h4 className="font-bold text-md mb-2">Contact Information</h4>
                        <ul className="text-sm space-y-1 text-gray-700" style={{ paddingLeft: "20px" }}>
                            <li><span className="inline-block align-middle">< MdEmail /></span> <span className="inline-block align-middle">{vendor.email || "dsyhosp@gmail.com"}</span></li>
                            <li><span className="inline-block align-middle">< FaPhoneAlt /></span> <span className="inline-block align-middle">{vendor.phone || "dsyhosp@gmail.com"}</span></li>
                            <li>
                                <span className="inline-block align-middle">< IoLocationOutline /></span> 
                                <span className="inline-block align-middle">
                                    {vendor.address ? (
                                        typeof vendor.address === 'object' ? 
                                            `${vendor.address.street || ''}, ${vendor.address.city || ''}, ${vendor.address.state || ''} ${vendor.address.zipCode || ''}`
                                            : vendor.address
                                    ) : "Delhi, India"}
                                </span>
                            </li>
                            <Link to="https://mybestvenue.com" ><li><span className="inline-block align-middle">< FiGlobe /></span> <span className="inline-block align-middle text-[#0f4c81]"> MyBest Venue</span></li></Link>

                        </ul>
                    </div>
                    <div className="border p-4 rounded">
                        <h4 className=" text-md mb-2 font-bold text-black-500 ">Service Areas</h4>
                        <div className="flex flex-wrap gap-2 text-sm">
                            {/* {(vendor?.serviceAreas?.length > 0 ? vendor.serviceAreas : ["Noida", "Greater Noida", "Delhi", "Gurgaon"]).map(
                                (area, index) => (
                                    <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                                        {area}
                                    </span>
                                )
                            )} */}
                            {(
                                vendor?.serviceAreas?.length > 0
                                    ? vendor.serviceAreas.flatMap(area =>
                                        area.includes(',')
                                            ? area.split(',').map(city => city.trim())
                                            : [area.trim()]
                                    )
                                    : ["Noida", "Greater Noida", "Delhi", "Gurgaon"]
                            ).map((area, index) => (
                                <span key={index} className="bg-gray-100 px-2 py-1 rounded">
                                    {area}
                                </span>
                            ))}


                        </div>
                    </div>
                </div>

                {/* Pricing Range */}
                <div className="border p-4 rounded">
                    <h4 className="font-bold text-sm mb-1 text-black-400">Pricing Range</h4>
                    <p className="text-sm text-gray-700">₹ 25000 - 45000</p>
                    <p className="text-xs text-gray-500 mt-1"><span className='text-gray-600 font-bold'> Deposit Info:</span> 30% advance payment required to confirm booking</p>
                </div>

                {/* Package Pricing */}
                <div className="border p-4 rounded space-y-4">
                    <h4 className="font-bold text-md">Package Pricing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border p-3 rounded text-sm">
                            <h5 className="font-semibold">Basic Package</h5>
                            <p>Basic decoration and food setup</p>
                            <p className="font-bold mt-2">₹25000</p>
                        </div>
                        <div className="border p-3 rounded text-sm">
                            <h5 className="font-semibold">Premium Package</h5>
                            <p>Decorator + Catering + Venue</p>
                            <p className="font-bold mt-2">₹75000</p>
                        </div>
                        <div className="border p-3 rounded text-sm">
                            <h5 className="font-semibold">Luxury Package</h5>
                            <p>All-inclusive high-end service</p>
                            <p className="font-bold mt-2">₹120000</p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="border p-4 rounded">
                    <h4 className="font-bold text-md mb-2 text-gray-900">Payment Methods</h4>

                    <div className="flex gap-2 flex-wrap text-sm">
                        <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                            <FaCreditCard /> Card
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                            <FaCreditCard /> Debit Card
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                            <FaCreditCard /> Bank Transfer
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                            <FaCreditCard /> UPI
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                            <FaCreditCard /> Cash
                        </span>
                    </div>

                </div>


                {/* Licenses & Certifications */}

                <div className="border p-4 rounded">
                    <h4 className="font-bold text-md mb-2 text-gray-800">Licenses & Certifications</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {[
                            "Food Safety License",
                            "Event Management Certification",
                            "Safety Compliance",
                            "Health & Sanitation Certificate",
                        ].map((item, index) => (
                            <div key={index} className="flex items-center text-base sm:text-lg">
                                <FiShield className="text-green-600 mr-2 text-base sm:text-lg" />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Social Media */}
                <div className="border p-4 rounded">
                    <h4 className="font-bold text-md mb-2 text-gray-800">Social Media</h4>
                    <div className="flex space-x-4 text-xl text-gray-600">
                        <FiFacebook size={30} className="hover:text-blue-600 text-blue-400" />
                        <BsInstagram size={30} className="hover:text-pink-500 text-pink-500" />
                        <FiTwitter size={30} className="hover:text-blue-700 text-blue-500" />
                        <FaLinkedinIn size={30} className="hover:text-blue-700 text-blue-500" />
                    </div>
                </div>

                {/* Gallery */}
                <div className="border p-4 rounded">
                    <h4 className="font-medium text-sm mb-2 text-gray-800">Gallery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full h-45 bg-gray-200 rounded" />
                        ))} */}
                        {(() => {
                            const galleryImages = vendor?.galleryImages || [];
                            const hasGallery = galleryImages.length > 0;

                            const imagesToShow = hasGallery
                                ? galleryImages.slice(0, 4)
                                : Array(4).fill(vendor?.profilePicture || '/default-profile.jpg');

                            return imagesToShow.map((img, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000${img}`}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-45 object-cover rounded"
                                />
                            ));
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorPreviewProfile;
