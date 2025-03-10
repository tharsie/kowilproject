import { useState, useEffect } from "react";
import { toWords } from "number-to-words";
import { jsPDF } from "jspdf";

const ReceiptForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [amountInWords, setAmountInWords] = useState("");
  const [date, setDate] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [secondDropdownValue, setSecondDropdownValue] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const [receiptTypes, setReceiptTypes] = useState([]);
  const [receiptType, setReceiptType] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
  }, []);

  useEffect(() => {
    const fetchReceiptTypes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/receipt-types");
        if (response.ok) {
          const data = await response.json();
          setReceiptTypes(data); // Assuming data is an array of receipt types
        } else {
          console.error("Failed to fetch receipt types");
        }
      } catch (error) {
        console.error("Error fetching receipt types:", error);
      }
    };

    fetchReceiptTypes();
  }, []);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (value !== "" && !isNaN(parseFloat(value)) && parseFloat(value) > 0) {
      setAmountInWords(toWords(parseInt(value, 10)) + " rupees");
      setErrors((prev) => ({ ...prev, amount: "" })); // Clear error
    } else {
      setAmountInWords("");
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Set up the PDF content
    doc.setFontSize(16);
    doc.text("Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 30);
    doc.text(`Amount: ${amount}`, 20, 40);
    doc.text(`Amount in Words: ${amountInWords}`, 20, 50);
    doc.text(`Date: ${date}`, 20, 60);
    doc.text(`Receipt Type: ${receiptType}`, 20, 70);
    doc.text(`Dropdown Value: ${dropdownValue}`, 20, 80);
    doc.text(`Second Dropdown Value: ${secondDropdownValue}`, 20, 90);
    doc.text(`Selected Radio Option: ${selectedRadio}`, 20, 100);

    // Save the PDF
    doc.save("receipt.pdf");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const requestPayload = {
      name,
      amount,
      amountInWords,
      date,
      receiptType,
      dropdownValue,
      secondDropdownValue,
      selectedRadio,
    };

    const newErrors = {};

    // Validate recipient's name
    if (!name.trim()) {
      newErrors.name = "Please enter the recipient's name.";
    }

    // Amount validation only for receiptType other than 'அர்ச்சனை'
    if (receiptType !== "அர்ச்சனை" && (amount === "" || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      newErrors.amount = "Please enter a valid amount in numbers.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call onSubmit from parent
    onSubmit(requestPayload);

    // Generate PDF on submit
    handleGeneratePDF();
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Receipt Type */}
      <div>
        <label htmlFor="receiptType" className="block text-lg font-medium">
          Receipt Type
        </label>
        <select
          id="receiptType"
          value={receiptType}
          onChange={(e) => setReceiptType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="" disabled>
            Select Receipt Type
          </option>
          {receiptTypes.map((type, index) => (
            <option key={index} value={type.name}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.receiptType && <p className="text-red-500 text-sm">{errors.receiptType}</p>}
      </div>

      {/* Recipient's Name */}
      <div>
        <label htmlFor="name" className="block text-lg font-medium">Recipient's Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Amount Field - Hidden for "அர்ச்சனை" */}
      {receiptType !== "அர்ச்சனை" && (
        <div>
          <label htmlFor="amount" className="block text-lg font-medium">Receipt Amount (Numbers)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="border p-2 rounded w-full"
            min="0.01"
            step="0.01"
            required
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
        </div>
      )}

      {/* Amount in Words (Auto-Generated) */}
      {receiptType !== "அர்ச்சனை" && (
        <div>
          <label htmlFor="amountInWords" className="block text-lg font-medium">Receipt Amount (In Words)</label>
          <input
            id="amountInWords"
            type="text"
            value={amountInWords}
            className="border p-2 rounded w-full bg-gray-100"
            readOnly
          />
        </div>
      )}

      {/* Radio Buttons for "அர்ச்சனை" */}
      {receiptType === "அர்ச்சனை" && (
        <div>
          <label className="block text-lg font-medium">Select amount of அர்ச்சனை</label>
          <div className="flex space-x-4">
            {["50.00", "100.00", "40.00", "20.00"].map((option, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name="arcanationOption"
                  value={option}
                  checked={selectedRadio === option}
                  onChange={(e) => setSelectedRadio(e.target.value)}
                />
                {` Price ${index + 1}`}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-lg font-medium">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* First Dropdown Before Submit - Show only for "அர்ச்சனை" */}
      {receiptType === "அர்ச்சனை" && (
        <div>
          <label htmlFor="dropdown" className="block text-lg font-medium">Select Option</label>
          <select
            id="dropdown"
            value={dropdownValue}
            onChange={(e) => setDropdownValue(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Rashi</option>
            {[ 
              "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
              "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"
            ].map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )}

      {/* Second Dropdown Before Submit - Show only for "அர்ச்சனை" */}
      {receiptType === "அர்ச்சனை" && (
        <div>
          <label htmlFor="secondDropdown" className="block text-lg font-medium">Select Another Option</label>
          <select
            id="secondDropdown"
            value={secondDropdownValue}
            onChange={(e) => setSecondDropdownValue(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Nakshatram</option>
            {[ 
              "அசுவினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசிரீஷம்",
              "திருவாதிரை", "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்",
              "உத்திரம்", "ஹஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்",
              "கேட்டை", "மூலம்", "பூராடம்"
            ].map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center">
        <button type="submit" className="bg-[#FD9400] text-white py-2 px-4 rounded w-full">
          Generate Receipt
        </button>
      </div>
    </form>
  );
};

export default ReceiptForm;
