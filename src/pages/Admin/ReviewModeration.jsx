import React, { useState } from 'react';
import { FaExclamationCircle } from "react-icons/fa";
import { GiRoundStar } from "react-icons/gi";
import { FaStar } from "react-icons/fa";

import { RxCrossCircled } from "react-icons/rx";
import { FaRegCheckCircle } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";

const ReviewModeration = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Amit & Sonia',
      rating: 1,
      venue: 'Royal Palace Banquet',
      content: 'Terrible service! The venue was not cleaned properly and staff was very rude. Would never recommend to anyone.',
      reason: 'Vendor claims false information',
      reportedDate: '12/1/2023',
    },
    {
      id: 2,
      author: 'John Doe',
      rating: 3,
      venue: 'Grand Hotel',
      content: 'Average experience. The food was good but the service was slow.',
      reason: 'Inappropriate language',
      reportedDate: '11/28/2023',
    },
    {
      id: 3,
      author: 'John Doe',
      rating: 5,
      venue: 'Grand Hotel',
      content: 'Average experience. The food was good but the service was slow.',
      reason: 'Inappropriate language',
      reportedDate: '11/28/2023',
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(reviews.length / pageSize);
  const paginatedReviews = reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function getPaginationPages(current, total) {
    if (total <= 1) return [1];
    if (current === 1) return [1, '...', total];
    if (current === total) return [1, '...', total];
    if (current !== 1 && current !== total) return [1, '...', current, '...', total];
  }
  const paginationPages = getPaginationPages(currentPage, totalPages);

  const handleApprove = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
    console.log(`Approved review ${id}`);
  };

  const handleRemove = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
    console.log(`Removed review ${id}`);
  };

  return (
    <div className="max-w-full mx-auto  bg-white rounded-lg shadow-md lg:p-2 md:p-2">
      <div className="mb-2 px-3 py-3">
        <h1 className="text-2xl font-bold text-gray-800">Review Moderation</h1>
        <p className="text-gray-600">Reported reviews that need attention</p>
      </div>

      <div className="space-y-2">
        {paginatedReviews.map((review) => (
          <div key={review.id} className="border rounded-lg overflow-hidden">
            {/* Review Header */}
            <div className="bg-red-50 p-2 flex justify-between items-center">
              <div className="flex items-center">
                {/* <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white mr-2">
                  <span><FaExclamationCircle /></span>
                </div> */}
                <div>
                  <p className="font-semibold inline-flex items-center pb-0 "> <span className=" inline"><AiOutlineExclamationCircle color='red' className='mr-2' /></span> Review Reported</p>
                  <p className="text-sm text-gray-600 mb-0 ml-2">Reason: {review.reason}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Reported on {review.reportedDate}
              </div>
            </div>

            {/* Review Content */}
            <div className=" ml-3">
              <div className="flex items-center ">
                <h3 className="font-semibold mr-2">{review.author}</h3>

                <div className="flex justify-end text-yellow-400 ml-auto mr-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>

              </div>
              <p className="text-sm text-gray-600 mb-2">Review for: {review.venue}</p>
              <p className="text-gray-800 bg-gray-50 p-2">
                {review.content}
              </p>
            </div>

            {/* Action Buttons */}

            <div className="p-2 flex justify-end gap-2">
              <button
                onClick={() => handleApprove(review.id)}
                className="p-2 bg-green-100 text-green-800 rounded flex items-center hover:text-gray-800"
              >
                <span className="w-5 h-5 rounded  flex items-center justify-center text-white mr- ">
                  <FaRegCheckCircle className='hover:text-gray-800' color='green' size={18} />
                </span>
                Approve Review
              </button>
              <button
                onClick={() => handleRemove(review.id)}
                className="px-4 py-2 bg-red-100 text-red-800 rounded flex items-center hover:text-gray-800"
              >
                <span className="w-5 h-5 rounded  flex items-center justify-center text-white mr-2">
                  <RxCrossCircled className='hover:text-gray-800' color='red' size={18} />
                </span>
                Remove Review
              </button>
            </div>



          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-6 bg-gray-50 px-3 py-2 rounded-lg shadow border">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            aria-label="Previous page"
          >
            Prev
          </button>
          {paginationPages.map((page, idx) =>
            page === '...'
              ? <span key={idx} className="px-2 text-gray-400">...</span>
              : <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border transition ${currentPage === page ? 'bg-blue-100 border-blue-400 text-blue-700 font-bold' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
          )}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border transition ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewModeration;
