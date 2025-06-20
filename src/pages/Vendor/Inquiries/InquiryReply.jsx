import React, { useState } from 'react';
import moment from "moment";
import { useUserInquiryReplyMutation } from "../../../features/vendors/vendorAPI";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const InquiryReply = ({ inquiry, onBack }) => {
  const [userInquiryReply, { isLoading }] = useUserInquiryReplyMutation();
  const vendor = useSelector((state) => state.vendor.vendor);
  const [replyText, setReplyText] = useState("");
  const [activeMessageId, setActiveMessageId] = useState(null);

  // Format date safely
  const formatDate = (date) => {
    return date ? moment(date).format("DD/MM/YYYY hh:mm") : "N/A";
  };

  const handleSendReply = async (messageData) => {
    if (!replyText.trim()) {
      toast.error("Please type a reply before sending.");
      return;
    }

    const payload = {
      vendorId: inquiry?.vendorId,
      userId: inquiry?.userId,
      messageId: messageData?._id,
      message: replyText
    };

    if (!payload.userId || !payload.vendorId || !payload.messageId) {
      toast.error("Missing required data. Cannot send reply.");
      return;
    }

    try {
      await userInquiryReply(payload).unwrap();
      toast.success("Reply sent successfully!");
      setReplyText("");
      setActiveMessageId(null);
    } catch (error) {
      toast.error(error.data?.message || "Failed to send reply");
    }
  };

  const handleUseTemplate = () => {
    const template = `Thank you for your interest in our services! We would love to be a part of your special day.

For the date you mentioned, we are available and offer several packages:

- Basic: ₹10,000 (4 hours coverage)
- Standard: ₹25,000 (Full day)
- Premium: ₹50,000 (Full day + Pre-wedding)

Please let me know if you'd like to schedule a call to discuss further details or have any questions.

Best regards,
${vendor?.businessName || 'Your Business Name'}`;
    setReplyText(template);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border font-serif">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Reply to Inquiry</h2>
          <p className="text-sm text-gray-600">
            From: <span className="font-medium">{inquiry?.name || "Unknown User"}</span>
          </p>
        </div>
        <button
          className="text-sm border px-3 py-1 rounded hover:bg-[#DEBF78]"
          onClick={onBack}
        >
          Back to List
        </button>
      </div>

      <div className="space-y-4">
        {inquiry?.userMessage?.map((msg, i) => (
          <div key={i} className="border-b pb-4 last:border-b-0">
            <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
              <p className="text-gray-800">{msg?.message}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {formatDate(msg?.createdAt)}
              </span>
            </div>

            {msg?.vendorReply?.message && (
              <div className="flex justify-end mt-2">
                <div className="bg-sky-100 p-3 rounded-lg max-w-[80%]">
                  <p className="text-gray-800">{msg?.vendorReply?.message}</p>
                  <span className="text-xs text-gray-500 block mt-1">
                    {formatDate(msg?.vendorReply?.createdAt)}
                  </span>
                </div>
              </div>
            )}

            {!msg?.vendorReply?.message && (
              <div className="mt-4">
                {activeMessageId === msg._id ? (
                  <>
                    <textarea
                      className="w-full border rounded p-3 text-sm min-h-[100px] focus:outline-none focus:ring focus:border-blue-300"
                      placeholder="Type your response here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        className={`text-white px-4 py-2 rounded bg-[#0f4c81] text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleSendReply(msg)}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Send Reply'}
                      </button>
                      <button
                        className="border px-4 py-2 rounded text-sm hover:bg-[#DEBF78]"
                        onClick={handleUseTemplate}
                        disabled={isLoading}
                      >
                        Use Template
                      </button>
                      <button
                        className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
                        onClick={() => {
                          setActiveMessageId(null);
                          setReplyText("");
                        }}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    className="text-[#0f4c81] text-sm hover:underline"
                    onClick={() => setActiveMessageId(msg._id)}
                  >
                    Reply to this message
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquiryReply;