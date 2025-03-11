import React, { useState, useEffect } from "react";
import axios from "axios";
import DonationForm from "../components/DonationForm";  // Assuming DonationForm is in the same folder
import cart from "../assets/cart.svg";

const Donations = () => {
  const [donations, setDonations] = useState([]); // State to store all donations
  const [isFormVisible, setIsFormVisible] = useState(false); // To toggle form visibility
  const [searchQuery, setSearchQuery] = useState("");


  // Fetch donations data from the backend
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/donations");
        setDonations(response.data.donations); // Update state with fetched donations
      } catch (error) {
        console.error("Error fetching donations:", error);
        alert("Failed to load donations.");
      }
    };

    fetchDonations();
  }, []); // Empty dependency array means it will only run once when the component mounts

  const handleAddDonation = (donation) => {
    setDonations((prevDonations) => [
      ...prevDonations,
      donation,
    ]);
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible); // Toggle form visibility
  };

  return (
    <div className="container mx-auto p-6">
      <nav className="text-white bg-white fixed w-full p-6 border-b-2 top-0 left-0 border-gray-300 -mt-7 z-16">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <h1 className="text-2xl lg:text-3xl font-bold mt-6 pl-14 ml-4 lg:ml-[244px] text-black">
                  Donations
                </h1>
      
                {/* Search Bar */}
                <div className="hidden lg:block flex-grow max-w-sm ml-4 lg:ml-[530px]">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-3xl text-black mt-6 border pl-7 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
      
                {/* Cart Icon */}
                <div className="relative ml-4 -lg:ml-4 mt-5">
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
      
        <div className="mt-24">
      {/* Button to open the donation form */}
      <button
        onClick={toggleFormVisibility}
        className="bg-[#FD9400] text-white py-2 px-4 rounded mb-6 ml-auto block"
      >
        Add Donation
      </button>


      {/* Donation Form (Visible when isFormVisible is true) */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <DonationForm 
              onAddDonation={handleAddDonation} 
              closeForm={toggleFormVisibility} // Passing closeForm function
            />
            <button
              onClick={toggleFormVisibility}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-3 py-1"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Donations List Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Donator's Name</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Reason</th>
            <th className="border px-4 py-2">Amount</th>
            
          </tr>
        </thead>
        <tbody>
          {donations.length > 0 ? (
            donations.map((donation, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{donation.name}</td>
                <td className="border px-4 py-2">{donation.phoneNumber}</td>
                <td className="border px-4 py-2">{donation.reason}</td>
                <td className="border px-4 py-2">{donation.amount}</td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-2">No donations found.</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Donations;
