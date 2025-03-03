import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

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
      <div className="fixed w-64 bg-white-800 text-white flex flex-col h-full border-r-2 border-gray-300">
        <ul className="space-y-4 mt-4 flex-grow">
          <li>
            <div className="text-white p-7 border-b-2 w-full -mt-14 border-gray-300">
            <div className="p-3 text-6xl pt-7 font-bold h-[89px] text-[#FD9400]">
              <Link to="overview">Logo</Link>
            </div>
            </div>
          </li>
          <li className="text-black">
            <Link
              to="member"
              className="block cursor-pointer font-bold p-4 hover:bg-gray-700"
            >
              Member
            </Link>
          </li>
          <li className="text-black">
            <Link
              to="receipt"
              className="block cursor-pointer font-bold p-4 hover:bg-gray-700"
            >
              Receipt
            </Link>
          </li>
          <li className="text-black">
            <Link
              to="transaction"
              className="block cursor-pointer font-bold p-4 hover:bg-gray-700"
            >
              Transaction
            </Link>
          </li>
          <li className="text-black">
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
      <div className="ml-64 flex-1 p-6">
        <Outlet context={{ receiptTypes, setReceiptTypes }} />
      </div>
    </div>
  );
};

export default Dashboard;
