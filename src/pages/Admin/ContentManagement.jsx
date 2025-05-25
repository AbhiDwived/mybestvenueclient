import React from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import CategoryManagement from "./CategoryManagement";

const blogs = [
    {
        title: "10 Wedding Trends for 2024",
        status: "Published",
        author: "Priya Singh",
        date: "11/28/2023",
        views: 1245,
    },
    {
        title: "How to Plan a Destination Wedding in Goa",
        status: "Published",
        author: "Rahul Sharma",
        date: "11/20/2023",
        views: 876,
    },
    {
        title: "Budget-Friendly Wedding Decoration Ideas",
        status: "Draft",
        author: "Neha Gupta",
        date: "11/15/2023",
        views: 0,
    },
];

const ContentManagement = () => {
    return (
        <div className="p-2 md:p-4 max-w-full ">
            <div className="bg-white p-4 md:p-6 rounded shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h2 className="text-md md:text-2xl font-semibold mb-1">Blog Management</h2>
                        <p className="text-sm text-gray-600">Manage blog posts and content</p>
                    </div>
                    <button className="bg-[#0f4c81] hover:bg-[#0f4c81] text-white px-4 py-1 rounded mt-4 md:mt-0">
                        Add New Post
                    </button>
                </div>

                <div className="space-y-4">
                    {blogs.map((blog, index) => (
                        <div key={index} className="border rounded p-4 md:p-5 bg-white flex flex-col md:flex-row justify-between">
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-semibold  md:text-md text-md">{blog.title}</h3>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${blog.status === "Published"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {blog.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                    {blog.title.includes("Decoration")
                                        ? "Amazing decoration ideas that won't break the bank."
                                        : blog.title.includes("Goa")
                                            ? "A comprehensive guide to planning your dream beach wedding in Goa."
                                            : "Discover the hottest wedding trends for the upcoming wedding season."}
                                </p>
                                <p className="text-sm text-gray-500 mb-1">
                                    Author: <span className="font-medium">{blog.author}</span>
                                    <span className="ml-4">Date: {blog.date}</span>
                                </p>
                                <span className="text-sm text-gray-600 inline-flex items-center"><MdOutlineRemoveRedEye className="mr-1" />{blog.views} views</span>
                            </div>



                            {/* <div className="flex flex-col items-end  sm:space-y-4  flex-wrap sm:flex-row sm:items-end items-start gap-2  ">
                                <button className="flex items-center px-4 py-1 m-1 border rounded text-sm bg-gray-50 hover:bg-[#DEBF78] text-blue-600 hover:text-gray-800 border-blue-200">
                                    <MdOutlineRemoveRedEye className="mr-2" /> Preview
                                </button>
                                <button className="flex items-center px-4 py-1 m-1 border rounded text-sm bg-gray-50 hover:bg-[#DEBF78] text-yellow-700 hover:text-gray-800 border-yellow-300">
                                    <CiEdit className="mr-2" /> Edit
                                </button>
                                <button className="flex items-center px-4 py-1 m-1 border rounded text-sm bg-gray-50 hover:bg-[#DEBF78] text-red-600 hover:text-gray-800 border-red-300">
                                    <RiDeleteBin6Line className="mr-2" /> Delete
                                </button>
                            </div> */}

                            <div className="flex flex-col flex-wrap gap-2 items-start lg:flex-row lg:items-end">
                                <button className="flex items-center px-4 py-1 border rounded text-sm bg-gray-50 hover:bg-[#DEBF78] text-blue-600 hover:text-gray-800 border-blue-200">
                                    <MdOutlineRemoveRedEye className="mr-2" /> Preview
                                </button>
                                <button className="flex items-center px-4 py-1 border rounded text-sm bg-gray-50 hover:bg-[#DEBF78] text-yellow-700 hover:text-gray-800 border-yellow-300">
                                    <CiEdit className="mr-2" /> Edit
                                </button>
                                <button className="flex items-center px-4 py-1 border rounded text-sm bg-gray-50 hover:bg-[#DEBF78] text-red-600 hover:text-gray-800 border-red-300">
                                    <RiDeleteBin6Line className="mr-2" /> Delete
                                </button>
                            </div>




                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-between text-sm text-gray-600  ">
                    <span>Showing {blogs.length} blog posts</span>
                    <div className="flex space-x-2 md:space-x-4">
                        <button className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 m-1">Previous</button>
                        <button className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 m-1">Next</button>
                    </div>
                </div>

                <CategoryManagement />
            </div>
        </div>
    );
};

export default ContentManagement;
