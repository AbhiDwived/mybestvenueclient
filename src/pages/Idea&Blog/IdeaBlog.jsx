import React from 'react';
import { Calendar } from "lucide-react";
import IdeaBlogHeader from '../../assets/newPics/IdeaBlogHeader.avif';
import IdeaBlog1 from '../../assets/newPics/IdeaBlog1.avif';
import IdeaBlog2 from '../../assets/newPics/IdeaBlog2.avif';
import IdeaBlog3 from '../../assets/newPics/IdeaBlog3.avif';
import IdeaBlog4 from '../../assets/newPics/IdeaBlog4.avif';
import IdeaBlog5 from '../../assets/newPics/IdeaBlog5.avif';

const categories = ["All", "Planning", "Decoration", "Photography", "Corporate", "Budget", "Food"];

const articles = [
  {
    title: "10 Stunning Wedding Decoration Ideas for 2023",
    description: "Transform your venue with these beautiful decoration ideas that are trending this year.",
    category: "Decoration",
    date: "May 15, 2023",
    author: "Sarah Johnson",
    image: IdeaBlogHeader,
    featured: true
  },
  {
    title: "How to Choose the Perfect Wedding Venue",
    description: "Find the ideal location for your special day with these helpful tips and considerations.",
    category: "Planning",
    date: "May 28, 2023",
    image: IdeaBlog1
  },
  {
    title: "Wedding Photography: Capturing Perfect Moments",
    description: "Professional photographers share their secrets for stunning wedding photos.",
    category: "Photography",
    date: "June 15, 2023",
    image: IdeaBlog2
  },
  {
    title: "Corporate Events: Making Business Meetings Memorable",
    description: "Transform ordinary business meetings into extraordinary experiences with these tips.",
    category: "Corporate",
    date: "July 10, 2023",
    image: IdeaBlog3
  },
  {
    title: "Budget-Friendly Wedding Ideas That Look Expensive",
    description: "Create a luxurious wedding experience without breaking the bank.",
    category: "Budget",
    date: "August 5, 2023",
    image: IdeaBlog4
  },
  {
    title: "Latest Wedding Catering Trends",
    description: "Explore innovative food and beverage options for your wedding reception",
    category: "Food",
    date: "September 12, 2023",
    image: IdeaBlog5
  },
];

export default function IdeaBlog() {
  return (
    <div>
      {/* Header */}
      <section className="bg-[#E8EDF3] py-10 text-black">
        <div className="mx-auto text-center px-4 sm:px-6 lg:px-12 max-w-4xl">
          <p className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-black">
            Ideas & Blog
          </p>
          <p className="mb-8 text-gray-800 text-base sm:text-lg">
            Get inspired with our collection of articles, tips, and ideas
          </p>
          <div className="bg-white rounded-lg flex flex-col sm:flex-row gap-2 shadow">
            <input
              type="text"
              placeholder="Search by name or location..."
              className="flex-1 border-none focus:outline-none text-gray-800 px-4 py-2 rounded"
            />
            <button className="bg-[#09365d] hover:bg-[#062945] text-white px-4 py-2 rounded">
              Search Venue
            </button>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 bg-white px-4 sm:px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <img
            src={articles[0].image}
            alt={articles[0].title}
            className="w-full h-[320px] sm:h-[400px] lg:h-[420px] object-cover rounded-lg"
          />
          <div>
            <span className="inline-block bg-blue-900 text-white px-3 py-1 rounded-full text-sm mb-2">
              {articles[0].category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 font-playfair">
              {articles[0].title}
            </h2>
            <p className="text-gray-600 mb-4 text-base sm:text-lg">{articles[0].description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4 gap-2 flex-wrap">
              <Calendar size={16} />
              <span>{articles[0].date}</span>
              <span>• By {articles[0].author}</span>
            </div>
            <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Read Article
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className="border px-4 py-1 rounded-full text-sm sm:text-base text-gray-800 hover:text-white hover:bg-[#062945] transition"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((post, idx) => (
            <div key={idx} className="bg-white border rounded-xl overflow-hidden flex flex-col h-full shadow-sm">
              <div className="relative">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <span className="absolute top-3 left-4 bg-blue-900 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
                  {post.category}
                </span>
              </div>

              <div className="flex flex-col justify-between flex-grow px-4 pt-4 pb-3">
                <div className="mb-4">
                  <h5 className="text-lg font-playfair font-semibold mb-1 leading-snug">
                    {post.title}
                  </h5>
                  <p className="text-sm text-gray-600 mb-5 mt-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>
                <div className="border-t pt-3 mt-auto flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <span className="text-black hover:underline cursor-pointer">
                    Read More
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Load More */}
      <section className="mt-2 mb-8 text-center px-4 sm:px-6 lg:px-12">
        <button
          className="inline-block bg-white text-black px-5 py-2 mb-10 border rounded hover:bg-[#09365d] transition-colors duration-300"
        >
          Load More Articles
        </button>
      </section>
    </div>
  );
}
