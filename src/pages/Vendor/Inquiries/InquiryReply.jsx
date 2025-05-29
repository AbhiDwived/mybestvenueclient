import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";


const InquiryReply = ({ inquiry, onBack }) => {
  //   const navigate = useNavigate();
  //     const handleBack = () => {
  //   navigate("/vendor/inquiries"); 


  // };


  const [replyText, setReplyText] = useState("");
  const handleSendReply = () => {
    alert("Reply sent successfully! ");
  }

  const handleUseTemplate = () => {
    const template = `Thank you for your interest in our services! We would love to be a part of your special day.

For the date you mentioned, we are available and offer several packages:

- Basic: ₹10,000 (4 hours coverage)
- Standard: ₹25,000 (Full day)
- Premium: ₹50,000 (Full day + Pre-wedding)

Please let me know if you'd like to schedule a call to discuss further details or have any questions.

Best regards,
Dream Wedding Photography`;
    setReplyText(template);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border font-serif ">
      <div className="flex justify-between items-start mb-2 ">
        <div>
          <h2 className="text-xl font-semibold">Reply to Inquiry</h2>
          <p className="text-sm text-gray-600">From: <span className="font-medium">Arjun & Meera Kumar</span></p>
        </div>
        {/* <Link to="/vendor/inquiries"> */}
        <button
          className="text-sm border px-3 py-1 rounded hover:bg-[#DEBF78]"
          onClick={onBack}
        >
          Back to List
        </button>
        {/* </Link> */}
      </div>

      <div className="bg-gray-100 p-2 rounded mb-4">
        <p className="text-sm text-gray-600 font-semibold mb-1">Original Message:</p>
        <p className="text-gray-800 ">
          Hello, I am interested in your wedding photography services for my wedding on November 15, 2024. Could you please
          provide more details about your packages?
        </p>
        <p className="text-xs text-gray-500">Received on 12/10/2023</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
        <textarea
          className="w-full border rounded p-3 text-sm min-h-[200px] focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type your response here..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        ></textarea>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button className=" text-white px-4 py-2 rounded bg-[#0f4c81] text-sm"
        onClick={handleSendReply}
        >Send Reply</button>
        <button className="border px-4 py-2 rounded  text-xs hover:bg-[#DEBF78] font-serif "
        onClick={handleUseTemplate}
        >Use Template</button>
      </div>
    </div>
  );
};

export default InquiryReply;
