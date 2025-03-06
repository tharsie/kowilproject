import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaEdit, FaPrint } from "react-icons/fa";
import cart from "../assets/cart.svg"

const MemberPage = () => {
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
      title: member.Title,
      firstName: member.FirstName,
      lastName: member.LastName,
      dob: member.Dob,
      gender: member.Gender,
      phoneNumber: member.PhoneNumber,
      email: member.Email,
      street: member.Street,
      city: member.City,
      state: member.State,
      postalCode: member.PostalCode,
      country: member.Country,
    });
    setIsModalOpen(true);
  };

  
  const handlePrint = (member) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Member Details</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          table, th, td { border: 1px solid black; padding: 10px; text-align: left; }
        </style>
      </head>
      <body>
        <h2>Member Details</h2>
        <table>
          <tr><th>Title</th><td>${member.Title}</td></tr>
          <tr><th>First Name</th><td>${member.FirstName}</td></tr>
          <tr><th>Last Name</th><td>${member.LastName}</td></tr>
          <tr><th>Date of Birth</th><td>${member.DOB}</td></tr>
          <tr><th>Gender</th><td>${member.Gender}</td></tr>
          <tr><th>Phone</th><td>${member.PhoneNumber}</td></tr>
          <tr><th>Email</th><td>${member.Email}</td></tr>
        </table>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
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
      console.error("Error:", error);
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <nav className="text-white fixed bg-white p-6 border-b-2 top-0 justify-center left-0 border-gray-300 -mt-7 z-10  w-full ">
        <div className="flex items-center  w-[84%] ml-[15%]  bg-white justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold mt-6 ml-[66px]  text-black">
            POS-Dashboard
          </h1>

          <div className="hidden lg:block flex-grow max-w-sm ml-4 lg:ml-[530px]">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 bg-gray-100 rounded-3xl mt-6 border border-gray-300"
            />
          </div>

          <div className="relative ml-4 lg:ml-6 mt-5">
                <img src={cart} alt="Cart" className="w-10 h-10" />
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    3 {/* Dynamic count */}
                 </span>
          </div>
        </div>
      </nav>

      <div className="mt-24">
        <div className="flex  justify-end mb-6">
          <button
            onClick={() => {
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="px-6 py-2 bg-[#FD9400] text-white  rounded-lg hover:bg-blue-700"
          >
            Add Member
          </button>
        </div>

        <div className="overflow-x-auto bg-white  ">
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
                  <tr key={member.MemberId} className="mt-5">
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
                          onClick={() => handlePrint(member)}
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

      {isModalOpen && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-2 right-2 text-gray-700 text-xl"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold text-center mb-6">
        {isEditing ? "Edit Member" : "Add Member"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Phone Number & Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Address Fields */}
        <div>
          <label className="block text-gray-700">Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[#FD9400] text-white rounded-lg hover:bg-blue-700"
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
