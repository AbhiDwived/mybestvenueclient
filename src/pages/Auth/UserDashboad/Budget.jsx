import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGetUserBudgetQuery, useAddBudgetItemMutation, useUpdateBudgetItemMutation, useDeleteBudgetItemMutation } from '../../../features/budget/budgetAPI';
import { useSelector } from 'react-redux';
import { MdDelete } from "react-icons/md";
import { Tooltip } from 'react-tooltip';
import Loader from "../../../components/{Shared}/Loader";
import { showToast, handleApiError } from '../../../utils/toast';

export default function Budget() {
  // Local state for new budget item form
  const [newBudgetItem, setNewBudgetItem] = useState({ category: "", planned: 0 });
  
  // Get user authentication state
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // RTK Query hooks with optimized configuration
  const { 
    data: budgetData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetUserBudgetQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: true,
  });
  
  const [addBudgetItem, { isLoading: isAddingItem }] = useAddBudgetItemMutation();
  const [updateBudgetItem, { isLoading: isUpdatingItem }] = useUpdateBudgetItemMutation();
  const [deleteBudgetItem, { isLoading: isDeletingItem }] = useDeleteBudgetItemMutation();

  // State to manage local budget items for real-time updates
  const [localBudgetItems, setLocalBudgetItems] = useState([]);

  // Sync local budget items with API data
  useEffect(() => {
    if (budgetData?.data?.items) {
      setLocalBudgetItems(budgetData.data.items);
    }
  }, [budgetData]);

  // Show error if API request fails
  useEffect(() => {
    if (isError) {
      handleApiError(error, 'Error loading budget');
    }
  }, [isError, error]);

  // Memoized update function to avoid unnecessary re-renders
  const updateActualBudget = useCallback(async (id, actual) => {
    try {
      // Validate input
      const parsedActual = actual === '' ? 0 : Number(actual);
      
      if (isNaN(parsedActual)) {
        showToast.error('Please enter a valid number');
        return;
      }

      // Find the current item
      const currentItem = localBudgetItems.find(item => item._id === id);
      if (!currentItem) return;

      // Optimistically update local state
      const updatedItems = localBudgetItems.map(item => 
        item._id === id ? { ...item, actual: parsedActual } : item
      );
      setLocalBudgetItems(updatedItems);

      // Send update to backend
      await updateBudgetItem({
        itemId: id,
        itemData: { actual: parsedActual }
      }).unwrap();

      showToast.success('Budget updated successfully');
    } catch (err) {
      // Revert local state on error
      setLocalBudgetItems(localBudgetItems);
      handleApiError(err, 'Error updating budget');
    }
  }, [localBudgetItems, updateBudgetItem]);

  // Memoized budget calculations to prevent unnecessary recalculations
  const budgetSummary = useMemo(() => {
    const totalPlanned = localBudgetItems.reduce((sum, item) => sum + item.planned, 0);
    const totalActual = localBudgetItems.reduce((sum, item) => sum + (item.actual || 0), 0);
    const budgetRemaining = totalPlanned - totalActual;

    return {
      totalPlanned,
      totalActual,
      budgetRemaining
    };
  }, [localBudgetItems]);

  // Delete budget item with optimistic update
  const handleDeleteItem = useCallback(async (itemId) => {
    // Find the item to be deleted
    const itemToDelete = localBudgetItems.find(item => item._id === itemId);
    if (!itemToDelete) return;

    try {
      // Optimistically remove item from local state
      const updatedItems = localBudgetItems.filter(item => item._id !== itemId);
      setLocalBudgetItems(updatedItems);

      // Delete from backend
      await deleteBudgetItem(itemId).unwrap();
      
      showToast.success('Budget item deleted successfully');
    } catch (err) {
      // Revert local state on error
      setLocalBudgetItems(prev => [...prev, itemToDelete]);
      handleApiError(err, 'Error deleting budget item');
    }
  }, [localBudgetItems, deleteBudgetItem]);

  // Render method for actual budget input
  const renderActualInput = useCallback((item) => {
    return (
      <input
        type="number"
        value={item.actual || ''}
        onChange={(e) => {
          // Update local state immediately without API call
          setLocalBudgetItems(prevItems => 
            prevItems.map(i => 
              i._id === item._id ? { ...i, actual: Number(e.target.value) } : i
            )
          );
        }}
        onBlur={(e) => updateActualBudget(item._id, e.target.value)}
        className="w-24 border rounded px-2 py-1"
        min={0}
      />
    );
  }, [updateActualBudget]);

  // Render budget items table
  const renderBudgetItemsTable = useMemo(() => {
    return (
      <>
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
            {localBudgetItems.map((item) => (
              <tr key={item._id} style={{ borderBottom: '1px solid gray' }}>
                <td className="py-3 px-4">{item.category}</td>
                <td className="py-3 px-4">{(item.planned ?? 0).toLocaleString()}</td>
                <td className="py-3 px-4">{renderActualInput(item)}</td>
                <td
                  className={`py-3 px-4 font-medium ${(item.actual ?? 0) > (item.planned ?? 0)
                    ? "text-red-500"
                    : "text-green-500"
                    }`}
                >
                  {(item.planned != null && item.actual != null)
                    ? ((item.planned - item.actual).toLocaleString())
                    : "-"}
                </td>
                <td className="py-3 px-4">
                  <button
                    id={`delete-budget-${item._id}`}
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-red-500 hover:text-red-700 relative"
                    disabled={isDeletingItem}
                  >
                    <MdDelete size={25} />
                  </button>
                  <Tooltip 
                    anchorId={`delete-budget-${item._id}`}
                    content="Delete Budget Item"
                    place="top"
                  />
                </td>
              </tr>
            ))}
            {localBudgetItems.length === 0 && (
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
              <td className="py-3 px-4">{budgetSummary.totalPlanned.toLocaleString()}</td>
              <td className="py-3 px-4">{budgetSummary.totalActual.toLocaleString()}</td>
              <td
                className={`py-3 px-4 ${budgetSummary.budgetRemaining < 0 ? "text-red-500" : "text-green-500"}`}
              >
                {budgetSummary.budgetRemaining.toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </>
    );
  }, [localBudgetItems, budgetSummary, renderActualInput, handleDeleteItem, isDeletingItem]);

  // Add new budget item handler
  const handleAddBudgetItem = async () => {
    if (!newBudgetItem.category || newBudgetItem.planned <= 0) return;

    // Optimistic update
    const optimisticItem = {
      _id: `temp-${Date.now()}`, // Temporary ID
      category: newBudgetItem.category,
      planned: Number(newBudgetItem.planned),
      actual: 0
    };

    try {
      // Immediately update local state
      setLocalBudgetItems(prev => [...prev, optimisticItem]);

      // Send to backend
      const result = await addBudgetItem({
        category: newBudgetItem.category,
        planned: Number(newBudgetItem.planned)
      }).unwrap();
      
      // Replace temporary item with server-returned item
      setLocalBudgetItems(prev => 
        prev.map(item => 
          item._id === optimisticItem._id ? result : item
        )
      );
      
      // Reset form
      setNewBudgetItem({ category: "", planned: 0 });
      showToast.success('Budget item added successfully');
    } catch (err) {
      // Revert local state on error
      setLocalBudgetItems(prev => 
        prev.filter(item => item._id !== optimisticItem._id)
      );
      handleApiError(err, 'Error adding budget item');
    }
  };

  // Show loading state
  if (isLoading) {
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
                <span className="font-bold">Rs {budgetSummary.totalPlanned.toLocaleString()}</span>
              </div>
              <div className="overflow-x-auto">
                {renderBudgetItemsTable}
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
                  disabled={!newBudgetItem.category || newBudgetItem.planned <= 0}
                  className="w-full bg-[#0D3F6A] hover:bg-[#0D3F6A] disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-md"
                >
                  Add Budget Item
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Planned:</span>
                  <span className="font-bold">₹{budgetSummary.totalPlanned.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent:</span>
                  <span className="font-bold ">₹{budgetSummary.totalActual.toLocaleString()}</span>
                </div>

                <div className="flex justify-between border-t border-gray-300 pt-2">
                  <span className="text-gray-600">Remaining:</span>
                  <span
                    className={`font-bold ${budgetSummary.budgetRemaining < 0 ? "text-red-500" : "text-green-500"
                      }`}
                  >
                    ₹{budgetSummary.budgetRemaining.toLocaleString()}
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
