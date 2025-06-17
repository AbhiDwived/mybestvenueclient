import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
const checklistData = {
  "12+ Months Before": [
    "Set your wedding date",
    "Determine your budget",
    "Create guest list draft",
    "Book venue",
    "Hire wedding planner (if desired)",
    "Start dress shopping",
  ],
  "8-10 Months Before": [
    "Book photographer",
    "Book caterer",
    "Send save the dates",
    "Book florist",
    "Book entertainment/DJ",
    "Order wedding dress"
  ],
  "6-8 Months Before": [
    "Finalize guest list",
    "Order invitations",
    "Book transportation",
    "Plan honeymoon",
    "Register for gifts",
    "Book makeup artist",
  ],
  "3-4 Months Before": [
    "Send invitations",
    "Order wedding cake",
    "Finalize menu",
    "Schedule dress fittings",
    "Book rehearsal dinner venue",
    "Get marriage license",
  ],
  "1 Month Before": [
    "Confirm all vendors",
    "Final headcount to caterer",
    "Final dress fitting",
    "Prepare seating chart",
    "Write vows",
    "Pack for honeymoon"
  ],
  "1 Week Before": [
    " Rehearsal dinner",
    "Delegate day-of responsibilities",
    "Confirm timeline with vendors",
    "Prepare emergency kit",
    "Relax and enjoy!",
  ]


  // Add more groups as needed
};


const WeddingChecklist = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  window.scrollTo({ top: 0, category: "top" })
  const totalTasks = Object.values(checklistData).flat().length;
  const progress = Math.round((completedTasks.length / totalTasks) * 100);

  const toggleTask = (task) => {
    setCompletedTasks((prev) =>
      prev.includes(task)
        ? prev.filter((t) => t !== task)
        : [...prev, task]
    );
  };


  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-black">
        <div className="mx-auto  text-left px-4 max-w-3xl ">
          <Link to={navigate("/planning-tools")}
            style={{ textDecoration: 'none' }}
            className="text-white flex items-center mx-auto gap-1 "
          >
            <span className="text-2xl leading-none">
              <IoIosArrowRoundBack />
            </span>
            <span className="text-base leading-none">Back to Planning Tools</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold  font-playfair text-white">
            Wedding Checklist
          </h1>
          <p className="mb-8 text-white text-base md:text-lg">
            Stay organized with our comprehensive wedding planning checklist
          </p>
        </div>
      </div>

      <div className=" mx-auto p-3 bg-gray-100">
        {/* Progress Header */}
        <div className=" bg-amber-50 ">
          <div className="bg-gray-50 p-6 rounded shadow-md mb-6">
            <h2 className="text-xl font-semibold text-center text-green-700">
              ✓ Your Progress
            </h2>
            <p className="text-center text-gray-500 mb-2">
              {completedTasks.length} of {totalTasks} tasks completed
            </p>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#0f4c81] h-3 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-center mt-2 text-gray-600">
              {progress}% Complete
            </p>
          </div>
        </div>
      </div>



      <div>
        {/* Checklist */}
        <div className="mx-auto max-w-4xl px-4 mt-20 sm:px-6 pb-16">
          {Object.entries(checklistData).map(([title, tasks]) => (
            <div
              key={title}
              className="bg-white p-6 rounded shadow-sm mb-6 border border-gray-100"
            >
              <p className="mb-4 font-bold text-lg text-[#0f4c81]">{title}</p>
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={completedTasks.includes(task)}
                      onChange={() => toggleTask(task)}
                      className="mt-1 accent-[#0f4c81]"
                    />
                    <label
                      className={`text-gray-800 text-sm sm:text-base cursor-pointer transition-all duration-200 ${completedTasks.includes(task) ? "line-through text-gray-500" : ""
                        }`}
                    >
                      {task}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>

  );
};

export default WeddingChecklist;
