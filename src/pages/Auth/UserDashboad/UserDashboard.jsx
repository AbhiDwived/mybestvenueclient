import React, { useState, useEffect } from "react";
import { useGetUserProfileQuery } from "../../../features/auth/authAPI";
import Loader from "../../../components/{Shared}/Loader";

// Tab components
import Checklist from "../UserDashboad/CheckList";
import Budget from "../UserDashboad/Budget";
import GuestList from "../UserDashboad/GuestList";
import SavedVendors from "../UserDashboad/SavedVendor";
import Inquiries from "../UserDashboad/Inquiry";
import ProfileTab from "../UserDashboad/UserProfile";
import Booking from "../UserDashboad/Booking";

const tabs = [
  { value: "check-list", label: "Checklist", component: Checklist },
  { value: "budget", label: "Budget", component: Budget },
  { value: "booking", label: "Booking", component: Booking },
  { value: "guest-list", label: "Guest", component: GuestList },
  { value: "saved-vendor", label: "Vendors", component: SavedVendors },
  { value: "inquiry", label: "Inquiries", component: Inquiries },
  { value: "profile", label: "Profile", component: ProfileTab },
];

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "check-list");

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useGetUserProfileQuery();

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    refetch(); // ensures fresh data on mount
  }, []);

  if (isLoading) return <Loader fullScreen />;
  if (isError || !profile) return <p className="p-4 text-red-500">Error fetching profile</p>;

  const weddingDate = profile?.weddingDate ? new Date(profile.weddingDate) : null;

  const formattedWeddingDate = weddingDate
    ? weddingDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "No wedding date set";

  const displayName = profile?.name?.split("&")[0] || "User";
  const location = profile?.location || "Location not set";

  const ActiveComponent = tabs.find((tab) => tab.value === activeTab)?.component;

  return (
    <div className="w-full">
      {/* Greeting */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-serif">
              Hello, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-serif">
              {formattedWeddingDate} • {location}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lg:mt-7 p-2">
        <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-14 gap-2 bg-gray-200 py-1 px-2 overflow-x-auto rounded">
          {tabs.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`py-1 px-2 text-sm sm:text-base capitalize transition-all duration-200 border whitespace-nowrap rounded
                ${activeTab === value
                  ? "bg-white text-black font-semibold"
                  : "bg-gray-200 text-gray-600 hover:bg-white hover:text-black"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-2 sm:p-4">
        {ActiveComponent && <ActiveComponent profile={profile} />}
      </div>
    </div>
  );
};

export default UserDashboard;
