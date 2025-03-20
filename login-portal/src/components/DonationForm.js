import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const DonationForm = ({ onAddDonation, onUpdateDonation, closeForm, donation }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    reason: '',
    amount: '',
  });

  // If the form is in edit mode, populate the fields with the existing donation data
  useEffect(() => {
    if (donation) {
      setFormData({
        name: donation.name,
        phoneNumber: donation.phoneNumber,
        reason: donation.reason,
        amount: donation.amount,
      });
    }
  }, [donation]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      // If we are editing, send a PUT request
      if (donation) {
        response = await axios.put(
          `http://api.pathirakali.org:3000/api/donations/${donation.id}`,
          formData
        );
        if (response.status === 200) {
          toast.success('Donation updated successfully!');
          onUpdateDonation(response.data.donation); // Update the donations list in the parent component
        }
      } else {
        // If adding a new donation, send a POST request
        response = await axios.post('http://api.pathirakali.org:3000/api/donations', formData);
        if (response.status === 201) {
          toast.success('Donation added successfully!');
          onAddDonation(response.data.donation); // Update the donations list in the parent component
        }
      }

      closeForm(); // Close the form after successful submission
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast.error('Failed to save donation. Please try again later.');
    }
  };

  return (
    <div className="relative bg-white p-6 rounded-lg shadow-lg">
      {/* Close Button */}
      
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
          {donation ? 'Update Donation' : 'Donate Now'}
        </button>
      </form>
    </div>
  );
};

export default DonationForm;
