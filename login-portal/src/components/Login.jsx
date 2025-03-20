import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import kowil from "../assets/Kovil.jpg";
import Backg from "../assets/Media.png";
import Backgrimg from "../assets/Hinduback.jpg";  // Correct CSS import path
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster correctly

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (!email || !password) {
      setError("Both fields are required!");
      toast.error("Both fields are required!", { duration: 2000 });
      return;
    }

    setError("");

    try {
      const response = await fetch("http://api.pathirakali.org:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        toast.error(data.error || "Login failed. Please check your credentials.", { duration: 2000 });
      } else {
        console.log("Login Successful:", data);
        toast.success('Login Successful', { duration: 2000 });

        // Store token (if backend sends it)
        localStorage.setItem("token", data.token);

        // Navigate to the dashboard
        navigate("/dashboard");
      }
      
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.", { duration: 2000 });
    }
  };

  return (
    <div className="flex w-full h-screen bg-[#FD9400]">
      <div className="w-1/2 bg-cover bg-center mx-auto bg-opacity-90" style={{ backgroundImage: `url(${Backgrimg})` }}>
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
          <div className="p-8 rounded-lg shadow-lg w-96 h-[525px] bg-white">
            <div
              className="hidden lg:flex justify-center items-center h-[150px] w-[40%] -mt-[20px] bg-cover bg-center mx-auto"
              style={{ backgroundImage: `url(${Backg})` }}
            >
            </div>
            <h2 className="text-3xl text-[#FD9400] font-bold text-center mb-6">Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FD9400] text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Right Section - Image */}
      <div
        className="w-1/2 h-full bg-cover bg-center hidden lg:block"
        style={{ backgroundImage: `url(${kowil})` }}
      ></div>
    </div>
    
    
  );
};

export default Login;
