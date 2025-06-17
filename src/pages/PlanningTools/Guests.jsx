import { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const GuestList = () => {
  const navigate = useNavigate();
  window.scrollTo({ top: 0, category: "top" })
  const [guests, setGuests] = useState(() => {
    const stored = localStorage.getItem("guests");
    return stored ? JSON.parse(stored) : [
      { name: "John Smith", email: "john@example.com", phone: "+1234567890", status: "pending" },
      { name: "Sarah Johnson", email: "sarah@example.com", phone: "+1234567891", status: "accepted" },
      { name: "Mike Wilson", email: "mike@example.com", phone: "+1234567892", status: "declined" },
    ];
  });

  const [newGuest, setNewGuest] = useState({ name: "", email: "", phone: "", status: "pending" });

  // Save guests to localStorage on change
  useEffect(() => {
    localStorage.setItem("guests", JSON.stringify(guests));
  }, [guests]);

  const handleAddGuest = () => {
    if (newGuest.name && newGuest.email && newGuest.phone) {
      setGuests([...guests, newGuest]);
      setNewGuest({ name: "", email: "", phone: "", status: "pending" });
    }
  };

  const handleStatusChange = (index, status) => {
    const updatedGuests = [...guests];
    updatedGuests[index].status = status;
    setGuests(updatedGuests);
  };

  const countByStatus = (status) => guests.filter((g) => g.status === status).length;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#6B9AC4] py-16 text-black">
        <div className="mx-auto text-left px-4 max-w-3xl">
          <Link to={navigate("/planning-tools")}
            style={{ textDecoration: 'none' }}
            onClick={() => navigate("/planning-tools")}
            className="text-white flex items-center mx-auto gap-1"
          >
            <span className="text-2xl"><IoIosArrowRoundBack /></span>
            <span className="text-base">Back to Planning Tools</span>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold  font-playfair text-white">
            Guest Management
          </h1>
          <p className="mb-8 text-white text-base md:text-lg">
            Manage your guest list, send invitations and track RSVPs
          </p>
        </div>
      </div>

      <div className="p-4 max-w-6xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card title="Total Guests" count={guests.length} icon="👥" />
          <Card title="Accepted" count={countByStatus("accepted")} icon="✅" />
          <Card title="Declined" count={countByStatus("declined")} icon="❌" />
          <Card title="Pending" count={countByStatus("pending")} icon="✉️" />
        </div>

        {/* Add New Guest */}
        <div className="bg-white border rounded p-4 space-y-4">
          <h3 className="text-lg font-semibold">➕ Add New Guest</h3>
          <p className="text-sm text-gray-600">Add guests to your wedding list</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Guest name"
              value={newGuest.name}
              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="email"
              placeholder="guest@example.com"
              value={newGuest.email}
              onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="+1234567890"
              value={newGuest.phone}
              onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <button
              onClick={handleAddGuest}
              className="bg-[#003366] text-white rounded px-4 py-2 hover:bg-[#002244]"
            >
              Add Guest
            </button>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white border rounded p-4 space-y-4">
          <h3 className="text-lg font-semibold">Guest List</h3>
          <p className="text-sm text-gray-600">Manage your wedding guest list and track RSVPs</p>
          {guests.map((guest, idx) => (
            <div key={idx} className="border rounded p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{guest.name}</p>
                  <p className="text-sm text-gray-600">{guest.email}</p>
                  <p className="text-sm text-gray-600">{guest.phone}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded capitalize ${guest.status === "accepted"
                    ? "bg-green-100 text-green-700"
                    : guest.status === "declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {guest.status}
                </span>
              </div>
              <div className="flex gap-2 text-sm">
                <button onClick={() => handleStatusChange(idx, "pending")} className="bg-orange-200 px-2 py-1 rounded hover:bg-orange-300">Pending</button>
                <button onClick={() => handleStatusChange(idx, "accepted")} className="bg-green-200 px-2 py-1 rounded hover:bg-green-300">Accept</button>
                <button onClick={() => handleStatusChange(idx, "declined")} className="bg-red-200 px-2 py-1 rounded hover:bg-red-300">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Card = ({ title, count, icon }) => (
  <div className="bg-white border rounded p-4 text-center">
    <div className="text-3xl mb-1">{icon}</div>
    <p className="text-lg font-semibold">{count}</p>
    <p className="text-sm text-gray-600">{title}</p>
  </div>
);

export default GuestList;
