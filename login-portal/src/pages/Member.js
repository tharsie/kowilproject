import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaEdit, FaPrint } from "react-icons/fa";
import cart from "../assets/cart.svg";
import ReceiptForm from "../components/ReceiptForm";

const MemberPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    phoneNumber: "",
    email: "",
    addressId: "",
    title: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [receiptType, setReceiptType] = useState(""); // Define state

  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/members");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  
  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) =>
    `${member.FirstName} ${member.LastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (member) => {
    setIsEditing(true);
    setEditMemberId(member.MemberId);
    setFormData({
      title: member.Title ?? "",
      firstName: member.FirstName ?? "",
      lastName: member.LastName ?? "",
      dob: member.Dob ? member.Dob.split("T")[0] : "",
      gender: member.Gender ?? "",
      phoneNumber: member.PhoneNumber ?? "",
      email: member.Email ?? "",
      street: member.Street ?? "",
      city: member.City ?? "",
      state: member.State ?? "",
      postalCode: member.PostalCode ?? "",
      country: member.Country ?? ""
    });
    setIsModalOpen(true);
  };

  const [showReceipt, setShowReceipt] = useState(false);  // State to control modal visibility

  const handlePrintClick = () => {
    setReceiptType(filteredMembers); // Ensure you pass the correct data here
    setShowReceipt(true); 
     // Open the ReceiptForm when the button is clicked
  };

  const handleClosePopup = () => {
    setShowReceipt(false);  // Close the modal
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.gender ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode ||
      !formData.country
    ) {
      return alert("All fields are required");
    }

    const url = isEditing
      ? `http://localhost:3000/api/members/${editMemberId}`
      : "http://localhost:3000/api/members";

    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(isEditing ? "Member updated successfully!" : "Member added successfully!");
        fetchMembers();
        setIsModalOpen(false);
        setIsEditing(false);
        setEditMemberId(null);
        setFormData({
          firstName: "",
          lastName: "",
          dob: "",
          gender: "",
          phoneNumber: "",
          email: "",
          addressId: "",
          title: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
      } else {
        alert("An error occurred while processing your request.");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const handleFormSubmit = (receiptData) => {
    fetch("http://localhost:3000/api/receipts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receiptData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to generate receipt");
        }
        return response.json();
      })
      .then((data) => {
        alert(`Receipt generated successfully!`);
        setReceipts((prevReceipts) => [...prevReceipts, receiptData]); // Add new receipt to the table
        setIsFormVisible(false); // Hide the form after submitting
        setShowReceipt(false);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation and Search Bar */}
      <nav className="text-white bg-white fixed w-full p-6 border-b-2 top-0 left-0 border-gray-300 -mt-7 z-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold mt-6 pl-9 lg:ml-[244px] text-black">
            Member
          </h1>
          <div className="hidden lg:block flex-grow max-w-sm ml-4 lg:ml-[530px]">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 bg-gray-100 text-black rounded-3xl mt-6 border pl-7 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </nav>


      {/* Member List */}
      <div className="mt-24">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="px-6 py-2 bg-[#FD9400] text-white rounded-lg hover:bg-blue-700"
          >
            Add Member
          </button>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#FD940012] h-[68px] rounded-lg">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">First Name</th>
                <th className="p-3 text-left">Last Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-3 text-center">
                    No members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.MemberId}>
                    <td className="p-3">{member.Title}</td>
                    <td className="p-3">{member.FirstName}</td>
                    <td className="p-3">{member.LastName}</td>
                    <td className="p-3">{member.PhoneNumber}</td>
                    <td className="p-3">{member.Email}</td>
                    <td className="p-3 flex">
                      <button
                        onClick={() => handleEdit(member)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-700"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={handlePrintClick}
                        className="px-3 py-1 bg-[#FD9400] text-white rounded-2xl hover:bg-blue-600 transition duration-300"
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Receipt Form Popup */}
      {showReceipt && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[25%] max-w-4xl relative">
            <button onClick={handleClosePopup} className="absolute top-2 right-2 text-gray-700 text-xl">
              &times;
            </button>
            <ReceiptForm onSubmit={handleFormSubmit} type={receiptType} />
          </div>
        </div>
      )}

      {/* Member Form Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-4xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-gray-700 text-xl">
              &times;
            </button>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4 text-center">{isEditing ? "Edit Member" : "Add Member"}</h2>

          <div className="flex space-x-4 mb-4">
          <div className="w-1/7">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <select
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Title</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
            </div>
            <div className="w-3/7">
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-3/7">
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* First Name & Last Name in a row */}
          <div className="flex space-x-4 mb-4">
            
          </div>

          {/* Phone Number & Email in a row */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          
          <div className="flex space-x-4 mb-4">
            {/* Date of Birth Field */}
          <div className="w-1/2">
            <label htmlFor="dob" className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Address Fields */}
          <div className="w-1/2">
            <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter Street Address"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/2">
              <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter State"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter Postal Code"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/2">
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter Country"
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-[#FD9400] text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {isEditing ? "Update Member" : "Add Member"}
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
