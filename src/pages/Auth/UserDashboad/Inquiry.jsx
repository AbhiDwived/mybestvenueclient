import React, { useEffect, useState } from 'react';
import { Mail } from "lucide-react";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserInquiriesMutation, useSendUserReplyMutation } from "../../../features/auth/authAPI";
import moment from 'moment';

export default function Inquiry() {
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;

    const [getInquiries, { data, isLoading, isError }] = useGetUserInquiriesMutation();
    const [sendUserReply] = useSendUserReplyMutation();
    const inquiries = data?.modifiedList || [];
    // console.log("inquiries", inquiries)

    const [activeReplyId, setActiveReplyId] = useState(null);
    const [messages, setMessages] = useState({});

    useEffect(() => {
        if (userId) {
            getInquiries(userId);
        }
    }, [userId, getInquiries]);

    const handleSend = async (inquiry) => {
        const message = messages[inquiry._id];
        const payload = {
            message,
            userId,
            vendorId: inquiry.vendorId,
        }
        console.log("payload", payload)
        // if (!message?.trim()) return;

        try {
            const res = await sendUserReply(payload).unwrap();

            setMessages((prev) => ({ ...prev, [inquiry._id]: '' }));
            setActiveReplyId(null);
            alert("Reply sent successfully");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <main className="flex min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full">
                <h2 className="text-xl font-bold mb-6">My Inquiries</h2>

                {inquiries.length > 0 ? (
                    <div className="space-y-6">
                        {inquiries.map((inquiry) => {
                            // console.log(inquiry, 'inq22')
                            const inquiryId = inquiry._id;
                            return (
                                <div key={inquiryId} className=" rounded-lg overflow-hidden">
                                    <div className="bg-gray-50 p-4 flex justify-between ">
                                        <div>
                                            <h3 className="font-semibold">{inquiry.business || 'Dream Wedding photographer'}</h3>
                                            <p className="text-sm text-gray-500">Sent on {inquiry.weddingDate}</p>
                                        </div>
                                        <div>
                                            <span className={`px-2 py-1 text-xs rounded-full  ${inquiry.status === "replied" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                                {inquiry.replyStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="m-2 space-y-2 ">
                                        {/* <p className="text-sm text-gray-500">User Message: {inquiry.message}</p> */}
                                        <div className="flex justify-start w-100  ">
                                            <div className="p-2 border-1 rounded border-gray-600 bg-gray-200 w-100">
                                                {inquiry && inquiry?.userMessage?.map((msg, i) => {
                                                    return <div key={i}>
                                                        <div className='m-2 rounded p-2 bg-white'>
                                                            <p className='text-gray-400 font-bold'> Your Message:</p>
                                                            <div className=' my-2 flex justify-between items-end'>

                                                                <p className="text-gray-800">{msg?.message || "No message found."}</p>
                                                                <span className="text-[12px] text-gray-500 text-end"> {moment(msg?.date).format("DD/MM/YYYY hh:mm")}</span>

                                                            </div>
                                                            {msg?.vendorReply?.message && <div className='bg-gray-100 rounded p-2 w-[95%] mx-auto'>
                                                                <p className='text-gray-400 font-bold'>
                                                                    <strong>Reply from {inquiry?.business ?? 'Dream Wedding photographer'}:</strong>
                                                                </p>
                                                                <div className='flex justify-between items-end '>
                                                                    <p className="text-gray-800 ">{msg?.vendorReply?.message}</p>
                                                                    <span className="text-[12px] text-gray-500 text-end"> {moment(msg?.vendorReply?.createdAt).format("DD/MM/YYYY hh:mm")}</span>
                                                                </div>
                                                            </div>
                                                            }
                                                        </div>
                                                        <div>
                                                        </div>
                                                    </div>
                                                })}

                                            </div>
                                        </div>


                                    </div>

                                    <div className="p-4 space-y-4 ">

                                        {inquiry.status === "replied" && (
                                            <div className="bg-gray-50 p-3 rounded">
                                                <p><strong>Reply from {inquiry.business || 'Dream Wedding photographer'}:</strong> {inquiry.vendorMessage?.message || "no message"}</p>
                                                {/* <p className="text-xs text-gray-500">Replied on {new Date(inquiry.replyDate).toLocaleDateString()}</p>  */}
                                                {inquiry.vendorMessage?.length > 0 ? (
                                                    <div>
                                                        {inquiry.vendorMessage.map((message, index) => (
                                                            <p key={index} className='text-sm  p-2'>
                                                                {inquiry.business || 'Dream Wedding photographer'}<br />
                                                                {message.message}
                                                            </p>
                                                        ))}
                                                    </div>
                                                ) : "no message"}
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    setActiveReplyId(activeReplyId === inquiryId ? null : inquiryId)
                                                }
                                                className="border px-3 py-1 rounded text-sm"
                                            >
                                                Reply
                                            </button>

                                            <Link
                                                to={`/vendors/${inquiry.vendorId}`}
                                                className="bg-wedding-blush text-sm px-3 py-1 rounded"
                                            >
                                                View Vendor
                                            </Link>
                                        </div>

                                        {activeReplyId === inquiryId && (
                                            <div className="border p-3 rounded bg-gray-50">
                                                <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
                                                    {inquiry.chatHistory?.map((chat, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                                                        >
                                                            <div
                                                                className={`max-w-xs p-2 rounded-lg text-sm ${chat.sender === "user"
                                                                    ? "bg-blue-100 text-right"
                                                                    : "bg-gray-200 text-left"
                                                                    }`}
                                                            >
                                                                <p>{chat.message}</p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {new Date(chat.timestamp).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <textarea
                                                    className="w-full p-2 border rounded"
                                                    rows="3"
                                                    placeholder="Write your reply..."
                                                    value={messages[inquiryId] || ''}
                                                    onChange={(e) =>
                                                        setMessages((prev) => ({ ...prev, [inquiryId]: e.target.value }))
                                                    }
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button onClick={() => setActiveReplyId(null)} className="border px-3 py-1 rounded">
                                                        Cancel
                                                    </button>
                                                    <button onClick={() => handleSend(inquiry)} className="bg-blue-600 text-white px-3 py-1 rounded">
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        )}
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
