import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaCheckCircle } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineCalendar } from 'react-icons/hi';
import { ImCross } from "react-icons/im";
import { FiGlobe } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiShield } from "react-icons/fi";
import { BsInstagram } from "react-icons/bs";
import { FaCreditCard } from "react-icons/fa6";
const VendorProfileModal = ({ show, onClose }) => {
    if (!show) return null;

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
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0" />

                        {/* Details */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-2xl font-semibold text-gray-900">DSY Hospitality Private limited</h2>
                                {/* <div className="flex space-x-2 mt-2 sm:mt-0 ">
                                    <span className="text-sm px-3 py-1 rounded-full bg-[#0f4c81] text-white">Active</span>
                                    <span className="text-sm px-3 py-1 rounded-full bg-white text-green-700 flex items-center gap-1 border-2 border-green">
                                        <FiShield className="text-green-600" size={16} />
                                        Verified
                                    </span>
                                    <span className="text-sm px-3 py-1 rounded-full  text-[#0f4c81] border-2 border-[#0f4c81]">Approved</span>
                                </div> */}
                                <div className="flex flex-wrap justify-start gap-2 mt-2 sm:mt-0 w-full">
                                    <span className="text-sm px-3 py-1 rounded-full bg-[#0f4c81] text-white whitespace-nowrap">
                                        Active
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

                            <p className="text-md text-gray-500">Hospitality</p>
                            <p className="text-md text-gray-600">Contact: Navneet Yadav</p>

                            <div className="flex items-center text-md text-gray-500">
                                <HiOutlineCalendar className="mr-1" />
                                8 years in business
                            </div>
                        </div>


                    </div>

                    {/* Description at the bottom from full start */}
                    <p className="text-md text-gray-700 text-left font-serif">
                        Premium hospitality services for weddings and corporate events. We specialize in creating
                        memorable experiences with our professional team and state-of-the-art facilities.
                    </p>
                </div>


                {/* Contact & Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded">
                        <h4 className="font-bold text-md mb-2">Contact Information</h4>
                        <ul className="text-sm space-y-1 text-gray-700" style={{ paddingLeft: "20px" }}>
                            <li><span className="inline-block align-middle">< MdEmail /></span> <span className="inline-block align-middle">dsyhosp@gmail.com</span></li>
                            <li><span className="inline-block align-middle">< FaPhoneAlt /></span> <span className="inline-block align-middle">dsyhosp@gmail.com</span></li>
                            <li><span className="inline-block align-middle">< IoLocationOutline /></span> <span className="inline-block align-middle">dsyhosp@gmail.com</span></li>
                            <Link to="https://mybestvenue.com" ><li><span className="inline-block align-middle">< FiGlobe /></span> <span className="inline-block align-middle text-[#0f4c81]"> MyBest Venue</span></li></Link>

                        </ul>
                    </div>
                    <div className="border p-4 rounded">
                        <h4 className=" text-md mb-2 font-bold text-black-500 ">Service Areas</h4>
                        <div className="flex flex-wrap gap-2 text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded">Noida</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Greater Noida</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Delhi</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">Gurgaon</span>
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



                <div className="border p-4 rounded">
                    <h4 className="font-bold text-md mb-2 text-gray-800">Licenses & Certifications</h4>

                    <div className="flex flex-wrap text-sm">
                        <div className="flex items-center w-1/2 mb-2 text-lg">
                            <FiShield size={20} color='green' className="mr-1" />
                            <span>Food Safety License</span>
                        </div>
                        <div className="flex items-center w-1/2 mb-2 text-lg">
                            <FiShield size={20} color='green' className="mr-1 " />
                            <span>Event Management Certification</span>
                        </div>
                        <div className="flex items-center w-1/2 mb-2 text-lg">
                            <FiShield size={20} color='green' className="mr-1 " />
                            <span>Safety Compliance</span>
                        </div>
                        <div className="flex items-center w-1/2 mb-2 text-lg">
                            <FiShield size={20} color='green' className="mr-1 " />
                            <span>Health & Sanitation Certificate</span>
                        </div>
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
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full h-45 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorProfileModal;
