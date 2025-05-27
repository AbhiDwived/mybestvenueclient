import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import reviewImage1 from "../../../assets/Images/Navneegt.jpeg";
import reviewImage2 from "../../../assets/Images/priya.png";

const reviews = [
  {
    name: "Priya Sharma",
    date: "2023-12-15",
    rating: 5,
    comment: "Amazing photographer! Captured our wedding beautifully. The candid shots were particularly wonderful.",
    avatar: reviewImage2,
  },
  {
    name: "Navneet Yadav",
    date: "2023-11-20",
    rating: 4,
    comment: "Very professional team. They were punctual and attentive throughout our wedding day.",
    avatar: reviewImage1,
  },
  {
    name: "Anjali Patel",
    date: "2023-10-05",
    rating: 5,
    comment: "The pre-wedding shoot was fantastic! The final photos exceeded our expectations.",
    avatar: reviewImage2,
  },
];

const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-500" />);
  }

  return <div className="flex items-center space-x-1">{stars}</div>;
};

const CustomerReviews = () => {
  return (
    <>
    <section className="max-w-7xl mx-auto p-2 font-serif ">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Customer Reviews */}
        <div className="lg:w-full">
          <h2 className="text-2xl font-semibold mb-2">Customer Reviews</h2>

          <div className="flex items-center mb-4">
            <StarRating rating={4.2} />
            <span className="text-gray-600 text-sm ml-2">Based on 124 reviews</span>
          </div>

          <div className="space-y-6">
            {reviews.map((review, idx) => (
              <div key={idx} className="border-b border-gray-400  pb-4">
                <div className="flex items-center mb-2">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-sm">{review.name}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <StarRating rating={review.rating} />
                      <span className="ml-2">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* <div className="mt-6 text-center md:w-1/2 mx-auto">
            <button className="block w-full md:w-auto border px-4 py-2 rounded hover:bg-[#DEBF78] text-sm">Load More Reviews</button>
          </div> */}
          <div className="mt-6 w-full px-4">
  <button className="w-full border px-4 py-2 rounded hover:bg-[#DEBF78] text-sm">
    Load More Reviews
  </button>
</div>

        </div>

       
      </div>
    </section>
    
    </>
  );
};

export default CustomerReviews;
