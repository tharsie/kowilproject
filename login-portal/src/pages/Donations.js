import React, { useState, useEffect } from "react";
import axios from "axios";
import DonationForm from "../components/DonationForm"; 

const Donations = () => {
  const [donations, setDonations] = useState([]); // Store all donations
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [currentDonation, setCurrentDonation] = useState(null); // Track the donation being edited

  // Fetch donations from backend
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/donations");
        setDonations(response.data.donations);
      } catch (error) {
        console.error("Error fetching donations:", error);
        alert("Failed to load donations.");
      }
    };

    fetchDonations();
  }, []);

  // Function to add a new donation
  const handleAddDonation = (donation) => {
    setDonations([...donations, donation]);
  };

  // Function to update a donation
  const handleUpdateDonation = (updatedDonation) => {
    setDonations(donations.map((d) => (d.id === updatedDonation.id ? updatedDonation : d)));
  };

  // Function to handle editing a donation
  const handleEdit = (donation) => {
    setCurrentDonation(donation);
    setEditMode(true);
    setIsFormVisible(true);
  };

  // Toggle form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
    if (!isFormVisible) {
      setEditMode(false);
      setCurrentDonation(null);
    }
  };

  // Filter donations based on search query
  const filteredDonations = donations.filter((donation) =>
    donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.amount.toString().includes(searchQuery)
  );

  return (
    <div className="container mx-auto p-6">
      <nav className="text-white bg-white fixed w-full p-6 border-b-2 top-0 left-0 border-gray-300 -mt-7 z-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold mt-6 pl-14 ml-4 lg:ml-[244px] text-black">
            Donations
          </h1>

          <div className="hidden lg:block flex-grow max-w-sm ml-4 lg:ml-[530px]">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-3xl text-black mt-6 border pl-7 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="block lg:hidden px-4 mt-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Donation Form */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg relative">
              <DonationForm
                onAddDonation={handleAddDonation}
                onUpdateDonation={handleUpdateDonation}
                editMode={editMode}
                donation={currentDonation}
                closeForm={toggleFormVisibility}
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
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <tr key={donation.id}>
                  <td className="border px-4 py-2">{donation.name}</td>
                  <td className="border px-4 py-2">{donation.phoneNumber}</td>
                  <td className="border px-4 py-2">{donation.reason}</td>
                  <td className="border px-4 py-2">{donation.amount}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(donation)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                  </td>
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
