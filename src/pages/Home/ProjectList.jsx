import React from "react";

const ProjectList = () => {
  const stats = [
    { value: "500+", label: "Premium Venues" },
    { value: "25,000+", label: "Successful Events" },
    { value: "2,000+", label: "Trusted Vendors" },
    { value: "99%", label: "Client Satisfaction" },
  ];

  return (
    <section className="bg-[#0f4c81] py-16 px-4 sm:px-8 md:px-16 text-white text-center">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair mb-4">
          MyBestVenue by Numbers
        </h2>
        <p className="text-sm sm:text-base md:text-lg mb-10 max-w-2xl mx-auto text-gray-200">
          We've been helping clients find their perfect venues for years. Here's what we've achieved so far.
        </p>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#195b8c] rounded-xl shadow-md p-6 sm:p-8 text-center"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-white">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
