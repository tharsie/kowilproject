import React, { useState, useEffect } from "react";
import { useReceiptContext } from "../context/ReceiptContext"; // ✅ Correct import

const ReceiptTypeSettings = () => {
  const { receiptTypes, setReceiptTypes } = useReceiptContext();
  const [newType, setNewType] = useState("");
  const [priceType, setPriceType] = useState("single"); // Default to single price
  const [prices, setPrices] = useState([""]); // For multiple prices
  const [newSequence, setNewSequence] = useState({ text: "", number: "" }); // Sequence for bill number
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentType, setCurrentType] = useState(null);

  // Validation States
  const [newTypeError, setNewTypeError] = useState("");
  const [newSequenceError, setNewSequenceError] = useState("");
  const [priceError, setPriceError] = useState(""); // Added error state for price validation

  useEffect(() => {
    const fetchReceiptTypes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/receipt-types");
        if (!response.ok) {
          throw new Error("Failed to fetch receipt types");
        }

        const data = await response.json();
        setReceiptTypes(data);
      } catch (err) {
        console.error("Error fetching receipt types:", err);
      }
    };

    fetchReceiptTypes();
  }, [setReceiptTypes]);

  const addReceiptType = async () => {
    // Validation
    let valid = true;
  
    if (!newType.trim()) {
      setNewTypeError("Receipt Type Name is required!");
      valid = false;
    } else {
      setNewTypeError("");
    }
  
    if (!newSequence.text.trim()) {
      setNewSequenceError("Text part of sequence is required!");
      valid = false;
    } else {
      setNewSequenceError("");
    }
  
    if (!newSequence.number.trim()) {
      setNewSequenceError("Number part of sequence is required!");
      valid = false;
    } else {
      setNewSequenceError("");
    }
  
    // Extract numeric part for sequence_num
    const extractedNumber = parseInt(newSequence.number.replace(/\D/g, ""), 10); // Remove non-numeric characters
  
    if (isNaN(extractedNumber)) {
      setNewSequenceError("Sequence must contain a valid number!");
      valid = false;
    } else {
      setNewSequenceError("");
    }
  
    if (priceType === "multiple" && prices.some((price) => price.trim() === "")) {
      setPriceError("All price fields are required for multiple prices.");
      valid = false;
    } else {
      setPriceError("");
    }
  
    if (!valid) return;
  
    // Prepare the data to send to the backend
    const receiptData = {
      name: newType,
      price_type: priceType,
      sequence_txt: `${newSequence.text}-${newSequence.number}`, // Keep the original input (text + numbers)
      sequence_num: extractedNumber, // Use only numbers for sequence_num
      prices: priceType === "multiple" ? prices.map(price => parseFloat(price.trim())) : [], // Only send prices if priceType is "multiple"
    };
  
    try {
      // Send POST request to the backend
      const response = await fetch("http://localhost:3000/api/receipt-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(receiptData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
  
        // Update the state with the new receipt type
        setReceiptTypes((prevReceiptTypes) => [
          ...prevReceiptTypes,
          { name: newType, price_type: priceType, sequence: `${newSequence.text}-${newSequence.number}` },
        ]);
  
        // Reset fields
        setNewType("");
        setPrices([""]);
        setNewSequence({ text: "", number: "" });
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error(errorData.error);
        alert("Error adding receipt type: " + errorData.error);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Network error. Please try again.");
    }
  };
  

  const editReceiptType = () => {
    // Validation
    let valid = true;
    if (!newType.trim()) {
      setNewTypeError("Receipt Type Name is required!");
      valid = false;
    } else {
      setNewTypeError("");
    }

    if (!newSequence.text.trim()) {
      setNewSequenceError("Text part of sequence is required!");
      valid = false;
    } else {
      setNewSequenceError("");
    }

    if (!newSequence.number.trim()) {
      setNewSequenceError("Number part of sequence is required!");
      valid = false;
    } else {
      setNewSequenceError("");
    }

    if (priceType === "multiple" && prices.some((price) => price.trim() === "")) {
      setPriceError("All price fields are required for multiple prices.");
      valid = false;
    } else {
      setPriceError("");
    }

    if (!valid) return;

    const updatedTypes = receiptTypes.map((type) =>
      type.name === currentType.name
        ? {
            ...type,
            name: newType,
            price: priceType === "single" ? prices[0] : prices,
            sequence: `${newSequence.text}-${newSequence.number}`,
          }
        : type
    );
    setReceiptTypes(updatedTypes);
    setNewType("");
    setPrices([""]);
    setNewSequence({ text: "", number: "" });
    setShowModal(false);
    setEditMode(false);
  };

  const deleteReceiptType = (typeToDelete) => {
    const updatedTypes = receiptTypes.filter((type) => type.name !== typeToDelete);
    setReceiptTypes(updatedTypes);
  };

  const filteredReceiptTypes = receiptTypes.filter((type) =>
    type.name && type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (type) => {
    setCurrentType(type);
    const sequenceParts = type.sequence.split("-");
    setNewSequence({
      text: sequenceParts[0],
      number: sequenceParts[1],
    });
    setNewType(type.name);
    setPriceType(Array.isArray(type.price) ? "multiple" : "single");
    setPrices(Array.isArray(type.price) ? type.price : [type.price]);
    setEditMode(true);
    setShowModal(true);
  };

  const handlePriceChange = (index, value) => {
    const updatedPrices = [...prices];
    updatedPrices[index] = value;
    setPrices(updatedPrices);
  };

  const addPriceField = () => {
    setPrices((prevPrices) => [...prevPrices, ""]); // Ensure state update with the previous prices
  };

  const handleSequenceChange = (field, value) => {
    setNewSequence((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Receipt Type Settings</h2>

      {/* Search Bar */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          className="border p-2 rounded w-2/3"
          placeholder="Search Receipt Types"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FD9400] text-white px-4 py-2 rounded"
        >
          Add Receipt Type
        </button>
      </div>

      {/* Receipt Types Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Receipt Type</th>
            <th className="border p-2">Price Type</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReceiptTypes.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center p-2">No receipt types found.</td>
            </tr>
          ) : (
            filteredReceiptTypes.map((type, index) => (
              <tr key={index}>
                <td className="border p-2">{type.name}</td>
                <td className="border p-2">
                  {Array.isArray(type.price) ? type.price.join(", ") : type.price}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(type)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteReceiptType(type.name)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Adding or Editing Receipt Type */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? "Edit Receipt Type" : "Add New Receipt Type"}
            </h3>

            {/* Form */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Receipt Type Name</label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Enter name"
              />
              {newTypeError && <p className="text-red-500 text-sm">{newTypeError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Receipt Price</label>
              <select
                value={priceType}
                onChange={(e) => {
                  setPriceType(e.target.value);
                  setPrices(e.target.value === "single" ? [""] : ["", ""]);
                }}
                className="border p-2 rounded w-full"
              >
                <option value="single">single</option>
                <option value="multiple">multiple</option>
              </select>
            </div>

            {priceType === "multiple" && (
              <div>
                {prices.map((price, index) => (
                  <div key={index} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      className="border p-2 rounded w-full"
                      value={price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      placeholder={`Price ${index + 1}`}
                    />
                  </div>
                ))}
                {priceError && <p className="text-red-500 text-sm">{priceError}</p>}
                <button
                  onClick={addPriceField}
                  className="bg-green-500 text-white px-2 py-1 rounded mt-2"
                >
                  Add Price
                </button>
              </div>
            )}

            {/* Sequence Input Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Sequence Start</label>
              <div className="flex items-center gap-2">
                {/* Text Part (only letters) */}
                <input
                  type="text"
                  className="border p-2 rounded w-1/6"
                  placeholder="ARR"
                  value={newSequence.text}
                  onChange={(e) => handleSequenceChange("text", e.target.value)}
                  pattern="[A-Za-z]*"
                  title="Only letters are allowed"
                />

                {/* Hyphen Separator */}
                <span className="text-lg">-</span>

                {/* Numbers Part (only numbers) */}
                <input
                  type="number"
                  className="border p-2 rounded w-1/4"
                  placeholder="001"
                  value={newSequence.number}
                  onChange={(e) => handleSequenceChange("number", e.target.value)}
                  min="0"
                />
              </div>
              {newSequenceError && <p className="text-red-500 text-sm">{newSequenceError}</p>}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={editMode ? editReceiptType : addReceiptType}
                className="bg-[#FD9400] text-white px-4 py-2 rounded"
              >
                {editMode ? "Save Changes" : "Add Type"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptTypeSettings;
