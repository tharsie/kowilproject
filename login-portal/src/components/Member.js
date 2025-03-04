import React, { useState, useEffect } from 'react';
import { FaShoppingCart } from "react-icons/fa";

const MemberPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    phoneNumber: '',
    email: '',
    addressId: '',
    title: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch the members data from the backend
  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // Call fetchMembers when the component mounts
  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members based on the search query
  const filteredMembers = members.filter(member =>
    `${member.FirstName} ${member.LastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission to add a new member
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const {
      firstName,
      lastName,
      dob,
      gender,
      phoneNumber,
      email,
      addressId,
      title,
      street,
      city,
      state,
      postalCode,
      country,
    } = formData;
  
    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !gender || // Ensure gender is not empty
      !phoneNumber ||
      !email ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return alert("All fields are required");
    }
  
    const memberPayload = {
      title,
      firstName,
      lastName,
      dob,
      gender,
      phoneNumber,
      email,
      street,
      city,
      state,
      postalCode,
      country,
    };
  
    try {
      // Send data to the backend API
      const response = await fetch('http://localhost:3000/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberPayload),
      });
  
      if (response.ok) {
        const result = await response.json();
        
        // Success
        console.log('Success:', result);
        alert('Member and address added successfully!');
        
        // Reset form data
        setFormData({
          firstName: '',
          lastName: '',
          dob: '',
          gender: '',
          phoneNumber: '',
          email: '',
          addressId: '',
          title: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        });
  
        // Optionally, refetch members to update the list
        fetchMembers();
        setIsModalOpen(false); // Close modal after successful submission
      } else {
        const error = await response.json();
        alert(error.error || 'An error occurred while adding member.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data: ' + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <nav className="text-white fixed w-full p-6 border-b-2 top-0 left-0 border-gray-300 -mt-6">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <h1 className="text-2xl lg:text-3xl font-bold mt-6 ml-4 lg:ml-[289px] text-black">
                  POS-Dashboard
                </h1>
      
                {/* Search Bar */}
                <div className="hidden lg:block flex-grow max-w-sm ml-4 lg:ml-[530px]">
                  <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-3xl mt-6 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
      
                {/* Cart Icon */}
                <div className="relative ml-4 lg:ml-0">
                  <FaShoppingCart className="text-2xl text-gray-700 mt-6 cursor-pointer" />
                  <span className="absolute top-4 right-0 bg-red-500 text-white text-xs rounded-full px-1">
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
      {/* Add Member Button */}
      <div className='mt-24 '>
      <div className="flex justify-end">
          <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-[#FD9400] text-white rounded-lg mb-6 hover:bg-blue-700 transition duration-300"
          >
          Add Member
        </button>
      </div>


      

      {/* Member List */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-[#FD940012]">
            <tr>
            <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">First Name</th>
              <th className="p-3 text-left">Last Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center">No members found</td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.MemberId} className="border-t">
                  <td className="p-3">{member.Title}</td>
                  <td className="p-3">{member.FirstName}</td>
                  <td className="p-3">{member.LastName}</td>
                  <td className="p-3">{member.PhoneNumber}</td>
                  <td className="p-3">{member.Email}</td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
      {/* Modal - Add Member Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-700 text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Add Member</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="flex flex-col">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* First Name */}
                <div className="flex flex-col">
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2">First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2">Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col">
                  <label htmlFor="dob" className="text-sm font-medium text-gray-700 mb-2">Date of Birth:</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col">
                  <label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-2">Gender:</label>
                  <select name="gender" onChange={handleChange} value={formData.gender}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                  <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-2">Phone Number:</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Street */}
                <div className="flex flex-col">
                  <label htmlFor="street" className="text-sm font-medium text-gray-700 mb-2">Street:</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <label htmlFor="city" className="text-sm font-medium text-gray-700 mb-2">City:</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* State */}
                <div className="flex flex-col">
                  <label htmlFor="state" className="text-sm font-medium text-gray-700 mb-2">State:</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Postal Code */}
                <div className="flex flex-col">
                  <label htmlFor="postalCode" className="text-sm font-medium text-gray-700 mb-2">Postal Code:</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                {/* Country */}
                <div className="flex flex-col">
                  <label htmlFor="country" className="text-sm font-medium text-gray-700 mb-2">Country:</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPage;
