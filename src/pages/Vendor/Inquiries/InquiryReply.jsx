
import React, { useState } from 'react';
import moment from "moment";
import { useUserInquiryReplyMutation } from "../../../features/vendors/vendorAPI";
import { useSelector } from 'react-redux';

const InquiryReply = (props) => {

  const { inquiry, onBack } = props
  const [userInquiryReply] = useUserInquiryReplyMutation();
  const vendor = useSelector((state) => state.vendor.vendor);
  const [replyText, setReplyText] = useState("");
  const [isReply, setIsReply] = useState();
  const [toggle, setIsToggle] = useState(false);
  

  // Format date safely
  const lastUserMessage = inquiry?.userMessage?.length
    ? inquiry.userMessage[inquiry.userMessage.length - 1]
    : null;

  const formattedDate = lastUserMessage?.createdAt
    ? moment(lastUserMessage.createdAt).format("DD/MM/YYYY")
    : "N/A";

  const handleSendReply = async (data) => {
    console.log(data, 'data')
    if (!replyText.trim()) {
      alert("Please type a reply before sending.");
      return;
    }

    const payload = {
      vendorId: inquiry?.vendorId,
      userId: inquiry?.userId,
      messageId: data?._id,
      message: replyText
    }

    console.log(payload, 'payload')

    if (!payload.userId || !payload.vendorId || ! payload.messageId) {
      alert("Missing required data. Cannot send reply.");
      // console.error("Missing fields:", { vendorId, userId, messageId });
      return;
    }

    try {
      const res = await userInquiryReply(payload).unwrap();
      // console.log(res, 'res')

      alert("Reply sent successfully!");
      setReplyText("");
    } catch (error) {
      // console.error("Error sending reply:", error);
      alert(`Failed to send reply: ${error.data?.message || "Unknown error"}`);
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
Dream Wedding Photography`;
    setReplyText(template);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow border font-serif">
      <div className="flex justify-between items-start mb-2">
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

      {inquiry && inquiry?.userMessage?.map((msg, i) => {
        return <div key={i}>
          <div>
            <div className="bg-gray-100 pt-2 px-2 w-1/2 rounded mb-1 ">
              {/* <p className="text-sm text-gray-600 font-semibold mb-1">Original Message:</p> */}
              <div>
                <p className="text-gray-800">{msg?.message || "No message found."}</p>
                <span className="text-[12px] text-gray-500 text-end"> {formattedDate}</span>
              </div>

            </div>
            {msg?.vendorReply?.message && <div className=' grid grid-col-5  place-items-end  rounded'>

              <div className='bg-sky-100 p-2  mb-1 flex justify-between items-end '>
                <p className="text-gray-800 ">{msg?.vendorReply?.message}</p>
                <span className="text-[12px] text-gray-500 text-end"> {moment(msg?.vendorReply?.createdAt).format("DD/MM/YYYY hh:mm")}</span>
              </div>
            </div>
            }
          </div>
          <div>
            <div className='my-2'>

              <button
                className="text-white px-4 py-2 rounded bg-[#0f4c81] text-sm"
                onClick={() => {
                  setIsToggle(!toggle)
                  if(toggle) {
                    setIsReply(i)
                  }else{
                    setIsReply(null)
                  }
                }}
              >
                Reply
              </button>
            </div>

            {isReply === i && <><div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
              <textarea
                className="w-full border rounded p-3 text-sm min-h-[50px] focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Type your response here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              ></textarea>
            </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className="text-white px-4 py-2 rounded bg-[#0f4c81] text-sm"
                  onClick={() => handleSendReply(msg)}
                >
                  Send Reply
                </button>
                <button
                  className="border px-4 py-2 rounded text-xs hover:bg-[#DEBF78] font-serif"
                  onClick={handleUseTemplate}
                >
                  Use Template
                </button>
              </div>
            </>}

          </div>
        </div>
      })}
      


    </div>
  );
};

export default InquiryReply;