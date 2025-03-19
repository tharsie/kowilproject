import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ReceiptProvider } from "./context/ReceiptContext"; // ✅ Correct import
import { ToastContainer } from 'react-toastify';
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Member from "./pages/Member";
import Receipt from "./pages/Receipt";
import Donations from "./pages/Donations";
import Settings from "./components/Settings";
import { Toaster } from 'react-hot-toast';
import ReceiptTypeSettings from "./pages/ReceiptTypeSettings";
import DashboardOverview from "./pages/DashboardOverview";
import EventDetails from "./pages/EventDetails"
const App = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
 
  return (
    <ReceiptProvider>
      {/* <Router> */}
        {/* ToastContainer to display toasts */}
        {/* ToastContainer to display toasts */}
    <Toaster />
    <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
         {/* <Route path="/register" element={<Register />} />*/}
          {/* Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="member" element={<Member />} />
            <Route path="receipt" element={<Receipt />} />
            <Route path="donations" element={<Donations />} />
            <Route index element={<DashboardOverview />} /> {/* Default route to show the overview */}
          <Route path="overview" element={<DashboardOverview />} /> {/* For navigating to /dashboard/overview */}
          
            {/* Settings and nested routes */}
            <Route path="settings" element={<Settings />}>
              {/* Nested route for Receipt Type Settings */}
              <Route path="receipt-type" element={<ReceiptTypeSettings />} />
              <Route path="event-details" element={<EventDetails />} />
            </Route>
          </Route>
        </Routes>
      {/* </Router> */}
    </ReceiptProvider>
  );
};

export default App;
