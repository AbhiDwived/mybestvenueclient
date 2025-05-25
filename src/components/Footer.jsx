import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FaLocationDot, FaPhone } from "react-icons/fa6";
import { BiSolidContact } from "react-icons/bi";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1A2A3A] w-full p-7 mt-10 text-white font-serif">
      {/* Main Content */}
      <div className="mx-4  py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Logo & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4">MyBestVenue</h3>
          <p className="text-lg mb-4 text-[#D1D5DB]">
            Your one-stop platform for discovering and booking perfect venues for weddings,
            corporate events, conferences, and special celebrations across India.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.facebook.com/share/1ARvjV57x7/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/my.bestvenue?igsh=d2ZyY2podmN3cXl4"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white"
            >
              <FaInstagram />
            </a>
            <a
              href="https://x.com/mybestvenue"
              className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className="text-lg  font-semibold border-b border-blue-500  pb-1">Quick Links</h5>
          <p className="text-md  ">
            <p className='mt-4'>
              <Link to="/vendors" style={{ textDecoration: 'none' }} className="text-white ">› Find Vendors</Link>
            </p>
            <p>
              <Link to="/wedding-venues" style={{ textDecoration: 'none' }} className="text-white ">› Wedding Venues</Link>
            </p>
            <p>
              <Link to="/corporate-events" style={{ textDecoration: 'none' }} className="text-white  ">› Corporate Events</Link>
            </p>
            <p>
              <Link to="/blog" style={{ textDecoration: 'none' }} className="text-white  ">› Event Blog</Link>
            </p>
            <p>
              <Link to="/tools" style={{ textDecoration: 'none' }} className="text-white">› Planning Tools</Link>
            </p>
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h5 className="text-lg font-semibold border-b border-blue-500 mb-4 pb-1">Contact Us</h5>
          <ul className="text-md p-0 text-gray-200">
            <li><FaLocationDot className="inline mr-2" /> CD-44 Ansal Golf Link Greater Noida, India, Uttar Pradesh code - 201310</li>
            <li className='mt-3'><FaPhone className="inline mr-2" /> 081306 22279</li>
            <li  className='mt-3'><BiSolidContact className="inline mr-2" />mybestvenue@gmail.com</li>
          </ul>
        </div>

        {/* Subscribe */}
        <div>
          <h5 className="text-lg font-semibold border-b border-blue-500 mb-4 pb-1">Subscribe</h5>
          <p className="text-lg mb-4">
            Stay updated with the latest venues, event trends, and special offers.
          </p>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            style={{borderRadius:'5px'}}
            className="w-full  bg-[#075fac] hover:bg-[#6B9AC4] px-4 py-2 transition"
          >
            Subscribe
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className=" border-gray-700 text-sm text-gray-400 py-4 px-3 flex flex-col md:flex-row justify-between items-center max-w-8xl mx-auto">
        <p>© 2025 MyBestVenue. All rights reserved.</p>
        <div className="flex space-x-5 mt-2 md:mt-0 text-md">
          <Link to="/terms" style={{ textDecoration: 'none' }} className="text-white no-underline hover:underline">Terms</Link>
          <Link to="/privacy" style={{ textDecoration: 'none' }} className="text-white no-underline hover:underline">Privacy</Link>
          <Link to="/cookies" style={{ textDecoration: 'none' }} className="text-white no-underline hover:underline">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
