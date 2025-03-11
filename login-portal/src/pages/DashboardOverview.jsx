import React from "react";
import { useState,useEffect } from "react";
import Rect11 from "../assets/Rectangle11.png";
import Rect12 from "../assets/Rectangle12.png";
import Rect13 from "../assets/Rectangle13.png";
import Rect17 from "../assets/Rectangle17.png";
import cart from "../assets/cart.svg"
import arrow from "../assets/right 1.png"
import premiumpng from "../assets/premium-quality 1.png"
import { useNavigate } from "react-router-dom"; 

const DashboardOverview = () => {

  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [organizer, setOrganizer] = useState("");
  
  const [topDonors, setTopDonors] = useState([]);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/top-donors");
        if (!response.ok) {
          throw new Error("Failed to fetch top donors");
        }
        const data = await response.json();
        setTopDonors(data);
      } catch (error) {
        console.error("Error fetching top donors:", error);
      }
    };

    fetchTopDonors();
  }, []);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/events");
        if (!response.ok) throw new Error("Failed to fetch upcoming events");
        const data = await response.json();
        setUpcomingEvents(data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };
  
    fetchUpcomingEvents();
  }, []);

  

  const handleRedirect = () => {  
    navigate("/dashboard/receipt"); // Replace with your target route
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="text-white bg-white  fixed w-full p-6 border-b-2 top-3 left-0 border-gray-300 -mt-7 z-16">
        <div className="flex items-center  justify-between">
          {/* Logo */}
          <h1 className="text-2xl lg:text-3xl font-bold mt-6 ml-4 lg:ml-[244px] text-black">
            Dashboard
          </h1>
        </div>
      </nav>

      {/* Content Section */}
      <div className="bg-white p-3 mt-[80px] -ml-[29px] space-y-5">
        {/* Overview Grid */}
        <div className="flex flex-col lg:flex-row justify-between ">
          {/* Cards */}
          <div className="p-2 rounded-lg border-2  h-[259px] w-[237px] flex flex-col">
            <img src={Rect11} alt="Rectangle" className="w-full h-30 mb-2" />
            <h3 className="text-lg font-semibold">பழ அர்ச்சனை</h3>
            <p className="text-base">LKR 40.00</p>
            <div className="flex mt-[28px]">
            <div className="border-2 p-2 rounded-full flex items-center justify-center mr-2 pb-3 mt-2 w-[26px] h-[26px] border-[#D9D9D9]">
              <h1 className="text-xl">+</h1>
            </div>
            <h1 className="mt-2">1</h1>
            <div className="border-2 p-2 rounded-full flex items-center justify-center ml-2 pb-3 mt-2 w-[26px] h-[26px] border-[#D9D9D9]">
              <h1 className="text-xl">-</h1>
            </div>
            <button className="border-2 rounded-3xl px-4 h-[35px]  ml-auto text-white w-[84px] bg-[#FD9400] hover:bg-[#FD8000]">
              Print
            </button>
            </div>
          </div>

          <div className="p-2 rounded-lg border-2  h-[259px] w-[237px] flex flex-col">
            <img src={Rect12} alt="Rectangle" className="w-full h-30 mb-2" />
            <h3 className="text-lg font-semibold">காழஞ்சி அர்ச்சனை</h3>
            <p className="text-base">LKR 40.00</p>
            <div className="flex mt-[28px]">
            <div className="border-2 p-2 rounded-full flex items-center justify-center mr-2 pb-3 mt-2 w-[26px] h-[26px] border-[#D9D9D9]">
              <h1 className="text-xl">+</h1>
            </div>
            <h1 className="mt-2">1</h1>
            <div className="border-2 p-2 rounded-full flex items-center justify-center ml-2 pb-3 mt-2 w-[26px] h-[26px] border-[#D9D9D9]">
              <h1 className="text-xl">-</h1>
            </div>
            <button className="border-2 rounded-3xl px-4 h-[35px]  ml-auto text-white w-[84px] bg-[#FD9400] hover:bg-[#FD8000]">
              Print
            </button>
            </div>
          </div>

          <div className="p-2 rounded-lg border-2  h-[259px] w-[237px] flex flex-col">
            <img src={Rect13} alt="Rectangle" className="w-full h-30 mb-2" />
            <h3 className="text-lg font-semibold">நெய் விளக்கு</h3>
            <p className="text-base">LKR 40.00</p>
            <div className="flex mt-[28px]">
            <div className="border-2 p-2 rounded-full flex items-center justify-center mr-2 pb-3 mt-2 w-[26px] h-[26px] border-[#D9D9D9]">
              <h1 className="text-xl">+</h1>
            </div>
            <h1 className="mt-2">1</h1>
            <div className="border-2 p-2 rounded-full flex items-center justify-center ml-2 pb-3 mt-2 w-[26px] h-[26px] border-[#D9D9D9]">
              <h1 className="text-xl">-</h1>
            </div>
            <button className="border-2 rounded-3xl px-4 h-[35px]  ml-auto text-white w-[84px] bg-[#FD9400] hover:bg-[#FD8000]">
              Print
            </button>
            </div>
          </div>
          <div className="p-2 rounded-lg border-2  h-[259px] w-[237px] flex flex-col">
            <img src={Rect13} alt="Rectangle" className="w-full h-30 mb-2" />
            <h3 className="text-lg font-semibold">நெய் விளக்கு</h3>
            <p className="text-base">LKR 40.00</p>
            <div className="flex mt-[28px]">
            <div className="border-2 p-2 rounded-full flex items-center justify-center mr-2 pb-3 mt-2 w-[26px] h-[26px] border-[#D9D9D9]">
              <h1 className="text-xl">+</h1>
            </div>
            <h1 className="mt-2">1</h1>
            <div className="border-2 p-2 rounded-full flex items-center justify-center ml-2 pb-3 mt-2 w-[26px] h-[26px] border-[#D9D9D9]">
              <h1 className="text-xl">-</h1>
            </div>
            <button className="border-2 rounded-3xl px-4 h-[35px]  ml-auto text-white w-[84px] bg-[#FD9400] hover:bg-[#FD8000]">
              Print
            </button>
            </div>
          </div>
            <div className="rounded-lg w-[130px] bg-[#FD94000D] flex flex-col justify-center items-center p-2 cursor-pointer hover:text-white hover:bg-[#FD9400]"onClick={handleRedirect}>
              <div className="w-[50px] h-[50px] rounded-full bg-white flex justify-center items-center">
                <img src={arrow} alt="Rectangle" className="w-full" />
              </div>
                <h1 className="mt-2 text-lg font-semibold">See more</h1>
              </div>
            </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          {/* Top Donators */}
          <div className="p-4 w-[60%] h-[302px] bg-[#FD94000D] rounded-xl">
            <div className="ml-[2%]">
              <h1 className="text-2xl font-bold">Top Donators</h1>
              <div className="ml-[3%]">
                {topDonors.length > 0 && (
                  <div className="bg-white mt-5 w-[80%] pl-9 rounded-full h-1/6 flex justify-between pt-2">
                    <img src={premiumpng} alt="Top Donor" className="w-8 -ml-7 h-8" />
                    <p className="text-black relative font-bold -ml-[35%] z-10">{topDonors[0].name}</p>
                    <p className="text-black relative font-semibold mr-6 z-10">LKR {topDonors[0].totalDonated}</p>
                  </div>
                )}
                {topDonors.slice(1).map((donor, index) => (
                  <div key={index} className="flex justify-between w-3/4 font-semibold">
                    <p className="text-black pt-5 relative z-10">{donor.name}</p>
                    <p className="text-black pt-5 relative z-10">LKR {donor.totalDonated}</p>
                  </div>
                ))}
                <div className="flex justify-between w-3/4 font-semibold">
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div
            className="border-2 p-4 w-[35%] h-[302px] rounded-xl relative bg-cover bg-center"
            style={{ backgroundImage: `url(${Rect17})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>

            {/* Title */}
            <h1 className="text-xl font-bold text-white relative z-10">Upcoming Events</h1>

            {/* Fetch and Display Upcoming Events */}
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 6).map((event, index) => (
                <p key={event.id} className="text-white pt-2 font-semibold relative z-10">
                  {index + 1}. {event.name} - {new Date(event.date).toLocaleDateString()}
                </p>
              ))
            ) : (
              <p className="text-white pt-2 font-semibold relative z-10">No upcoming events.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
