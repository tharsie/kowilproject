import { useState, useEffect } from "react";
import ReceiptForm from "./ReceiptForm";
import cart from "../assets/cart.svg"

const Receipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch receipts from the backend when the component mounts
  useEffect(() => {
    fetch("http://localhost:3000/api/receipts")
      .then((response) => response.json())
      .then((data) => {
        setReceipts(data); // Update state with fetched data
      })
      .catch((error) => {
        alert(`Error fetching receipts: ${error.message}`);
      });
  }, []);

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
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  const handleAddReceiptClick = () => {
    setIsFormVisible(true); // Show the popup
  };

  const handleClosePopup = () => {
    setIsFormVisible(false); // Close the popup
  };

  return (
    <div >
      <nav className="text-white bg-white  fixed w-full p-6 border-b-2 top-0 left-0 border-gray-300 -mt-7 z-16">
                    <div className="flex items-center  justify-between">
                      {/* Logo */}
                      <h1 className="text-2xl lg:text-3xl font-bold mt-6 pl-14 ml-4 lg:ml-[244px] text-black">
                        Dashboard
                      </h1>
            
                      {/* Search Bar */}
                      <div className="hidden lg:block flex-grow max-w-sm ml-4 lg:ml-[530px]">
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full p-3 bg-gray-100 rounded-3xl mt-6 border pl-7 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div className="max-w-6xl mx-auto my-8 p-4 mt-[90px] bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold mb-6">Generate Receipt</h1>

           {/* Add Receipt Button (Opens Popup) */}
             <button
             onClick={handleAddReceiptClick}
             className="bg-[#FD9400] text-white py-2 px-4 rounded mb-6"
           >
               Add Receipt
            </button>

           {/* Popup Modal */}
          {isFormVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
             <h2 className="text-xl font-bold mb-4">Add New Receipt</h2>
            <ReceiptForm onSubmit={handleFormSubmit} />
            <button
              onClick={handleClosePopup}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Receipt Table */}
      {receipts.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Receipt Type
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Recipient's Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Date
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Receipt Amount (Numbers)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Radio Button Value
                </th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="border border-gray-300 px-4 py-2">
                    {receipt.receiptType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {receipt.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {receipt.date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {receipt.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {receipt.selectedRadio || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* If no receipts, show a message */}
      {receipts.length === 0 && (
        <p className="mt-4 text-gray-500">No receipts generated yet.</p>
      )}
    </div>
    </div>
  );
};

export default Receipt;
