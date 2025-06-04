import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaHeart, } from "react-icons/fa";
import { useState } from "react";
import { FaGlobe, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function WeddingWebsite() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    coupleNames: "John & Sarah",
    weddingDate: "",
    venue: "Grand Ballroom, City Hotel",
    loveStory: "",
    rsvpEmail: "rsvp@yourwedding.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const features = [
    {
      icon: <FaGlobe className="text-4xl text-[#09365d]" />,
      title: "Custom Domain",
      description: "Get your own custom domain for your wedding website",
    },
    {
      icon: <FaHeart className="text-4xl text-[#09365d]" />,
      title: "Beautiful Themes",
      description:
        "Choose from dozens of beautiful, mobile-responsive themes",
    },
    {
      icon: <FaCalendarAlt className="text-4xl text-[#09365d]" />,
      title: "RSVP Management",
      description:
        "Manage RSVPs and guest responses all in one place",
    },
  ];
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-black">
        <div className="mx-auto text-left px-4 max-w-3xl">
          <Link to={navigate("/planning-tools")}
            style={{ textDecoration: 'none' }}
            className="text-white flex items-center mx-auto gap-1"
          >
            <span className="text-2xl leading-none">
              <IoIosArrowRoundBack />
            </span>
            <span className="text-base leading-none">Back to Planning Tools</span>
          </Link>

          <h1 className=" md:text-5xl font-bold  font-playfair text-white">
            Wedding Website Builder
          </h1>
          <p className="mb-8 text-white text-base md:text-lg">
            Create a beautiful website for your special day
          </p>
        </div>
      </div>
      <div className="min-h-screen bg-white py-10 px-4 sm:px-10 lg:px-24 ">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6  mb-5">
          {/* Form */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-[#09365d] mb-1">
              <FaGlobe />
              Website Details
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill in your wedding details to create your website
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Couple Names</label>
                <input
                  type="text"
                  value={formData.coupleNames}
                  onChange={(e) =>
                    setFormData({ ...formData, coupleNames: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Wedding Date</label>
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) =>
                    setFormData({ ...formData, weddingDate: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Venue</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Your Love Story</label>
                <textarea
                  rows="4"
                  value={formData.loveStory}
                  onChange={(e) =>
                    setFormData({ ...formData, loveStory: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded"
                  placeholder="Tell your guests about how you met and your journey together..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium">RSVP Email</label>
                <input
                  type="email"
                  value={formData.rsvpEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, rsvpEmail: e.target.value })
                  }
                  className="mt-1 w-full p-2 border rounded"
                />
              </div>

              <button className="w-full bg-[#09365d] text-white p-2 rounded hover:bg-[#062b4b]">
                Generate Website
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-xl font-semibold text-[#09365d] mb-2">
              Website Preview
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This is how your wedding website will look
            </p>

            <div className="bg-pink-50 border p-6 rounded-lg text-center">
              <h3 className="text-2xl font-semibold text-[#09365d]">
                {formData.coupleNames || "Your Names"}
              </h3>
              <p className="text-sm text-gray-600 mb-4">are getting married!</p>

              <div className="flex flex-col items-center gap-2 text-sm mb-6 text-[#09365d]">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>
                    {formData.weddingDate || "Wedding Date"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <span>
                    {formData.venue || "Wedding Venue"}
                  </span>
                </div>
              </div>

              <div className="bg-[#09365d] text-white py-4 rounded-lg">
                <p className="font-semibold">RSVP</p>
                <p className="text-sm mb-2">Please confirm your attendance</p>
                <button className="bg-slate-600 px-4 py-1 rounded text-sm hover:bg-slate-700">
                  RSVP Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-[#09365d] mb-12">Website Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                  <p className="text-sm mt-2 text-gray-700 max-w-xs">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
