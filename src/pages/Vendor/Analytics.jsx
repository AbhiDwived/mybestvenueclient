import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiMessageSquare, FiCalendar } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";








const iconMap = {
  views: <FiTrendingUp size={30} className="text-bold text-[#00478F]" />,
  inquiries: <FiMessageSquare size={30} className="text-xl text-[#00478F]" />,
  bookings: <FiCalendar size={30} className="text-xl text-[#00478F]" />,
  rating: <FaRegStar size={30} className="text-xl text-[#00478F]" />,
};

const barWidthMap = {
  views: "w-[60%]",
  inquiries: "w-[50%]",
  bookings: "w-[40%]",
  rating: "w-[95%]",
};
const Analytics = () => {



  const [stats, setStats] = useState([]);

  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      const data = [
        {
          title: "Total Views",
          value: "12,450",
          change: "+12% from last month",
          type: "views",
        },
        {
          title: "Inquiries",
          value: "156",
          change: "+8% from last month",
          type: "inquiries",
        },
        {
          title: "Bookings",
          value: "23",
          change: "+15% from last month",
          type: "bookings",
        },
        {
          title: "Avg Rating",
          value: "4.8",
          change: "+0.2 from last month",
          type: "rating",
        },
      ];

      setStats(data);
    };

    fetchData();
  }, []);
  return (




    <div className="p-2 ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Analytics & Insights
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {stats.map((stat, index) => (
          <div
            key={index}
            className=" border border-gray-200 rounded-md p-2 shadow-sm  "
          >
            <div className="flex items-start justify-between mb-1 ">
              <div className="text-xl font-medium text-gray-600">
                {stat.title}
              </div>
              <div>{iconMap[stat.type]}</div>
            </div>
            <div className="text-[22px] font-semibold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-green-600 mb-2">{stat.change}</div>
            <div className="w-full h-4 bg-gray-300 rounded-full">
              <div
                className={`h-full bg-[#00478F] rounded-full ${barWidthMap[stat.type] || "w-[50%]"
                  }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>



  );
};

export default Analytics;
