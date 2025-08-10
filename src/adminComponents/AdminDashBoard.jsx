import { useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaUserCog, FaBars, FaPowerOff } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FiHome, FiUsers, FiDollarSign, FiBarChart2 } from "react-icons/fi";
import Dashboard from "./Dashboard";
import ManageUsers from "./ManageUsers";
import Reports from "./Reports";
import SalaryLogs from "./SalaryLogs";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedName = localStorage.getItem("name");
  const username = storedName
    ? storedName.charAt(0).toUpperCase() + storedName.slice(1)
    : "";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { path: "/adminDashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/adminDashboard/manageUsers", label: "Manage Users", icon: <FiUsers /> },
    { path: "/adminDashboard/salaryLogs", label: "Salary Logs", icon: <FiDollarSign /> },
    { path: "/adminDashboard/reports", label: "Reports", icon: <FiBarChart2 /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800 fixed w-full z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-teal-400 text-2xl p-2 rounded-md hover:bg-slate-700 transition"
        >
          <FaBars />
        </button>
        <h1 className="text-lg font-semibold text-teal-400">
          Welcome, {username || "Admin"}
        </h1>
        <div className="w-10" /> {/* Empty spacer for balance */}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-slate-800 w-64 fixed h-full z-50 border-r border-slate-700 
                    flex flex-col justify-between transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0 md:static`}
      >
        {/* Top Section */}
        <div>
          <div className="p-6 text-teal-400 text-lg md:text-2xl font-bold border-b border-slate-700 flex items-center gap-2">
            <FaUserCog className="text-slate-300" />
            Admin Panel
            <button
              className="ml-auto md:hidden text-xl text-gray-400 hover:text-red-400 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <IoClose />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="mt-4">
            <ul className="space-y-1 text-gray-300">
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition relative rounded-md mx-2
                        ${isActive
                          ? "bg-gradient-to-r from-teal-600 to-teal-400 text-white font-semibold shadow-md"
                          : "hover:bg-slate-700 hover:text-teal-300"}`}
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Section - Logout */}
        <div className="border-t border-slate-700">
          <li
            onClick={logout}
            className="flex items-center gap-3 px-6 py-4 cursor-pointer 
                      text-red-400 hover:text-red-300 hover:bg-slate-700 transition"
          >
            <FaPowerOff />
            Logout
          </li>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-6 mt-14 md:mt-0">
        {/* Desktop header */}
        <header className="hidden md:flex items-center justify-between bg-slate-800 border border-slate-700 rounded-lg px-6 py-4 shadow-md mb-4">
          <h1 className="text-2xl font-semibold text-teal-400">
            Welcome, {username || "Admin"}
          </h1>
          <button
            onClick={logout}
            className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-4 py-2 rounded font-semibold transition"
          >
            Log Out
          </button>
        </header>

        {/* Nested Routes */}
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="manageUsers" element={<ManageUsers />} />
          <Route path="salaryLogs" element={<SalaryLogs />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
