import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import ReceiptForm from "../components/ReceiptForm";
import { useNavigate } from "react-router-dom";
import NotoSansTamilRegular from '../assets/NotoSansTamil-Regular.ttf';

const Receipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [receiptToEdit, setReceiptToEdit] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Unauthorized Access: No token found");
          navigate("/login", { replace: true });
          return;
        }
  
        const response = await fetch("http://api.pathirakali.org:3000/api/receipts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            toast.error("Unauthorized Access");
            navigate("/login", { replace: true });
          } else {
            throw new Error(`Failed to fetch receipts: ${response.statusText}`);
          }
          return;
        }
  
        const data = await response.json();
        setReceipts(data || []);
      } catch (error) {
        toast.error(`Error fetching receipts: ${error.message}`);
      }
    };
  
    fetchReceipts();
  }, [navigate]);

  const handleGeneratePDF = (generatedId, data) => {
    const doc = new jsPDF();
  
    // Ensure you're using a font that supports Tamil text
    doc.addFont('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@100..900&display=swap', 'NotoSansTamil', 'normal');
    
    doc.setFont("NotoSansTamil"); // Set the font to Noto Sans Tamil
    
    doc.setFontSize(16);
    doc.text("Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Receipt ID: ${generatedId}`, 20, 30);
    doc.text(`Name: ${data.name}`, 20, 40);
    doc.text(`Amount: ${data.amount}`, 20, 50);
    doc.text(`Amount in Words: ${data.amountInWords}`, 20, 60);
    doc.text(`Date: ${data.date}`, 20, 70);
    doc.text(`Receipt Type: ${data.receiptTypeName}`, 20, 80);
    doc.text(`ராசி: ${data.dropdownValue}`, 20, 90);  // Tamil text
    doc.text(`நட்சத்திரம்: ${data.secondDropdownValue}`, 20, 100);  // Tamil text
    doc.text(`அர்ச்சனை: ${data.selectedRadio}`, 20, 110);  // Tamil text
    
    doc.save(`${data.name}_receipt.pdf`);
  };
  

  const handleFormSubmit = (receiptData) => {
    const method = receiptToEdit ? "PUT" : "POST";
    const url = receiptToEdit
      ? `http://api.pathirakali.org:3000/api/receipts/${receiptToEdit.id}`
      : "http://api.pathirakali.org:3000/api/receipts";
  
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(receiptData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to save receipt: ${errorText}`);
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
          
          toast.success("Receipt updated successfully! 🎉");
        } else {
          setReceipts((prevReceipts) => [...prevReceipts, data]);
          handleGeneratePDF(data.receiptId, receiptData);
          toast.success("Receipt added successfully! 🎉");
        }
  
        setIsFormVisible(false);
        setReceiptToEdit(null);
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
      });
  };
  
  
  

  

  const handleEditClick = (receipt) => {
    setReceiptToEdit(receipt);
    setIsFormVisible(true); // Show the form with existing data
  };

  const handleDeleteClick = (id) => {
    fetch(`http://api.pathirakali.org:3000/api/receipts/${id}`, {
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
        toast.error(`Error: ${error.message}`);
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

      <div className="w-full mx-auto my-8 p-4 mt-[90px] bg-white shadow-md rounded-md">
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
              <ReceiptForm onSubmit={handleFormSubmit} initialData={receiptToEdit} />
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
            <table className="table-auto w-full ">
              <thead>
                <tr className="bg-[#FD940012] h-[68px] rounded-lg">
                <th className="  p-3 text-left">
                    ReceiptID
                  </th>
                  <th className="  p-3 text-left">
                    Receipt Type
                  </th>
                  <th className=" p-3 text-left">
                    Recipient's Name
                  </th>
                  <th className=" p-3 text-left">
                    Date
                  </th>
                  <th className=" p-3 text-left">
                    Receipt Amount (Numbers)
                  </th>
                  <th className=" p-3 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt.id} className="">
                    <td className=" p-3">
                      {receipt.id}
                    </td>
                    <td className=" p-3">
                      {receipt.receiptType}
                    </td>
                    <td className=" p-3">
                      {receipt.name}
                    </td>
                    <td className=" p-3">
                      {receipt.date}
                    </td>
                    <td className=" p-3">
                      {receipt.amount}
                    </td>
                    <td className=" p-3">
                      <button
                        onClick={() => handleEditClick(receipt)}
                        className="border-2 rounded-3xl px-4 h-[35px] mt-auto text-white w-[84px] bg-[#FD9400] hover:bg-[#FD8000]"
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
