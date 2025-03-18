import { useState, useEffect } from "react";
import ReceiptForm from "../components/ReceiptForm";
import cart from "../assets/cart.svg";

const Receipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [receiptToEdit, setReceiptToEdit] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/receipts")
      .then((response) => response.json())
      .then((data) => {
        setReceipts(data);
      })
      .catch((error) => {
        alert(`Error fetching receipts: ${error.message}`);
      });
  }, []);

  const handleFormSubmit = (receiptData) => {
    const method = receiptToEdit ? "PUT" : "POST";
    const url = receiptToEdit
      ? `http://localhost:3000/api/receipts/${receiptToEdit.id}`
      : "http://localhost:3000/api/receipts";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receiptData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save receipt");
        }
        return response.json();
      })
      .then((data) => {
        if (receiptToEdit) {
          setReceipts((prevReceipts) =>
            prevReceipts.map((receipt) =>
              receipt.id === data.id ? data : receipt
            )
          );
        } else {
          setReceipts((prevReceipts) => [...prevReceipts, data]);
        }
        setIsFormVisible(false);
        setReceiptToEdit(null);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  const handleEditClick = (receipt) => {
    setReceiptToEdit(receipt);
    setIsFormVisible(true); // Show the form with existing data
  };

  const handleDeleteClick = (id) => {
    fetch(`http://localhost:3000/api/receipts/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete receipt");
        }
        setReceipts((prevReceipts) =>
          prevReceipts.filter((receipt) => receipt.id !== id)
        );
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  const handleAddReceiptClick = () => {
    setIsFormVisible(true);
    setReceiptToEdit(null); // Ensure no receipt is being edited
  };

  const handleClosePopup = () => {
    setIsFormVisible(false);
    setReceiptToEdit(null);
  };

  return (
    <div>
      <nav className="text-white bg-white fixed w-full p-6 border-b-2 top-0 left-0 border-gray-300 -mt-7 z-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold mt-6 pl-14 ml-4 lg:ml-[244px] text-black">
          Receipt
          </h1>
          <div className="hidden lg:block flex-grow max-w-sm ml-4 lg:ml-[530px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-3 bg-gray-100 rounded-3xl mt-6 border pl-7 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto my-8 p-4 mt-[90px] bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-6">Generate Receipt</h1>

        <button
          onClick={handleAddReceiptClick}
          className="bg-[#FD9400] text-white py-2 px-4 rounded mb-6"
        >
          Add Receipt
        </button>

        {isFormVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                {receiptToEdit ? "Edit Receipt" : "Add New Receipt"}
              </h2>
              <ReceiptForm
                onSubmit={handleFormSubmit}
                initialData={receiptToEdit}
              />
              <button
                onClick={handleClosePopup}
                className="mt-4 bg-red-500 w-full text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="border-b border-gray-200">
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
                      <button
                        onClick={() => handleEditClick(receipt)}
                        className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
                      >
                        Edit
                      </button>
                      {/*<button
                        onClick={() => handleDeleteClick(receipt.id)}
                        className="bg-red-500 text-white py-1 px-4 rounded"
                      >
                        Delete
                      </button>*/}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {receipts.length === 0 && (
          <p className="mt-4 text-gray-500">No receipts generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default Receipt;
