import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaHashtag, FaSyncAlt, FaRegCopy,  } from "react-icons/fa";
import { Link } from "react-router-dom";

const popularHashtags = [
  "#JustMarried", "#WeddingDay", "#HappilyEverAfter",
  "#LoveWins", "#TieTheKnot", "#WeddingBliss",
  "#ForeverYours", "#SoulMates", "#BetterTogether", "#LoveStory",
];

export default function HashtagGenerator() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("John");
  const [partnerName, setPartnerName] = useState("Sarah");
  const [weddingDate, setWeddingDate] = useState("");

  
  return (
    <>
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-black">
        <div className="mx-auto text-left  px-4 max-w-3xl">
          <Link to={navigate("/planning-tools")}
            style={{textDecoration:'none'}}
            className="text-white flex items-center mx-auto gap-1"
          >
            <span className="text-2xl leading-none">
              <IoIosArrowRoundBack />
            </span>
            <span className="text-base leading-none">Back to Planning Tools</span>
          </Link>

          <h1 className=" md:text-5xl font-bold mb-4 font-playfair text-white">
            Hashtag Generator
          </h1>
          <p className="mb-8 text-white text-base md:text-lg">
            Create a unique hashtag for your wedding day
          </p>
          
        </div>
      </div>


      <div className="min-h-screen bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Generator Form */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1f2d5c] flex items-center gap-2">
              <FaHashtag /> Create Your Wedding Hashtag
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your names and wedding date to generate personalized hashtags
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="First Name"
                className="border p-2 rounded w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Partner's Name"
                className="border p-2 rounded w-full"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
              />
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                className="border p-2 rounded w-full"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
              />
            </div>

            <button className="bg-[#0b3d91] hover:bg-[#092f6b] text-white py-2 px-6 rounded flex w-full text-center justify-center items-center gap-2">
              <FaSyncAlt /> Generate Hashtags
            </button>
          </div>

          {/* Popular Hashtags */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1f2d5c] mb-1">Popular Wedding Hashtags</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get inspired by these popular wedding hashtags
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {popularHashtags.map((tag, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 text-sm px-3 py-2 rounded cursor-pointer"
                  onClick={() => copyToClipboard(tag)}
                >
                  <span>{tag}</span>
                  <FaRegCopy className="text-gray-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#1f2d5c] mb-2">Hashtag Tips</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
              <li>Keep it short and memorable</li>
              <li>Avoid special characters and numbers when possible</li>
              <li>Make sure it's unique - search social media first</li>
              <li>Include it on your save-the-dates and invitations</li>
              <li>Create a beautiful sign for your venue</li>
              <li>Share it with your photographer and guests</li>
            </ul>
          </div>
        </div>
      </div>
    </>

  )
}

