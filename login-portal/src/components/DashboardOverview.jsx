import React from "react";
import { FaShoppingCart } from "react-icons/fa"; // Add this import for the shopping cart icon
import Rect11 from "../assets/Rectangle11.png";
import Rect12 from "../assets/Rectangle12.png";
import Rect13 from "../assets/Rectangle13.png";
import Rect17 from "../assets/Rectangle17.png";

const DashboardOverview = () => {
  return (

    

    <div>
      <nav className="text-white fixed  p-6 border-b-2 top-0 left-0 w-full border-gray-300  -mt-6 -ml-8">
        <div className="flex items-center justify-between">
          {/* Navbar Logo or Title */}
          <h1 className="text-3xl font-bold mt-6 ml-[289px] text-black">POS-Dashboard</h1>

          {/* Search Bar inside Navbar */}
          <div className="flex-grow max-w-sm  mx-10 ml-[530px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-3 bg-gray-100 rounded-lg mt-6 border rounded-3xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Add to Cart Icon */}
          <div className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 mt-6 cursor-pointer" />
            <span className="absolute top-4 right-0 bg-red-500 text-white text-xs rounded-full px-1">
              3 {/* You can replace 3 with dynamic cart count */}
            </span>
          </div>
        </div>
      </nav>
      

      {/* The rest of your Dashboard content */}
      <div className="bg-white p-9  -ml-6 rounded-lg h-30 mt-[67px] space-y-9">

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
          <button className="border-2 rounded-3xl px-4 h-[35px] pt-[3px] mt-[28px] ml-[135px] text-white w-[84px] py-2 bg-[#FD9400] hover:bg-gray-200">
              Print
          </button>
          </div>

          <div className="p-2  rounded-lg border-2 -ml-[216px] border-gray-300 h-[259px] w-[237px] flex flex-col ">
          {/* Image */}
           <img src={Rect13} alt="Rectangle" className="w-full h-30 mb-2" />
           {/* Text */}
           <h3 className="text-lg font-semibold">நெய் விளக்கு</h3>
          <p className="text-base">LKR 40.00</p>
          <button className="border-2 rounded-3xl px-4 h-[35px] pt-[3px] mt-[28px] ml-[135px] text-white w-[84px] py-2 bg-[#FD9400] hover:bg-gray-200">
              Print
          </button>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
  <div className="border-2 p-4 w-[534px] h-[302px] bg-[#FD94000D] rounded-xl">
      <h1 className="text-2xl font-bold">Top Donators</h1>
  </div>
  <div
      className="border-2 p-4 w-[334px] h-[302px] rounded-xl relative"
      style={{ backgroundImage: `url(${Rect17})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Black Overlay with reduced opacity */}
      <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>

      {/* Content above the overlay */}
      <h1 className="text-xl font-bold text-white relative z-10">Up coming events</h1>
      <p className="text-white pt-5">
        1.thiruvizha
      </p>
    </div>
</div>

    </div>
  );
};

export default DashboardOverview;
