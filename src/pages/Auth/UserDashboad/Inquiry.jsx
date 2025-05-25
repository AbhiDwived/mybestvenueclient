import React from 'react';
import { Mail } from "lucide-react";
import { Link } from 'react-router-dom';

export default function Inquiry({ inquiries = [], savedVendors = [] }) {
    return (
        <main value="inquiries" className="flex min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">My Inquiries</h2>

                {inquiries.length > 0 ? (
                    <div className="space-y-6">
                        {inquiries.map((inquiry) => {
                            const vendor = savedVendors.find((v) => v.id === inquiry.vendorId);
                            return (
                                <div key={inquiry.id} className="border rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 flex flex-col md:flex-row md:justify-between md:items-center">
                                        <div>
                                            <h3 className="font-semibold text-lg">{inquiry.vendorName}</h3>
                                            <div className="text-sm text-gray-500">
                                                Sent on {new Date(inquiry.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${inquiry.status === "replied"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {inquiry.status === "replied" ? "Replied" : "Pending"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Your Message:</h4>
                                            <p className="text-gray-800">{inquiry.message}</p>
                                        </div>

                                        {inquiry.status === "replied" && (
                                            <div className="mb-4 bg-gray-50 p-4 rounded-md">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                                    Reply from {inquiry.vendorName}:
                                                </h4>
                                                <p className="text-gray-800">{inquiry.reply}</p>
                                                <div className="text-xs text-gray-500 mt-2">
                                                    Replied on {new Date(inquiry.replyDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex space-x-2">
                                            <Button asChild variant="outline" className="flex-1 text-sm">
                                                <a href={`mailto:${vendor?.contactEmail || ''}`}>Reply</a>
                                            </Button>
                                            <Button asChild className="flex-1 bg-wedding-blush hover:bg-wedding-blush/90 text-wedding-dark text-sm">
                                                <a href={`/vendors/${inquiry.vendorId}`}>View Vendor</a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Inquiries Yet</h3>
                        <p className="text-gray-600 mb-4">
                            You haven't sent any inquiries to vendors. Browse vendors and contact them to start planning your wedding.
                        </p>
                        <button>
                            <Link to="/vendors">Browse Vendors</Link>
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
