import React, { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, Trash2 } from "lucide-react";
import { useGetUserChecklistQuery, useAddChecklistTaskMutation, useToggleTaskCompletionMutation, useDeleteChecklistTaskMutation } from "../../../features/checklist/checklistAPI";
import { useSelector } from "react-redux";
import Loader from "../../../components/{Shared}/Loader";
import { showToast, handleApiError } from '../../../utils/toast';

export default function CheckList() {
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);
    const [newTask, setNewTask] = useState("");
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    // RTK Query hooks
    const { 
        data: checklistData, 
        isLoading, 
        isError, 
        error,
        refetch 
    } = useGetUserChecklistQuery(undefined, {
        skip: !isAuthenticated,
    });
    
    const [addTask, { isLoading: isAdding }] = useAddChecklistTaskMutation();
    const [toggleTask, { isLoading: isToggling }] = useToggleTaskCompletionMutation();
    const [deleteTask, { isLoading: isDeleting }] = useDeleteChecklistTaskMutation();

    // Local state to manage tasks without full page reload
    const [localTasks, setLocalTasks] = useState([]);
    const [localCompletedCount, setLocalCompletedCount] = useState(0);
    const [localTotalCount, setLocalTotalCount] = useState(0);

    // Sync local state with API data
    useEffect(() => {
        if (checklistData?.data?.items) {
            setLocalTasks(checklistData.data.items);
            setLocalCompletedCount(checklistData.data.completedCount || 0);
            setLocalTotalCount(checklistData.data.totalCount || 0);
        }
    }, [checklistData]);

    // Show error if API request fails
    useEffect(() => {
        if (isError) {
            handleApiError(error, 'Error loading checklist');
        }
    }, [isError, error]);

    // Calculate completion percentage
    const completionPercentage = localTotalCount 
        ? Math.round((localCompletedCount / localTotalCount) * 100) 
        : 0;

    const handleAddTask = async () => {
        if (!newTask.trim()) return;

        // Optimistic update
        const optimisticTask = {
            _id: `temp-${Date.now()}`, // Temporary ID
            task: newTask.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        try {
            // Immediately update local state
            setLocalTasks(prev => [...prev, optimisticTask]);
            setLocalTotalCount(prev => prev + 1);

            // Send to backend
            const result = await addTask(newTask.trim()).unwrap();
            
            // Replace temporary task with server-returned task
            setLocalTasks(prev => {
                const updatedTasks = prev.map(task => 
                    task._id === optimisticTask._id ? result : task
                );
                return updatedTasks;
            });

            setNewTask("");
            if (isMounted.current) showToast.success("Task added successfully");
        } catch (err) {
            // Revert local state on error
            setLocalTasks(prev => prev.filter(task => task._id !== optimisticTask._id));
            setLocalTotalCount(prev => prev - 1);
            if (isMounted.current) handleApiError(err, 'Error adding task');
        }
    };

    const handleToggleTaskCompletion = async (id) => {
        // Find the current task
        const currentTask = localTasks.find(task => task._id === id);
        if (!currentTask) return;

        // Optimistic update
        const updatedTasks = localTasks.map(task => 
            task._id === id ? { ...task, completed: !task.completed } : task
        );
        
        // Update local state immediately
        setLocalTasks(updatedTasks);
        setLocalCompletedCount(prev => 
            currentTask.completed ? prev - 1 : prev + 1
        );

        try {
            // Send update to backend
            await toggleTask(id).unwrap();
        } catch (err) {
            // Revert local state on error
            setLocalTasks(localTasks);
            setLocalCompletedCount(prev => 
                currentTask.completed ? prev + 1 : prev - 1
            );
            if (isMounted.current) handleApiError(err, 'Error updating task');
        }
    };

    const handleDeleteTask = async (id) => {
        // Find the task to be deleted
        const taskToDelete = localTasks.find(task => task._id === id);
        if (!taskToDelete) return;

        // Optimistic update
        const updatedTasks = localTasks.filter(task => task._id !== id);
        
        // Update local state immediately
        setLocalTasks(updatedTasks);
        setLocalTotalCount(prev => prev - 1);
        if (taskToDelete.completed) {
            setLocalCompletedCount(prev => prev - 1);
        }

        try {
            // Send delete to backend
            await deleteTask(id).unwrap();
            if (isMounted.current) {
                console.log("Show toast: Task deleted successfully");
                showToast.success("Task deleted successfully", { autoClose: 5000 });
            }
        } catch (err) {
            // Revert local state on error
            setLocalTasks(prev => [...prev, taskToDelete]);
            setLocalTotalCount(prev => prev + 1);
            if (taskToDelete.completed) {
                setLocalCompletedCount(prev => prev + 1);
            }
            if (isMounted.current) handleApiError(err, 'Error deleting task');
        }
    };

    // Show loading state
    if (isLoading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="flex min-h-screen ">
            <div className="flex-grow ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checklist Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg  p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-wedding-dark">Wedding Checklist</h2>
                                <div className="text-sm text-gray-600">
                                    {localCompletedCount} of {localTotalCount} tasks completed
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
                                <div
                                    className="bg-[#0F4C81] h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>

                            {/* Task List */}
                            <div className="space-y-4">
                                {localTasks.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No tasks added yet. Add your first task!
                                    </div>
                                ) : (
                                    localTasks.map((task) => (
                                        <div
                                            key={task._id}
                                            className={`flex justify-between items-start p-2 rounded-md border transition bg-[#f0f2f5] hover:shadow-sm ${task.completed ? "opacity-90" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => handleToggleTaskCompletion(task._id)}
                                                    disabled={isToggling}
                                                    className="mt-1 w-4 h-4 accent-[#0F4C81]"
                                                />
                                                <div>
                                                    <p
                                                        className={`text-md font-medium ${task.completed ? "line-through text-gray-800" : "text-gray-800"
                                                            }`}
                                                    >
                                                        {task.task}
                                                    </p>
                                                    <div className="text-md text-gray-500 mt-1 flex items-center gap-2">
                                                        <Calendar size={12} />{" "}
                                                        Added: {new Date(task.createdAt).toLocaleDateString("en-US")}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                disabled={isDeleting}
                                                className="text-gray-400 hover:text-red-500 mt-4"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Add Task Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4 text-wedding-dark">Add New Task</h3>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="task"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Task Description
                                    </label>
                                    <input
                                        id="task"
                                        placeholder="Enter a new task..."
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f304d]"
                                    />
                                </div>

                                <button
                                    onClick={handleAddTask}
                                    disabled={!newTask.trim() || isAdding}
                                    className={`w-full text-sm font-medium px-4 py-2 rounded-md transition ${newTask.trim() && !isAdding
                                            ? "bg-[#0F4C81] text-white  hover:bg-[#0f304de2]"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {isAdding ? "Adding..." : "Add Task"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
