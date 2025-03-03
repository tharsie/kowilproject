import React from "react";
import { FaShoppingCart } from "react-icons/fa"; // Add this import for the shopping cart icon
import Rect11 from "../assets/Rectangle11.png";
import Rect12 from "../assets/Rectangle12.png";
import Rect13 from "../assets/Rectangle13.png";

const DashboardOverview = () => {
  return (

    

    <div>
      <nav className="text-white p-7 border-b-2 w-[1260px] border-gray-300 -mt-6 -ml-6">
        <div className="flex items-center justify-between">
          {/* Navbar Logo or Title */}
          <h1 className="text-3xl font-bold text-black">POS-Dashboard</h1>

          {/* Search Bar inside Navbar */}
          <div className="flex-grow max-w-sm  mx-10 ml-[530px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-3 bg-gray-100 rounded-lg  border rounded-3xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add to Cart Icon */}
          <div className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 cursor-pointer" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              3 {/* You can replace 3 with dynamic cart count */}
            </span>
          </div>
        </div>
      </nav>
      

      {/* The rest of your Dashboard content */}
      <div className="bg-white p-9  -ml-4 rounded-lg h-30  mt-8 space-y-9">

        {/* Grid with overview stats */}
        <div className="grid grid-cols-1  md:grid-cols-3 gap--9">
          {/* Overview Stats */}
          <div className="p-2 rounded-lg -ml-4 border-2 border-gray-300 h-[259px]  w-[237px] flex flex-col">
          {/* Image */}
           <img src={Rect11} alt="Rectangle" className="w-full h-30 mb-2" />
           {/* Text */}
           <h3 className="text-lg font-semibold">பழ அர்ச்சனை</h3>
          <p className="text-base">LKR 40.00</p>
          <button className="border-2 rounded-3xl px-4 h-[35px] pt-[3px] mt-[28px] ml-[135px] text-white w-[84px] py-2 bg-[#FD9400] hover:bg-gray-200">
              Print
          </button>

          </div>

          <div className="p-2  rounded-lg border-2 -ml-[116px] border-gray-300 h-[259px] w-[237px] flex flex-col ">
          {/* Image */}
           <img src={Rect12} alt="Rectangle" className="w-full h-30 mb-2" />
           {/* Text */}
           <h3 className="text-lg font-semibold">காழஞ்சி அர்ச்சனை</h3>
          <p className="text-base">LKR 40.00</p>
          </div>

          <div className="p-2  rounded-lg border-2 -ml-[216px] border-gray-300 h-[259px] w-[237px] flex flex-col ">
          {/* Image */}
           <img src={Rect13} alt="Rectangle" className="w-full h-30 mb-2" />
           {/* Text */}
           <h3 className="text-lg font-semibold">நெய் விளக்கு</h3>
          <p className="text-base">LKR 40.00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
