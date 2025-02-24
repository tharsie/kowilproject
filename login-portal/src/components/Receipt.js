import { useState, useEffect } from "react";
import { toWords } from "number-to-words";

const Receipt = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [amountInWords, setAmountInWords] = useState("");
  const [date, setDate] = useState("");
  const [receiptType, setReceiptType] = useState("அர்ச்சனை");
  const receiptTypes = ["அர்ச்சனை", "நன்கொடை", "அன்னதானம்", "நார்ப்பணி"];
  const [dropdownValue, setDropdownValue] = useState("");
  const [secondDropdownValue, setSecondDropdownValue] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
  }, []);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (!isNaN(parseFloat(value)) && parseFloat(value) > 0) {
      setAmountInWords(toWords(parseInt(value, 10)) + " rupees");
    } else {
      setAmountInWords("");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter the recipient's name.");
      return;
    }

    if (receiptType !== "அர்ச்சனை" && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      alert("Please enter a valid amount in numbers.");
      return;
    }

    alert(
      `Receipt generated for ${name}\nAmount: ${amount} (${amountInWords})\nReceipt Type: ${receiptType}\nDate: ${date}\nDropdown Selection: ${dropdownValue}\nSecond Dropdown Selection: ${secondDropdownValue}\nSelected Radio: ${selectedRadio}`
    );
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg mt-12 rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Receipt Section</h2>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Receipt Type */}
        <div>
          <label htmlFor="receiptType" className="block text-lg font-medium">Receipt Type</label>
          <select
            id="receiptType"
            value={receiptType}
            onChange={(e) => setReceiptType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {receiptTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
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
              {["Option 1", "Option 2", "Option 3", "Option 4"].map((option, index) => (
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
              <option value="">ராசி</option>
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
              <option value="">நட்சத்திரம்</option>
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
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">
            Generate Receipt
          </button>
        </div>
      </form>
    </div>
  );
};

export default Receipt;
