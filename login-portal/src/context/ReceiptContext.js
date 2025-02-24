import { createContext, useState, useContext } from "react";

// Create context
const ReceiptContext = createContext();

// Provider component
export const ReceiptProvider = ({ children }) => {
  const [receiptTypes, setReceiptTypes] = useState(["Invoice", "Bill", "Cash Receipt"]);

  return (
    <ReceiptContext.Provider value={{ receiptTypes, setReceiptTypes }}>
      {children}
    </ReceiptContext.Provider>
  );
};

// Custom hook to use the context
export const useReceiptContext = () => useContext(ReceiptContext);
