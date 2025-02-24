import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  // Manage receiptTypes state in the Dashboard
  const [receiptTypes, setReceiptTypes] = useState([]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-3xl font-bold">Dashboard</div>
        <ul className="space-y-4 mt-4">
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Outlet context={{ receiptTypes, setReceiptTypes }} />
      </div>
    </div>
  );
};

export default Dashboard;
