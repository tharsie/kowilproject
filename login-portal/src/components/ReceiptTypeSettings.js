import React, { useState } from "react";
import { useReceiptContext } from "../context/ReceiptContext"; // ✅ Correct import

const ReceiptTypeSettings = () => {
  const { receiptTypes, setReceiptTypes } = useReceiptContext();
  const [newType, setNewType] = useState("");
  const [priceType, setPriceType] = useState("single"); // Default to single price
  const [prices, setPrices] = useState([""]); // For multiple prices
  const [newSequence, setNewSequence] = useState(""); // Sequence for bill number
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentType, setCurrentType] = useState(null);

  // Validation States
  const [newTypeError, setNewTypeError] = useState("");
  const [newSequenceError, setNewSequenceError] = useState("");
  const [priceError, setPriceError] = useState(""); // Added error state for price validation

  const addReceiptType = () => {
    // Validation
    let valid = true;
    if (!newType.trim()) {
      setNewTypeError("Receipt Type Name is required!");
      valid = false;
    } else {
      setNewTypeError("");
    }

    if (!newSequence.trim()) {
      setNewSequenceError("Sequence is required!");
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

    const newPrice = priceType === "single" ? prices[0] : prices;
    setReceiptTypes([
      ...receiptTypes,
      { name: newType, price: newPrice, sequence: newSequence },
    ]);
    setNewType("");
    setPrices([""]);
    setNewSequence("");
    setShowModal(false);
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

    if (!newSequence.trim()) {
      setNewSequenceError("Sequence is required!");
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
            sequence: newSequence,
          }
        : type
    );
    setReceiptTypes(updatedTypes);
    setNewType("");
    setPrices([""]);
    setNewSequence("");
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
    setNewType(type.name);
    setPriceType(Array.isArray(type.price) ? "multiple" : "single");
    setPrices(Array.isArray(type.price) ? type.price : [type.price]);
    setNewSequence(type.sequence);
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

  const handleSequenceChange = (text, number) => {
    setNewSequence(`${text}-${number}`);
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
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Receipt Type
        </button>
      </div>

      {/* Receipt Types Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Receipt Type</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReceiptTypes.map((type, index) => (
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
          ))}
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
                <option value="single">Single Price</option>
                <option value="multiple">Multiple Prices</option>
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
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Add Price Field
                </button>
              </div>
            )}

            {/* Sequence Input Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Sequence Start</label>
              <div className="flex items-center gap-2">
                {/* Text Part */}
                <input
                  type="text"
                  className="border p-2 rounded w-1/6"
                  value={newSequence.split('-')[0] || ''}
                  onChange={(e) => handleSequenceChange(e.target.value, newSequence.split('-')[1] || '')}
                  placeholder="ARR"
                />

                {/* Hyphen Separator */}
                <span className="text-lg">-</span>

                {/* Numbers Part */}
                <input
                  type="number"
                  className="border p-2 rounded w-1/4"
                  value={newSequence.split('-')[1] || ''}
                  onChange={(e) => handleSequenceChange(newSequence.split('-')[0] || '', e.target.value)}
                  placeholder="0001"
                />
              </div>
              {newSequenceError && <p className="text-red-500 text-sm">{newSequenceError}</p>}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={editMode ? editReceiptType : addReceiptType}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {editMode ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptTypeSettings;
