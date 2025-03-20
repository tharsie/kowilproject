import { toWords } from "number-to-words";
import { useEffect, useState } from "react";

const ReceiptForm = ({ onSubmit, initialData }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [amountInWords, setAmountInWords] = useState("");
  const [date, setDate] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [secondDropdownValue, setSecondDropdownValue] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const [receiptTypes, setReceiptTypes] = useState([]);
  const [receiptTypeName, setReceiptType] = useState("");
  const [errors, setErrors] = useState({});

  // Load current date when the component mounts
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setDate(currentDate);
  }, []);

  // Populate the form fields with initialData when it's provided (for editing)
  useEffect(() => {
    if (initialData) {
      setId(initialData.id || "");
      setName(initialData.name || "");
      setAmount(initialData.amount || "");
      setAmountInWords(initialData.amountInWords || "");
      setDate(initialData.date ? initialData.date.split("T")[0] : "");
      setDropdownValue(initialData.dropdownValue || "");
      setSecondDropdownValue(initialData.secondDropdownValue || "");
      setSelectedRadio(initialData.selectedRadio || "");
      setReceiptType(initialData.receiptTypeName || "");
    }
  }, [initialData]);

  // Fetch the receipt types from the API
  useEffect(() => {
    const fetchReceiptTypes = async () => {
      try {
        const response = await fetch("http://api.pathirakali.org:3000/api/receipt-types",{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        if (response.ok) {
          const data = await response.json();
          setReceiptTypes(data);
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

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0) {
      setAmountInWords(toWords(parseInt(amount, 10)) + " rupees");
    }
  }, [amount]);

  const handleSubmitChange = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      amount,
      amountInWords,
      date,
      receiptTypeName,
      dropdownValue,
      secondDropdownValue,
      selectedRadio,
    })
  }

  return (
    <form onSubmit={handleSubmitChange} className="space-y-4">
      <div>
        <label htmlFor="receiptType" className="block text-lg font-medium">Receipt Type</label>
        <select
          id="receiptType"
          value={receiptTypeName}
          onChange={(e) => setReceiptType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="" disabled>Select Receipt Type</option>
          {receiptTypes.length === 0 ? (
            <option value="" disabled>Loading...</option>
          ) : (
            receiptTypes.map((type, index) => (
              <option key={index} value={type.receiptTypeName}>{type.receiptTypeName}</option>
            ))
          )}
        </select>
        {errors.receiptTypeName && <p className="text-red-500 text-sm">{errors.receiptTypeName}</p>}
      </div>

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

      {receiptTypeName !== "அர்ச்சனை" && (
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

      {receiptTypeName !== "அர்ச்சனை" && (
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

      {receiptTypeName === "அர்ச்சனை" && (
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
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}

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

      {receiptTypeName === "அர்ச்சனை" && (
        <>
          <div>
            <label htmlFor="dropdown" className="block text-lg font-medium">Select Option</label>
            <select
              id="dropdown"
              value={dropdownValue}
              onChange={(e) => setDropdownValue(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">ராசி</option>
              {["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"].map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="secondDropdown" className="block text-lg font-medium">Select Another Option</label>
            <select
              id="secondDropdown"
              value={secondDropdownValue}
              onChange={(e) => setSecondDropdownValue(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">நட்சத்திரம்</option>
              {["அசுவினி ", "பரணி ", "கிருத்திகை", "ரோகிணி ", "மிருகசீரிஷம் ", "திருவாதிரை ", "புனர்பூசம் ", "பூசம் ", "ஆயில்யம் ", 
              "மகம் ", "பூரம் ", "உத்திரம் ", "அஸ்தம் ", "சித்திரை ", "சுவாதி ", "விசாகம் ", "அனுஷம் ", "கேட்டை ", "மூலம் ",
               "பூராடம் ", "உத்திராடம் ", "திருவோணம் ", "அவிட்டம் ", "சதயம் ", "பூரட்டாதி ", "உத்திரட்டாதி ", "ரேவதி "].map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <button type="submit" className="bg-[#FD9400] text-white py-2 w-full px-4 rounded">Submit</button>
    </form>
  );
};

export default ReceiptForm;
