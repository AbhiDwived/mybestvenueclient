import React, { useState, useEffect } from 'react';
import {
  useGetUserBudgetQuery,
  useAddBudgetItemMutation,
  useUpdateBudgetItemMutation,
  useDeleteBudgetItemMutation,
} from '../../../features/budget/budgetAPI';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import Loader from '../../../components/{Shared}/Loader';

export default function Budget() {
  const [newBudgetItem, setNewBudgetItem] = useState({ category: '', planned: 0 });
  const { isAuthenticated } = useSelector((state) => state.auth);

  /* ──────────────── RTK Query hooks ──────────────── */
  const {
    data: budgetData,
    isLoading,
    isError,
    error,
  } = useGetUserBudgetQuery(undefined, { skip: !isAuthenticated });

  const [addBudgetItem, { isLoading: isAddingItem }] = useAddBudgetItemMutation();
  const [updateBudgetItem, { isLoading: isUpdatingItem }] = useUpdateBudgetItemMutation();
  const [deleteBudgetItem, { isLoading: isDeletingItem }] = useDeleteBudgetItemMutation();

  /* ──────────────── Derived values ──────────────── */
  const budget = budgetData?.data?.items ?? [];
  const totalPlanned = budgetData?.data?.totalPlanned ?? 0;
  const totalActual = budgetData?.data?.totalActual ?? 0;
  const budgetRemaining = totalPlanned - totalActual;

  /* ──────────────── Global load / error handling ──────────────── */
  useEffect(() => {
    if (isError) {
      toast.error(`Error loading budget: ${error?.data?.message || 'Unknown error'}`);
    }
  }, [isError, error]);

  // Add local state for actual values
  const [actualInputs, setActualInputs] = useState({});

  // Sync local state with budget data
  useEffect(() => {
    const initialActuals = {};
    budget.forEach(item => {
      initialActuals[item._id] = item.actual || '';
    });
    setActualInputs(initialActuals);
  }, [budget]);

  /* ──────────────── Handlers ──────────────── */
  const updateActualBudget = async (id, actual) => {
    try {
      await updateBudgetItem({ itemId: id, itemData: { actual: Number(actual) } }).unwrap();
      toast.success('Actual amount updated');                   // ✅ green
    } catch (err) {
      toast.error(`Error updating budget: ${err.data?.message || 'Unknown error'}`); // 🔴 red
    }
  };

  const handleAddBudgetItem = async () => {
    if (!newBudgetItem.category || newBudgetItem.planned <= 0) return;

    try {
      await addBudgetItem({
        category: newBudgetItem.category,
        planned: Number(newBudgetItem.planned),
      }).unwrap();

      setNewBudgetItem({ category: '', planned: 0 });
      toast.success('Budget item added successfully');          // ✅ green
    } catch (err) {
      toast.error(`Error adding budget item: ${err.data?.message || 'Unknown error'}`); // 🔴 red
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteBudgetItem(itemId).unwrap();
      /*  👇  “Success but visually RED” – treat as error type so bg = red  */
      toast.error('Budget item deleted');                       // 🔴 red
    } catch (err) {
      toast.error(`Error deleting budget item: ${err.data?.message || 'Unknown error'}`); // 🔴 red
    }
  };

  /* ──────────────── Loading state ──────────────── */
  if (isLoading || isAddingItem || isUpdatingItem || isDeletingItem) {
    return <Loader fullScreen />;
  }


  return (
    <div className="flex min-h-screen">
      <div className="min-h-screen w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Wedding Budget</h2>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Total Budget:</span>{" "}
                <span className="font-bold">Rs {totalPlanned.toLocaleString()}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr style={{ borderBottom: '1px solid gray' }}>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Planned</th>
                      <th className="text-right py-3 px-4">Actual</th>
                      <th className="text-right py-3 px-4">Difference</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget.map((item) => (
                      <tr key={item._id} style={{ borderBottom: '1px solid gray' }}>
                        <td className="py-3 px-4">{item.category}</td>
                        <td className="py-3 px-4 ">{item.planned.toLocaleString()}</td>
                        <td className="py-3 px-4 ">
                          <input
                            type="number"
                            value={actualInputs[item._id] ?? ''}
                            onChange={(e) => {
                              setActualInputs({ ...actualInputs, [item._id]: e.target.value });
                            }}
                            onBlur={(e) => {
                              updateActualBudget(item._id, Number(e.target.value));
                            }}
                            className="w-24  border rounded px-2 py-1"
                            min={0}
                          />
                        </td>
                        <td
                          className={`py-3 px-4  font-medium ${item.actual && item.actual > item.planned
                            ? "text-red-500"
                            : "text-green-500"
                            }`}
                        >
                          {item.actual
                            ? (item.planned - item.actual).toLocaleString()
                            : "-"}
                        </td>
                        <td className="py-3 px-4 ">
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-500 hover:text-red-700"
                            disabled={isDeletingItem}
                          >
                            <MdDelete size={25} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {budget.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-4 text-center text-gray-500">
                          No budget items yet. Add your first item!
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 font-bold">
                      <td className="py-3 px-4">Total</td>
                      <td className="py-3 px-4">{totalPlanned.toLocaleString()}</td>
                      <td className="py-3 px-4 ">{totalActual.toLocaleString()}</td>
                      <td
                        className={`py-3 px-4 ${budgetRemaining < 0 ? "text-red-500" : "text-green-500"
                          }`}
                      >
                        {budgetRemaining.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add Budget Item</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block mb-1 font-medium">
                    Category
                  </label>
                  <input
                    id="category"
                    placeholder="e.g., Flowers"
                    value={newBudgetItem.category}
                    onChange={(e) =>
                      setNewBudgetItem({ ...newBudgetItem, category: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div>
                  <label htmlFor="planned" className="block mb-1 font-medium">
                    Planned Amount (₹)
                  </label>
                  <input
                    id="planned"
                    type="number"
                    placeholder="0"
                    value={newBudgetItem.planned || ""}
                    onChange={(e) =>
                      setNewBudgetItem({
                        ...newBudgetItem,
                        planned: Number(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    min={0}
                  />
                </div>

                <button
                  onClick={handleAddBudgetItem}
                  disabled={!newBudgetItem.category || newBudgetItem.planned <= 0 || isAddingItem}
                  className="w-full bg-[#0D3F6A] hover:bg-[#0D3F6A] disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md"
                >
                  {isAddingItem ? "Adding..." : "Add Budget Item"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Planned:</span>
                  <span className="font-bold">₹{totalPlanned.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-bold ">₹{totalActual.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-t border-gray-300 pt-2">
                  <span className="text-gray-600">Remaining:</span>
                  <span
                    className={`font-bold ${budgetRemaining < 0 ? "text-red-500" : "text-green-500"
                      }`}
                  >
                    ₹{budgetRemaining.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
