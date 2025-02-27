import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReceiptProvider } from "./context/ReceiptContext"; // ✅ Correct import

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Member from "./components/Member";
import Receipt from "./components/Receipt";
import Transaction from "./components/Transaction";
import Settings from "./components/Settings";
import ReceiptTypeSettings from "./components/ReceiptTypeSettings";
import DashboardOverview from "./components/DashboardOverview";
const App = () => {
  return (
    <ReceiptProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="member" element={<Member />} />
            <Route path="receipt" element={<Receipt />} />
            <Route path="transaction" element={<Transaction />} />
            <Route index element={<DashboardOverview />} /> {/* Default route to show the overview */}
          <Route path="overview" element={<DashboardOverview />} /> {/* For navigating to /dashboard/overview */}
            
            {/* Settings and nested routes */}
            <Route path="settings" element={<Settings />}>
              {/* Nested route for Receipt Type Settings */}
              <Route path="receipt-type" element={<ReceiptTypeSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ReceiptProvider>
  );
};

export default App;
