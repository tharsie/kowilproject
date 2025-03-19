import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import kowil from "../assets/Kovil.jpg"; // Import the image

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const phoneRegex = /^07\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setPhoneError("Phone number must start with 07 and contain 10 digits.");
      return;
    }

    setPhoneError("");
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed!");
      } else {
        console.log("Registration Successful:", data);
        alert("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex w-full h-screen bg-[#FD9400]">
      {/* Left Section - Register Form */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-3xl font-bold text-center mb-6">Register</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {phoneError && <p className="text-red-500 text-center">{phoneError}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FD9400] text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Register
            </button>
          </form>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FD9400] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Image */}
      <div
        className="w-1/2 h-full bg-cover bg-center l"
        style={{ backgroundImage: `url(${kowil})` }}
      ></div>
    </div>
  );
};

export default Register;
