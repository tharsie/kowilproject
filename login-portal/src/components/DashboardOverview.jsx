import React from "react";

const DashboardOverview = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Search Bar at the top */}
        <div className="md:col-span-3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-3 bg-gray-100 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

      {/* Grid with search bar and overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Overview Stats */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Members</h3>
          <p className="text-2xl">100</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Receipts</h3>
          <p className="text-2xl">150</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Transactions</h3>
          <p className="text-2xl">200</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
