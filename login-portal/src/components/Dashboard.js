import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DashboardOverview from "./DashboardOverview"; // Import the overview component

const Dashboard = () => {
  const [receiptTypes, setReceiptTypes] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // You can clear any user-related data here (e.g., tokens, user info)
    localStorage.removeItem("authToken"); // Example: Remove auth token from local storage
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        
        <ul className="space-y-4 mt-4 flex-grow">
          <li>
          <div className="p-4 text-3xl font-bold">
            <Link
              to="overview"
              
            >
              Admin Dashboard
            </Link>
            </div>
          </li>
          <li>
            <Link
              to="member"
              className="block cursor-pointer font-bold p-4 hover:bg-gray-700"
            >
              Member
            </Link>
          </li>
          <li>
            <Link
              to="receipt"
              className="block cursor-pointer font-bold p-4 hover:bg-gray-700"
            >
              Receipt
            </Link>
          </li>
          <li>
            <Link
              to="transaction"
              className="block cursor-pointer font-bold p-4 hover:bg-gray-700"
            >
              Transaction
            </Link>
          </li>
          <li>
            <Link
              to="settings"
              className="block cursor-pointer font-bold p-4 hover:bg-gray-700"
            >
              Settings
            </Link>
          </li>
        </ul>
        {/* Logout Button at the bottom */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet context={{ receiptTypes, setReceiptTypes }} />
      </div>
    </div>
  );
};

export default Dashboard;
