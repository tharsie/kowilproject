import React, { useState } from 'react';
import axios from 'axios';

const DonationForm = ({ onAddDonation, closeForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    reason: '',
    amount: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Sending form data to backend API
      const response = await axios.post('http://localhost:3000/api/donations', formData);
      if (response.status === 201) {
        alert('Donation added successfully!');
        onAddDonation(response.data.donation); // Update the donations list in the parent component
        closeForm(); // Close the form after successful submission
      }
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Failed to add donation. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Donator's Name */}
      <div>
        <label className="block font-medium">Donator's Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block font-medium">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      {/* Donated Amount */}
      <div>
        <label className="block font-medium">Donated Amount (LKR)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      {/* Reason for Donation */}
      <div>
        <label className="block font-medium">Reason for Donation</label>
        <textarea
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Enter reason for donation"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#FD9400] text-white py-2 rounded hover:bg-blue-600"
      >
        Donate Now
      </button>
    </form>
  );
};

export default DonationForm;
