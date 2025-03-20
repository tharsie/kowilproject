import React, { useState, useEffect, useRef } from "react";
import Rect11 from "../assets/Rectangle11.png";
import Rect15 from "../assets/red-thread.png";
import Rect12 from "../assets/Pongal.png";
import Rect13 from "../assets/Petti-Kappu.jpeg";
import Rect17 from "../assets/Rectangle17.png";
import toast, { Toaster } from 'react-hot-toast';
import Rect18 from "../assets/Rectangle13.png";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import premiumpng from "../assets/premium-quality 1.png";
import axios from "axios";
const DashboardOverview = () => {
  const navigate = useNavigate();
  const [topDonors, setTopDonors] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const receiptRef = useRef(); // Reference for printing

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized Access: No token found");
          navigate("/login", { replace: true });
          return;
        }

        const response = await axios.get("http://localhost:3000/api/top-donors", {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setTopDonors(response.data || []);
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          toast.error("Unauthorized Access");
          navigate("/login", { replace: true });
        } else {
          console.error("Error fetching top donors:", error);
          toast.error("Failed to load top donors.");
        }
      }
    };

    fetchTopDonors();
  }, [navigate]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch("http://api.pathirakali.org:3000/api/events",{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        if (!response.ok) throw new Error("Failed to fetch upcoming events");
        const data = await response.json();
        setUpcomingEvents(data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

   const handleGeneratePDF = () => {
      if (!selectedItem.userName || !selectedItem.date) {
        toast.error("Please enter your name before generating the receipt.");
        return;
      }
  
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      
      // Title
      doc.setFontSize(18);
      doc.text("Donation Receipt", 80, 20);
  
      doc.setFontSize(12);
      doc.text(`Issued to: ${selectedItem.userName}`, 20, 40);
      doc.text(`Date: ${selectedItem.date}`, 20, 50);
      doc.text(`Receipt Type: ${selectedItem.receiptType}`, 20, 60);
      doc.text(`Amount: LKR ${selectedItem.price}.00`, 20, 70);
  
      // Save as PDF
      doc.save("receipt.pdf");
  
      setShowReceipt(false);
    };

  const handlePrintClick = (item) => {
    setSelectedItem({
      ...item,
      userName: "", // Ensure userName input starts empty
      date: new Date().toISOString().split("T")[0], // Auto-fill today's date
      receiptType: item.name, // Auto-set receiptType from item name
    });
    setShowReceipt(true);
  };

  const handleRedirect2 = () => {  
    navigate("/dashboard/donations"); 
  };

  const handleRedirect1 = () => {  
    navigate("/dashboard/receipt"); 
  };

  const handleRedirect3 = () => {  
    navigate("/dashboard/settings/event-details");
  };

  const handleClosePopup = () => {
    setShowReceipt(false);
    setSelectedItem(null);
  };

  const handleFormSubmit = () => {
    if (!selectedItem.userName || !selectedItem.date || !selectedItem.receiptType) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    fetch("http://api.pathirakali.org:3000/api/receipts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: selectedItem.userName,
        amount: selectedItem.price,
        date: selectedItem.date,
        receiptTypeName: selectedItem.receiptType,  // Updated field name to match backend
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to generate receipt");
        return response.json();
      })
      .then((data) => {
        toast.success(`Receipt Generated! ID: ${data.receiptId}`);
        handleGeneratePDF(); // Print receipt after generation
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };
  

  const handlePrintReceipt = () => {
    window.print();
  };

  const items = [
    { id: 1, name: "பழ அர்ச்சனை", price: 40, image: Rect11 },
    { id: 2, name: "பொங்கல்", price: 500, image: Rect12 },
    { id: 3, name: "நெய் விளக்கு", price: 40, image: Rect18 },
    { id: 4, name: "பெட்டிக்காப்பு", price: 1000, image: Rect13 },
    { id: 5, name: "காப்பு", price: 500, image: Rect15 },
  ];

  return (
    <div className="relative">
      <nav className="text-white bg-white fixed w-full p-6 border-b-2 top-3 left-0 border-gray-300 -mt-7 z-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold mt-6 ml-4 lg:ml-[244px] text-black">
            Dashboard
          </h1>
        </div>
      </nav>

      {/* Receipt Modal */}
      {showReceipt && selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-w-4xl relative">
            <button onClick={handleClosePopup} className="absolute top-2 right-2 text-gray-700 text-xl">
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Receipt Form</h2>

            {/* User Name Input */}
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg mb-3"
              placeholder="Enter your name"
              value={selectedItem.userName}
              onChange={(e) => setSelectedItem((prev) => ({ ...prev, userName: e.target.value }))}
            />

            {/* Date Input */}
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg mb-3"
              value={selectedItem.date}
              onChange={(e) => setSelectedItem((prev) => ({ ...prev, date: e.target.value }))}
            />

            {/* Receipt Preview */}
            <div className="p-4 border-2 rounded-lg bg-gray-100 text-center">
              <h3 className="text-lg font-semibold">{selectedItem.receiptType}</h3>
              <p className="text-base">LKR {selectedItem.price}.00</p>
              <p className="text-sm">Issued to: {selectedItem.userName}</p>
              <p className="text-sm">Date: {selectedItem.date}</p>
            </div>

            {/* Generate PDF Button */}
            <button
              onClick={handleFormSubmit}
              className="border-2 rounded-3xl px-4 h-[35px] text-white w-full bg-[#FD9400] hover:bg-[#FD8000] mt-3"
            >
              Generate PDF
            </button>
          </div>
        </div>
      )}


      {/* Product Cards */}
      <div className="bg-white p-0 mt-[80px] -ml-[41px] space-y-3">
        <div className="flex overflow-x-auto justify-between space-x-3.5 p-2">
          {items.map((item) => (
            <div key={item.id} className="p-2 rounded-lg border-2 h-[259px] w-[237px] flex flex-col">
              <img src={item.image} alt={item.name} className="w-full h-30 mb-2 rounded-xl" />
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-base">LKR {item.price}.00</p>
              <button
                className="border-2 rounded-3xl px-4 h-[35px] mt-auto text-white w-[84px] bg-[#FD9400] hover:bg-[#FD8000]"
                onClick={() => handlePrintClick(item)}
              >
                Print
              </button>
            </div>
          ))}
        </div>
        <h1 className="-mt-0 text-lg text-[#FD9400] ml-[0] flex justify-end cursor-pointer z-10 font-semibold" onClick={handleRedirect1}>See more . . .</h1>
      </div>
      {/* Top Donators and Events Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="p-4 w-[60%] h-[302px] bg-[#FD94000D] rounded-xl">
            <div className="ml-[2%]">
              <h1 className="text-2xl font-bold">Top Donators</h1>
              <div className="ml-[3%]">
                {topDonors.length > 0 && (
                  <div className="bg-white mt-5 w-[80%] pl-9 rounded-full h-1/6 flex justify-between pt-2 pb-2 items-center">
                    <div className="details flex column items-center">
                      <img src={premiumpng} alt="Top Donor" className="w-8 -ml-7 h-8" />
                      <p className="text-black relative font-bold  z-10 pl-2.5">{topDonors[0].name}</p>
                    </div>
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
                <h1 className="mt-2 text-lg text-[#FD9400] cursor-pointer font-semibold" onClick={handleRedirect2}>See more . . .</h1>
                </div>
              </div>
            </div>
          </div>

        <div
            className="border-2 p-4 w-[35%] h-[302px] rounded-xl relative bg-cover bg-center"
            style={{ backgroundImage: `url(${Rect17})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>

            {/* Title */}
            <h1 className="text-xl font-bold ml-4 mt-2 text-white relative z-10">Upcoming Events</h1>

            {/* Fetch and Display Upcoming Events */}
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 6).map((event, index) => (
                <p key={event.id} className="text-white ml-4  pt-2 font-semibold relative z-10">
                  {index + 1}. {event.name} - {new Date(event.date).toLocaleDateString()}
                </p>
              ))
            ) : (
              <p className="text-white pt-2 font-semibold relative z-10">No upcoming events.</p>
            )}
            <div className="flex justify-between w-3/4 font-semibold">
                <h1 className="mt-2 text-lg text-[#FD9400] ml-4 cursor-pointer z-10 font-semibold" onClick={handleRedirect3}>See more . . .</h1>
                </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
