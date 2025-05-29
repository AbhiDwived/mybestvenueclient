import React, { useState, useEffect } from "react";
import { Calendar, Trash2 } from "lucide-react";

export default function CheckList() {
    const [newTask, setNewTask] = useState("");
    const [tasks, setTasks] = useState([]);

    // Load tasks from localStorage on mount
    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    // Save tasks to localStorage whenever updated
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = () => {
        if (!newTask.trim()) return;

        const newItem = {
            id: Date.now(),
            task: newTask.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        };

        setTasks((prev) => [...prev, newItem]);
        setNewTask("");
    };

    const toggleTaskCompletion = (id) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const completedTasks = tasks.filter((t) => t.completed).length;
    const completionPercentage = tasks.length
        ? Math.round((completedTasks / tasks.length) * 100)
        : 0;

    return (
        <div className="flex min-h-screen ">
            <section className="flex-grow ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checklist Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg  p-6 mb-6">
                            <h2 className="text-xl font-bold text-wedding-dark">Wedding Checklist</h2>
                            <div className="flex items-center justify-between mb-4">

                                <div className="text-sm text-gray-600">
                                    {completedTasks} of {tasks.length} tasks completed
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
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`flex justify-between items-start p-2 rounded-md border transition bg-[#f0f2f5] hover:shadow-sm ${task.completed ? "opacity-90" : ""
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => toggleTaskCompletion(task.id)}
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
                                            onClick={() => deleteTask(task.id)}
                                            className="text-gray-400 hover:text-red-500 mt-4"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
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
                                    disabled={!newTask.trim()}
                                    className={`w-full text-sm font-medium px-4 py-2 rounded-md transition ${newTask.trim()
                                        ? "bg-[#0F4C81] text-white  hover:bg-[#0f304de2]"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
