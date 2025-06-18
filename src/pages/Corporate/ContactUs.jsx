import React from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';



export default function ContactUs() {
    window.scrollTo({ top: 0, category: "top" })
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Have questions or need help? We'd love to hear from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="text-blue-600 mt-1 mr-4" size={20} />
                                <span className="text-gray-700">
                                    A-230, Sector-151, Near-148 metro station, Greater Noida, India, <br /> Uttar Pradesh code - 201310
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FaPhone className="text-blue-600 mr-4" size={20} />
                                <Link to="tel:08130622279" style={{textDecoration:'none', color: 'black'}} className="text-gray-700">081306 22279</Link>
                            </div>
                            <div className="flex items-center">
                                <FaEnvelope className="text-blue-600 mr-4" size={20} />
                                <Link to="mailto:mybestvenue@gmail.com" style={{textDecoration:'none', color: 'black'}} className="text-gray-700">mybestvenue@gmail.com</Link>
                            </div>
                        </div>

                        <div className="mt-10">
                            <iframe
                                title="Office Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.836795141024!2d77.40059297442846!3d28.526295175726024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce5c2e1b7d28f%3A0x3d6e9afde7f65f18!2sA-223%2C%20Sector-151%2C%20Near%20148%20metro%20station%2C%20Greater%20Noida%2C%20Uttar%20Pradesh%20201310!5e0!3m2!1sen!2sin!4v1719785156611!5m2!1sen!2sin"
                                width="100%"
                                height="300"
                                className="border-0 rounded-lg shadow-md"
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <form className="bg-white shadow-md rounded-lg p-6 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Write your message..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                style={{ borderRadius: '5px' }}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0F4C81] hover:bg-[#0f4c81ee] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
