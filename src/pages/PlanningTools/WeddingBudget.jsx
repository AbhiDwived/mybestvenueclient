import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

const initialExpenses = [
  { category: "Venue", budgeted: 20000, spent: 18000 },
  { category: "Catering", budgeted: 15000, spent: 14500 },
];

const BudgetTracker = () => {
  const navigate = useNavigate();
  window.scrollTo({ top: 0, category: "top" })
  
  const [totalBudget, setTotalBudget] = useState(() => {
    const saved = localStorage.getItem("totalBudget");
    return saved ? JSON.parse(saved) : 50000;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newSpent, setNewSpent] = useState("");

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.spent, 0);
  const remaining = totalBudget - totalSpent;
  const budgetUsed = Math.round((totalSpent / totalBudget) * 100);

  useEffect(() => {
    localStorage.setItem("totalBudget", JSON.stringify(totalBudget));
  }, [totalBudget]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = () => {
    if (!newCategory || !newBudget || !newSpent) return;
    setExpenses((prev) => [
      ...prev,
      {
        category: newCategory,
        budgeted: Number(newBudget),
        spent: Number(newSpent),
      },
    ]);
    setNewCategory("");
    setNewBudget("");
    setNewSpent("");
  };

  const handleReset = () => {
    localStorage.removeItem("expenses");
    localStorage.removeItem("totalBudget");
    setExpenses(initialExpenses);
    setTotalBudget(50000);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-black">
        <div className="mx-auto text-left px-4 max-w-3xl">
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
            Budget Tracker
          </h1>
          <p className="mb-8 text-white text-base md:text-lg">
            Set your budget and track expenses for your wedding
          </p>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="px-4 sm:px-6  py-3 bg-gray-100">
        <div className="bg-white shadow-md rounded px-4 py-3 mb-8 lg:mx-40">
          <h3 className="font-semibold mb-4 flex items-center justify-center gap-2 text-center">
            📆 Budget Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-4">
            <div className="text-lg font-bold">
              ${totalBudget.toLocaleString()} <br />
              <span className="text-sm font-normal">Total Budget</span>
            </div>
            <div className="text-lg font-bold text-red-600">
              ${totalSpent.toLocaleString()} <br />
              <span className="text-sm font-normal text-black">Total Spent</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              ${remaining.toLocaleString()} <br />
              <span className="text-sm font-normal text-black">Remaining</span>
            </div>
          </div>
          <span>Budget Used</span>
          <div className=" text-sm text-right text-gray-600">
            {budgetUsed}%
          </div>
          <div className="w-full bg-gray-200 mb-4 h-4 rounded-full overflow-hidden">
            <div
              className="bg-[#09365d] h-4"
              style={{ width: `${budgetUsed}%` }}
            ></div>
          </div>
          <span>Total Budget</span>
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            className="mt- border rounded p-2 w-full"
          />

        </div>
      </div>

      {/* Main Section */}
      <div className="bg-gray-50 p-6 text-[#09365d]">
        <div className="max-w-5xl mx-auto">
          {/* Add New Expense */}
          <div className="bg-white shadow-md border rounded p-6 mb-8">
            <h3 className="text-lg font-semibold mb-2 text-center">
              + Add New Expense Category
            </h3>
            <p className="text-sm mb-4 text-center">
              Track your wedding expenses by category
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="e.g. Decoration"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                placeholder="5000"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                placeholder="4500"
                value={newSpent}
                onChange={(e) => setNewSpent(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleAddExpense}
                className="bg-[#09365d] text-white rounded p-2 hover:bg-[#062b4b] w-full"
              >
                Add Expense
              </button>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white shadow-md border rounded p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Expense Breakdown
            </h3>
            {expenses.map((item, index) => {
              const percentUsed = Math.round(
                (item.spent / item.budgeted) * 100
              );
              return (
                <div
                  key={index}
                  className="mb-4 shadow-md py-3 px-3 border rounded-md"
                >
                  <p className="font-semibold">{item.category}</p>
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#09365d] h-3"
                      style={{ width: `${percentUsed}%` }}
                    ></div>
                  </div>
                  <div className="text-sm flex justify-between mt-1 flex-wrap gap-2">
                    <span>{percentUsed}% used</span>
                    <span className="text-gray-600">
                      ${item.spent.toLocaleString()} / $
                      {item.budgeted.toLocaleString()} <br />
                      <span className="text-green-600">Within budget</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </>
  );
};

export default BudgetTracker;
