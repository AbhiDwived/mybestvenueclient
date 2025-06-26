import React from 'react'

import { IoLocationOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaCheckCircle, FaUsers, FaCommentDots } from 'react-icons/fa';
import { FiCheckCircle } from "react-icons/fi";
import { BiBuildings } from "react-icons/bi";
import { FiMapPin } from 'react-icons/fi';

const AboutUs = () => {

  const venueTypes = [
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81]  text-xl sm:text-2xl" />,
      title: "Banquet Hall",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81]  text-xl sm:text-2xl" />,
      title: "Lawn & Garden",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81]  text-xl sm:text-2xl" />,
      title: "Resort",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81]  text-xl sm:text-2xl" />,
      title: "Heritage Venue",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81]  text-xl sm:text-2xl" />,
      title: "Beachside Venue",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81]  text-xl sm:text-2xl" />,
      title: "Palace Venue",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81] text-xl sm:text-2xl" />,
      title: "Luxury Hotel",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81]  text-xl sm:text-2xl" />,
      title: "Farmhouse",
    },
    {
      icon: <BiBuildings size={20} className="text-[#0f4c81]  text-xl sm:text-2xl" />,
      title: "Destination Venue",
    },
  ];




  const features = [
    {
      title: "Projects Completed",
      description: "Over 120 successful event and wedding projects delivered on time and with excellence.",
      icon: <FiCheckCircle size={40} className="text-green-600 text-xl sm:text-2xl" />,
    },
    {
      title: "Happy Clients",
      description: "98% of our clients are satisfied and have recommended us to their friends and family.",
      icon: <FaUsers size={40} className="text-green-600 text-xl sm:text-2xl" />,
    },
    {
      title: "Testimonials",
      description: "Read what our clients have to say about their experience working with us.",
      icon: <FaCommentDots size={40} className="text-green-600 text-xl sm:text-2xl" />,
    },
  ];

  const popularCities = [
    {
      title: "Delhi",
      icon: <FiMapPin className="text-white text-sm sm:text-xl" />,
    },
    {
      title: "Noida",
      icon: <FiMapPin className="text-white text-md sm:text-xl" />,
    },
    {
      title: "Gurgaon",
      icon: <FiMapPin className="text-white text-md sm:text-xl" />,
    },
    {
      title: "Greater Noida",
      icon: <FiMapPin className="text-white text-md sm:text-xl" />,
    },
    {
      title: "Ghaziabad",
      icon: <FiMapPin className="text-white text-md sm:text-xl" />,
    },
    {
      title: "Kasna",
      icon: <FiMapPin className="text-white text-md sm:text-xl" />,
    },
  ];


  return (
    <>
      <section className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] text-white py-16 text-center px-4 font-serif">
        {/* Badge */}
        <div className="inline-block bg-white/10 text-sm text-white px-4 py-1 rounded-full mb-6 ">
          <span className="inline-block align-middle"><IoLocationOutline color='white' size={20} /></span> India's Premier Venue Discovery Platform
        </div>

        {/* Heading */}
        <p className="text-4xl font-bold mb-4 " >
          Find Your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Perfect Venue
          </span>
        </p>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-lg text-white/90">
          India's trusted destination for discovering and booking the perfect event spaces.
          Making every celebration memorable with verified venues and seamless experiences.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-8 px-4 font-serif">
          <Link
            to="/Wedding_Venues_city"
            className="flex items-center bg-white text-gray-700  px-4 py-2 rounded-md hover:bg-[#0f4c81e7] transition sm:px-3 sm:py-2 text-sm sm:text-base"
            style={{ textDecoration: 'none', color: '#364153' }}
          >
            <FaSearch size={20} className="mr-2" />
            Search Venues
          </Link>

          <button
            className="flex items-center bg-white text-gray-700  px-4 py-2 rounded hover:bg-[#0f4c81e7] transition sm:px-3 sm:py-2 text-sm sm:text-base"
          >
            <FaPhoneVolume size={20} className="mr-2" />
            Get Expert Help
          </button>
        </div>


      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-5 text-center font-serif">
        <div className=" border-2 border-[#0f4c81] bg-white rounded-lg p-6">
          <p className="text-3xl  mb-2 text-gray-600">Total Projects</p>
          <p className="text-4xl  text-center text-[#6B9AC4]">1000 +</p>
        </div>
        <div className="bg-white border-2 border-[#0f4c81]  rounded-lg p-6">
          <p className="text-3xl  mb-2 text-gray-600">Total Venues</p>
          <p className="text-4xl  text-center text-[#6B9AC4]">500 +</p>
        </div>
        <div className="bg-white border-2 border-[#0f4c81]  rounded-lg p-6">
          <p className="text-3xl  mb-2 text-gray-600">Total Events</p>
          <p className="text-4xl  text-center text-[#6B9AC4]">2000 +</p>
        </div>
        <div className="bg-white border-2 border-[#0f4c81]  rounded-lg p-6">
          <p className="text-3xl  mb-2 text-gray-600">Total Reviews</p>
          <p className="text-4xl  text-center text-[#6B9AC4]">5000 +</p>
        </div>
      </div>
      {/* Why choose My best Venue */}
      <div>
        <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 px-4 sm:px-8 md:px-16 text-white text-center font-serif">
          <p className="text-3xl sm:text-3xl md:text-4xl  font-playfair mb-4">
            Why Choose My Best Venue
          </p>
          <p className="text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto text-gray-200">
            Discover the perfect venue for your event with MyBestVenue - the trusted destination for event planning in India.
          </p>
        </div>
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:mx-16 m-5 text-center">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-lg hover:shadow-lg p-6 border transition duration-300"
            >
              <div className="w-14 h-14 sm:w-14 sm:h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-lg sm:text-xl font-semibold text-blue-900 mb-4">
                {feature.icon}
              </div>

              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl  text-gray-600 mb-2 font-serif break-words">
                {feature.title}
              </p>
              <p className="text-gray-600 text-sm sm:text-base font-serif">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Venue Types */}
        <div className='m-5'>
          <p className='text-3xl sm:text-3xl md:text-4xl  mb-4 text-center font-serif text-gray-600'>Venue Types We cover</p>


          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:mx-16 m-5'>
            {venueTypes.map((venueType) => (
              <div
                key={venueType.title}
                className="bg-white rounded-lg hover:shadow-sm  text-center border 2 border-[#0f4c81] transition duration-300"
              >
                <h3 className="text-sm sm:text-base font-semibold text-gray-600  inline-flex items-center m-2">
                  {venueType.icon}
                  <span className="ml-2 text-sm sm:text-base font-serif">{venueType.title}</span>
                </h3>
              </div>
            ))}
          </div>
        </div>



      </div>
{/* Popular Cities */}
      <div className='m-5'>
        <p className='text-4xl sm:text-3xl md:text-4xl  font-serif mb-4 text-center text-gray-600'>
          Popular Cities
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:mx-16 m-2 px-2 py-2'>
          {popularCities.map((city) => (
            <div
              key={city.title}
              className="bg-[#366A9B] text-white rounded-lg hover:shadow-lg  text-center  transition duration-300  "
            >
              <h3 className="text-sm sm:text-base font-semibold text-gray-800  inline-flex items-center mt-1">
                {city.icon}
                <span className="ml-2 text-sm sm:text-base font-serif">{city.title}</span>
              </h3>
            </div>
          ))}
        </div>
      </div>

{/* Find Perfect Venue */}
      <div className='mt-5 bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 px-4 sm:px-8 md:px-16 text-white text-center font-serif'>
        <p className='text-2xl sm:text-3xl md:text-4xl  font-Serif mb-4'>Ready to Find Your  Perfect Venue</p>
        <p className='font-serif'>Join Thousand of Satisfied Customers Who found their Dream Venues</p>


        <div>
          <Link
            to="/Wedding_Venues_city"
            style={{ textDecoration: 'none', color: '#4A5565' }}
            className="inline-block bg-white px-4 py-2 rounded-md hover:bg-[#0f4c81e7] transition text-md  sm:text-base"
          >
            <span className="flex items-center gap-2">
              <FaSearch />
              Start Searching Now
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default AboutUs