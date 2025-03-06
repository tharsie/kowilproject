import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import addressbook1 from "../assets/address-book 1.svg"
import addressbook2 from "../assets/address-book 2.svg"
import addressbook3 from "../assets/address-book 3.svg"
import addressbook4 from "../assets/address-book 4.svg"
import addressbook5 from "../assets/address-book 5.svg"

const Dashboard = () => {
  const [receiptTypes, setReceiptTypes] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // You can clear any user-related data here (e.g., tokens, user info)
    localStorage.removeItem("authToken"); // Example: Remove auth token from local storage
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <div className="fixed w-[240px] bg-white-800 text-white flex flex-col h-full border-r-2 border-gray-300 z-50">
        <ul className=" flex-grow">
          <li className="p-4 ">
            <div className="text-white p-6  -mt-14 border-gray-300">
            <div className="p-3 text-5xl pt-7 font-bold h-[89px] text-[#FD9400]">
              <h1>Logo</h1>
            </div>
            </div>
          </li>
          <li className="text-black text-[18px] p-4 -mt-2 ml-2">
            <Link
              to="overview"
              className="block cursor-pointer flex font-semibold hover  p-3 hover:bg-[#FD940012]"
            >
              <img src={addressbook1} alt="Cart" className="w-7 h-7 mr-3" />
              Dashboard
            </Link>
          </li>
          <li className="text-black text-[18px] p-4 -mt-4 ml-2">
            <Link
              to="member"
              className="block cursor-pointer flex font-semibold p-3 hover:bg-[#FD940012]"
            >
              <img src={addressbook2} alt="Cart" className="w-7 h-7 mr-3" />
              Member
            </Link>
          </li>
          <li className="text-black text-[18px] p-4 -mt-4 ml-2">
            <Link
              to="receipt"
              className="block cursor-pointer flex font-semibold p-3 hover:bg-[#FD940012]"
            >
              <img src={addressbook3} alt="Cart" className="w-8 h-8 mr-3" />
              Receipt
            </Link>
          </li>
          <li className="text-black text-[18px] p-4 -mt-4 ml-2 boarder-2 rounded-xl">
            <Link
              to="transaction"
              className="block cursor-pointer flex font-semibold p-3 hover:bg-[#FD940012]"
            >
              <img src={addressbook4} alt="Cart" className="w-8 h-8 mr-3" />
              Transaction
            </Link>
          </li>
          <li className="text-black text-[18px] p-4 -mt-4 ml-2">
            <Link
              to="settings"
              className="block cursor-pointer flex font-semibold p-3 hover:bg-[#FD940012]"
            >
              <img src={addressbook5} alt="Cart" className="w-7 h-7 mr-3" />
              Settings
            </Link>
          </li>
        </ul>
        {/* Logout Button at the bottom */}
        <div className="p-4 mt-auto ml-9">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#FD9400] text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
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
