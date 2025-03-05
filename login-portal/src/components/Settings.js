import { Link, Outlet } from "react-router-dom";
import ReceiptTypeSettings from "./ReceiptTypeSettings"; // Import Receipt Type Settings

const Settings = () => {
  return (
    <div className="flex h-[810px] bg-white">
      {/* Sidebar */}
      <div className="inline-block bg-[#FD9400] h-[40%] from-blue-500 to-indigo-600 text-white p-6 mb-10 rounded-lg shadow-xl w-1/7">
        <h2 className="text-2xl font-semibold mb-8">Settings</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="receipt-type" // This will render ReceiptTypeSettings when clicked
              className="text-lg hover:text-blue-200 transition-colors duration-300"
            >
              Receipt Type
            </Link>
          </li>
          <li>
            <Link
              to="receipt-type"
              className="text-lg hover:text-blue-200 transition-colors duration-300"
            >
              Another Setting
            </Link>
          </li>
          <li>
            <Link
              to="receipt-type"
              className="text-lg hover:text-blue-200 transition-colors duration-300"
            >
              More Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Settings Content</h2>
        
        {/* Outlet for rendering the clicked setting */}
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;
