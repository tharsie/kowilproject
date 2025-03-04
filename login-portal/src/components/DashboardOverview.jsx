import React from "react";
import { FaShoppingCart } from "react-icons/fa"; // Add this import for the shopping cart icon
import Rect11 from "../assets/Rectangle11.png";
import Rect12 from "../assets/Rectangle12.png";
import Rect13 from "../assets/Rectangle13.png";
import Rect17 from "../assets/Rectangle17.png";
import cart from "../assets/cart.svg"
import premiumpng from "../assets/premium-quality 1.png"

const DashboardOverview = () => {
  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="text-white  fixed w-full p-6 border-b-2 top-0 left-0 border-gray-300 -mt-6">
        <div className="flex items-center  justify-between">
          {/* Logo */}
          <h1 className="text-2xl lg:text-3xl font-bold mt-6 ml-4 lg:ml-[289px] text-black">
            POS-Dashboard
          </h1>

          {/* Search Bar */}
          <div className="hidden lg:block flex-grow max-w-sm ml-4 lg:ml-[530px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-3 bg-gray-100 rounded-3xl mt-6 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cart Icon */}
          <div className="relative ml-4 lg:ml-6 mt-5">
            <img src={cart} alt="Cart" className="w-10 h-10" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                3 {/* Dynamic count */}
            </span>
          </div>
        </div>

        {/* Search Bar for Mobile */}
        <div className="block lg:hidden px-4 mt-3">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-3 bg-gray-100 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </nav>

      {/* Content Section */}
      <div className="bg-white p-3 mt-[90px] space-y-6">
        {/* Overview Grid */}
        <div className="flex flex-col lg:flex-row justify-between ">
          {/* Cards */}
          <div className="p-2 rounded-lg border-2 border-gray-300 h-[259px] w-[237px] flex flex-col">
            <img src={Rect11} alt="Rectangle" className="w-full h-30 mb-2" />
            <h3 className="text-lg font-semibold">பழ அர்ச்சனை</h3>
            <p className="text-base">LKR 40.00</p>
            <button className="border-2 rounded-3xl px-4 h-[35px] mt-[28px] ml-auto text-white w-[84px] bg-[#FD9400] hover:bg-gray-200">
              Print
            </button>
          </div>

          <div className="p-2 rounded-lg border-2 border-gray-300 h-[259px] w-[237px] flex flex-col">
            <img src={Rect12} alt="Rectangle" className="w-full h-30 mb-2" />
            <h3 className="text-lg font-semibold">காழஞ்சி அர்ச்சனை</h3>
            <p className="text-base">LKR 40.00</p>
            <button className="border-2 rounded-3xl px-4 h-[35px] mt-[28px] ml-auto text-white w-[84px] bg-[#FD9400] hover:bg-gray-200">
              Print
            </button>
          </div>

          <div className="p-2 rounded-lg border-2 border-gray-300 h-[259px] w-[237px] flex flex-col">
            <img src={Rect13} alt="Rectangle" className="w-full h-30 mb-2" />
            <h3 className="text-lg font-semibold">நெய் விளக்கு</h3>
            <p className="text-base">LKR 40.00</p>
            <button className="border-2 rounded-3xl px-4 h-[35px] mt-[28px] ml-auto text-white w-[84px] bg-[#FD9400] hover:bg-gray-200">
              Print
            </button>
          </div>
          <div className="p-2 rounded-lg border-2 border-gray-300 h-[259px] w-[237px] flex flex-col">
            <img src={Rect13} alt="Rectangle" className="w-full h-30 mb-2" />
            <h3 className="text-lg font-semibold">நெய் விளக்கு</h3>
            <p className="text-base">LKR 40.00</p>
            <button className="border-2 rounded-3xl px-4 h-[35px] mt-[28px] ml-auto text-white w-[84px] bg-[#FD9400] hover:bg-gray-200">
              Print
            </button>
          </div>
          <div className="rounded-lg border-2 w-[130px] bg-[#FD94000D] flex justify-center items-center">
            <div className="border-2 w-[50px] h-[50px] rounded-full bg-[#FD9400]  flex justify-center items-center ">
            <i class="bi bi-arrow-right text=3xl"></i>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Top Donators */}
          <div className="border-2 p-4 w-full w-3/5 h-[302px] bg-[#FD94000D] rounded-xl">
            <h1 className="text-2xl font-bold">Top Donators</h1>
            <div className="bg-white mt-5 ml-5 w-3/4 pl-9 rounded-full h-1/6 flex justify-between pt-2 ">
            <img src={premiumpng} alt="Cart" className="w-8 -ml-5 h-8" />
            <p className="text-black relative font-bold -ml-24 z-10">Shanker Sivanathan</p>
            <p className="text-black relative font-semibold mr-6 z-10">LKR 100,000</p>
            </div>
            <div className="flex justify-between w-3/4 font-semibold">
            <p className="text-black pt-5 relative z-10">Mahendran Ravikumar</p>
            <p className="text-black pt-5 relative z-10">LKR 50,000</p>
            </div>
            <div className="flex justify-between w-3/4 font-semibold">
            <p className="text-black pt-5 relative z-10">Thushidan Pathmanathan</p>
            <p className="text-black pt-5 relative z-10">LKR 20,000</p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div
            className="border-2 p-4 w-full w-2/5 h-[302px] rounded-xl relative bg-cover bg-center"
            style={{ backgroundImage: `url(${Rect17})` }}
          >
            <div className="absolute inset-0 bg-black  opacity-60 rounded-xl"></div>
            <h1 className="text-xl font-bold text-white relative z-10">
              Upcoming events
            </h1>
            <p className="text-white pt-5 relative z-10">1. Thiruvizha - 02/08/2025</p>
            <p className="text-white pt-2 relative z-10">2. Thiruvizha - 02/08/2025</p>
            <p className="text-white pt-2 relative z-10">3. Thiruvizha - 02/08/2025</p>
            <p className="text-white pt-2 relative z-10">4. Thiruvizha - 02/08/2025</p>
            <p className="text-white pt-2 relative z-10">5. Thiruvizha - 02/08/2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
