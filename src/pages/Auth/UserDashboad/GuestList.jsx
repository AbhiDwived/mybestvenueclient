import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function GuestManager() {
    const [guests, setGuests] = useState([]);
    const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', status: 'pending' });

    // ✅ Load guests from localStorage on component mount
    useEffect(() => {
        const storedGuests = localStorage.getItem("guests");
        if (storedGuests) {
            setGuests(JSON.parse(storedGuests));
        }
    }, []);

    // ✅ Save guests to localStorage whenever guests state changes
    useEffect(() => {
        localStorage.setItem("guests", JSON.stringify(guests));
    }, [guests]);

    const updateGuestStatus = (id, status) => {
        setGuests(guests.map(g => g.id === id ? { ...g, status } : g));
    };

    const deleteGuest = (id) => {
        setGuests(guests.filter(g => g.id !== id));
    };

    const handleAddGuest = () => {
        const id = Date.now().toString();
        setGuests([...guests, { ...newGuest, id }]);
        setNewGuest({ name: '', email: '', phone: '', status: 'pending' });
    };

    return (
        <div className="flex min-h-screen">
            <main className="flex-1  pb-12">
                <div className="">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Guest Table */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">Guest List</h2>
                                    <div className="flex items-center space-x-4">
                                        {['confirmed', 'pending', 'declined'].map(status => (
                                            <div className="flex items-center" key={status}>
                                                <div className={`w-3 h-3 rounded-full mr-1 ${status === 'confirmed' ? 'bg-green-500' :
                                                    status === 'pending' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                    }`}></div>
                                                <span className="text-xs text-gray-600 capitalize">
                                                    {status}: {guests.filter(g => g.status === status).length}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid gray' }}>
                                                <th className="text-left py-3 px-4">Name</th>
                                                <th className="text-left py-3 px-4">Contact</th>
                                                <th className="text-center py-3 px-4">Status</th>
                                                <th className="text-right py-3 px-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {guests.map((guest) => (
                                                <tr key={guest.id} style={{ borderBottom: '1px solid gray' }}>
                                                    <td className="py-3 px-4">{guest.name}</td>
                                                    <td className="py-3 px-4">
                                                        <div>{guest.email}</div>
                                                        <div className="text-sm text-gray-500">{guest.phone}</div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <select
                                                            value={guest.status}
                                                            onChange={(e) => updateGuestStatus(guest.id, e.target.value)}
                                                            className={`rounded-md px-2 py-1 text-sm ${guest.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                guest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="declined">Declined</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-5">
                                                        <button
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => deleteGuest(guest.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4">Add Guest</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="guestName" className="block text-sm font-medium">Guest Name</label>
                                        <input
                                            id="guestName"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="John Doe"
                                            value={newGuest.name}
                                            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="guestEmail" className="block text-sm font-medium">Email</label>
                                        <input
                                            id="guestEmail"
                                            type="email"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="john@example.com"
                                            value={newGuest.email}
                                            onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="guestPhone" className="block text-sm font-medium">Phone</label>
                                        <input
                                            id="guestPhone"
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="9876543210"
                                            value={newGuest.phone}
                                            onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddGuest}
                                        disabled={!newGuest.name || (!newGuest.email && !newGuest.phone)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-300"
                                    >
                                        Add Guest
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                <h3 className="text-lg font-semibold mb-4">Guest List Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Guests:</span>
                                        <span className="font-bold">{guests.length}</span>
                                    </div>
                                    {['confirmed', 'pending', 'declined'].map(status => (
                                        <div className="flex justify-between" key={status}>
                                            <span className="text-gray-600 capitalize">{status}:</span>
                                            <span className={`font-bold ${status === 'confirmed' ? 'text-green-600' :
                                                status === 'pending' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>
                                                {guests.filter(g => g.status === status).length}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
