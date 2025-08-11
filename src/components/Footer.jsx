import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import { FaLocationDot, FaPhone, FaPlus, FaMinus } from "react-icons/fa6";
import { BiSolidContact } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSubscribeMutation } from '../features/subscribers/subscriberAPI';

const AccordionSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:block md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-lg font-semibold border-b border-blue-500 py-2 text-white"
      >
        {title}
        {open ? <FaMinus /> : <FaPlus />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscribe] = useSubscribeMutation();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await subscribe(email);
      if ('data' in result) {
        toast.success('Successfully subscribed to newsletter!');
        setEmail('');
      } else if ('error' in result) {
        toast.error(result.error?.data?.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-[#1A2A3A] w-full mt-10 text-white font-serif">
      <div className="mx-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Logo & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4">MyBestVenue</h3>
          <p className="text-lg mb-4 text-[#D1D5DB]">
            Your one-stop platform for discovering and booking perfect venues for weddings,
            corporate events, conferences, and special celebrations across India.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="https://www.facebook.com/share/1ARvjV57x7/" target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white"><FaFacebookF /></a>
            <a href="https://www.instagram.com/my.bestvenue?igsh=d2ZyY2podmN3cXl4" target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white"><FaInstagram /></a>
            <a href="https://x.com/mybestvenue" target="_blank" rel="noopener noreferrer" className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full text-white"><FaTwitter /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="hidden sm:hidden md:block mt-1">
          <h5 className="text-lg font-semibold border-b border-blue-500">Quick Links</h5>
          <ul style={{ marginLeft: '-30px' }}>
            <li className='mt-7'><Link to="/vendor" style={{ textDecoration: 'none', color: '#D1D5DB' }}>› Find Vendors</Link></li>
            <li className='mt-2'><Link to="/corporate" style={{ textDecoration: 'none', color: '#D1D5DB' }}>› Corporate Events</Link></li>
            <li className='mt-2'><Link to="/Blog" style={{ textDecoration: 'none', color: '#D1D5DB' }}>› Event Blog</Link></li>
          </ul>
        </div>
        <AccordionSection title="Quick Links">
          <ul className="text-[#D1D5DB]">
            <li><Link to="/vendor" style={{ textDecoration: 'none', color: '#D1D5DB' }}>› Find Vendors</Link></li>
            <li className='mt-2'><Link to="/corporate" style={{ textDecoration: 'none', color: '#D1D5DB' }}>› Corporate Events</Link></li>
            <li className='mt-2'><Link to="/blog" style={{ textDecoration: 'none', color: '#D1D5DB' }}>› Event Blog</Link></li>
          </ul>
        </AccordionSection>

        {/* Contact Info */}
        <div className="hidden sm:hidden md:block">
          <h5 className="text-lg font-semibold border-b  border-blue-500 mb-4 pb-1"> <Link to='/contact-us  ' style={{ textDecoration: 'none', color: 'white' }}>Contact Us</Link></h5>
          <ul className="text-md p-0 text-[#D1D5DB]">
            <li className='sm:text-[#D1D5DB] text-sm '><Link to="https://www.google.com/maps/dir/?api=1&destination=A-223%2C+Sector+151%2C+Noida%2C+Uttar+Pradesh+201310" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#D1D5DB' }}><FaLocationDot className="inline mr-2 " style={{ textDecoration: 'none', color: '#D1D5DB' }} />A-223, Sector-151, Near-148 metro station, Greater Noida, India, Uttar Pradesh code - 201310</Link></li>
            <li className="mt-3"><Link to="tel:9990555740" style={{ textDecoration: 'none', color: '#D1D5DB' }}><FaPhone className="inline mr-2" /> +91 9990555740</Link></li>
            <li className="mt-3"><Link to="mailto:info@mybestvenue.com" style={{ textDecoration: 'none', color: '#D1D5DB' }}><BiSolidContact className="inline mr-2" />info@mybestvenue.com</Link></li>
          </ul>
        </div>
        <AccordionSection Link to='/contact-us  ' title="Contact Us">
          <ul className="sm:text-[#D1D5DB] text-sm ">
            <li><Link to='https://www.google.com/maps/dir/?api=1&destination=A-223%2C+Sector+151%2C+Noida%2C+Uttar+Pradesh+201310' target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
              className="inline-block transition text-white duration-300">
              A-223, Sector-151, Near-148 metro station, Greater Noida, India, <br /> Uttar Pradesh code - 201310
            </Link></li>
            <li className="mt-2"><Link to="tel:9990555740" style={{ textDecoration: 'none', color: '#D1D5DB' }}><FaPhone className="inline mr-2" /> +91 9990555740</Link></li>
            <li className="mt-2"><Link to="mailto:info@mybestvenue.com" style={{ textDecoration: 'none', color: '#D1D5DB' }}><BiSolidContact className="inline mr-2" />info@mybestvenue.com</Link></li>
          </ul>
        </AccordionSection>

        {/* Subscribe */}
        <div className="hidden sm:hidden md:block">
          <h5 className="text-lg font-semibold border-b border-blue-500 mb-4 pb-1">Subscribe</h5>
          <p className="text-lg mb-4 text-[#D1D5DB]">Stay updated with the latest venues, event trends, and special offers.</p>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              style={{ borderRadius: '5px' }}
              className={`w-full bg-[#075fac] hover:bg-[#6B9AC4] px-4 py-2 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
        <AccordionSection title="Subscribe">
          <p className="text-[#D1D5DB] mb-3 text-sm">Stay updated with the latest venues, event trends, and special offers.</p>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              style={{ borderRadius: '5px' }}
              className={`w-full bg-[#075fac] hover:bg-[#6B9AC4] px-4 py-2 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </AccordionSection>
      </div>

      {/* Bottom Bar */}
      <div className="border-gray-700 text-sm text-[#D1D5DB] py-4 px-3 flex flex-col md:flex-row justify-between items-center max-w-8xl mx-auto">
        <p>© 2025 MyBestVenue. All rights reserved.</p>
        <div className="flex space-x-5 mt-2 md:mt-0 text-md text-[#D1D5DB]">
          <Link to="/terms" style={{ textDecoration: 'none', color: '#D1D5DB' }} className="text-[#D1D5DB]">Terms</Link>
          <Link to="/privacy" style={{ textDecoration: 'none', color: '#D1D5DB' }} className="text-[#D1D5DB]">Privacy</Link>
          <Link to="/cookies" style={{ textDecoration: 'none', color: '#D1D5DB' }} className="text-[#D1D5DB]">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
