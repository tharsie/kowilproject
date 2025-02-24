import React, { useState } from "react";

const Member = () => {
  const [showForm, setShowForm] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [members, setMembers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Form Fields
  const [title, setTitle] = useState("Mr");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newMember = { title, firstName, lastName, email, mobile, dob, gender, street, city, province, country};

    if (editIndex !== null) {
      const updatedMembers = [...members];
      updatedMembers[editIndex] = newMember;
      setMembers(updatedMembers);
      setEditIndex(null);
    } else {
      setMembers([...members, newMember]);
    }

    // Reset form and close it
    setShowForm(false);
    setTitle("Mr");
    setFirstName("");
    setLastName("");
    setEmail("");
    setMobile("");
    setDob("");
    setGender("Male");
    setStreet("");
    setCity("");
    setProvince("");
    setCountry("");
  };

  // Handle edit
  const handleEdit = (index) => {
    const member = members[index];
    setTitle(member.title);
    setFirstName(member.firstName);
    setLastName(member.lastName);
    setEmail(member.email);
    setMobile(member.mobile);
    setDob(member.dob);
    setGender(member.gender);
    setStreet(member.street);
    setCity(member.city);
    setProvince(member.province);
    setCountry(member.country);
    setEditIndex(index);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  // Filter members based on search query
  const filteredMembers = members.filter((member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Member List</h2>

      {/* Search and Add Member Buttons */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search Member..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded-md w-1/3"
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Member
        </button>
      </div>

      {/* Member List Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">DOB</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Street</th>
            <th className="border p-2">City</th>
            <th className="border p-2">Province</th>
            <th className="border p-2">Country</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{member.title}</td>
              <td className="border p-2">{member.firstName} {member.lastName}</td>
              <td className="border p-2">{member.email}</td>
              <td className="border p-2">{member.mobile}</td>
              <td className="border p-2">{member.dob}</td>
              <td className="border p-2">{member.gender}</td>
              <td className="border p-2">{member.street}</td>
              <td className="border p-2">{member.city}</td>
              <td className="border p-2">{member.province}</td>
              <td className="border p-2">{member.country}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2">Edit</button>
                <button onClick={() => handleDelete(index)} className="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Member Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-66">
            <h3 className="text-xl font-semibold mb-4">{editIndex !== null ? "Edit Member" : "Add Member"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="flex space-x-2">
                <select value={title} onChange={(e) => setTitle(e.target.value)} className="p-2 border rounded-md">
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                </select>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="First Name" className="p-2 border rounded-md flex-grow" />
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Last Name" className="p-2 border rounded-md flex-grow" />
              </div> 
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="p-2 border rounded-md w-full" />
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required placeholder="Mobile" maxLength="10" className="p-2 border rounded-md w-full" />
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required className="p-2 border rounded-md w-67" />
              
              <div className="flex space-x-4">
                <label>
                  <input type="radio" value="Male" checked={gender === "Male"} onChange={(e) => setGender(e.target.value)} /> Male
                </label>
                <label>
                  <input type="radio" value="Female" checked={gender === "Female"} onChange={(e) => setGender(e.target.value)} /> Female
                </label>
              </div>
              <h1 className = "font-bold" >Address</h1>
              <div className="flex space-x-2" >
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="Street" className="p-2 border rounded-md flex-full" />
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="City" className="p-2 border rounded-md flex-full" />
              </div>
              <div className="flex space-x-2">
              <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} required placeholder="Province" className="p-2 border rounded-md w-86 flex-full" />
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="Country" className="p-2 border rounded-md w-86 flex-full" />
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  {editIndex !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
