import { useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaUserCog, FaBars, FaPowerOff } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FiHome, FiUsers, FiBarChart2, FiSettings } from "react-icons/fi";
import AuditLogs from "./AuditLogs";

import ManageUsers from "./ManageUsers";
import Reports from "./Reports";
import SalaryComponents from "./SalaryComponents";
import Dashboard from "./Dashboard";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const storedName = localStorage.getItem("name");
  const username = storedName
    ? storedName.charAt(0).toUpperCase() + storedName.slice(1)
    : "Admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const menuItems = [
    { path: "/adminDashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/adminDashboard/manageUsers", label: "Manage Users", icon: <FiUsers /> },
    { path: "/adminDashboard/salaryComponents", label: "Salary Components", icon: <FiSettings /> },
    { path: "/adminDashboard/reports", label: "Reports", icon: <FiBarChart2 /> },
    { path: "/adminDashboard/auditLogs", label: "Audit Logs", icon: <ClipboardDocumentCheckIcon className="w-4 h-4" />  },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Mobile menu button */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-teal-400 text-xl md:text-2xl"
        >
          {sidebarOpen ? <IoClose /> : <FaBars />}
        </button>
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
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          <div className="p-6 text-teal-400 text-lg md:text-2xl font-bold border-b border-slate-700 flex items-center gap-2">
            <FaUserCog className="text-slate-300" />
            Admin Panel
          </div>

          <nav className="mt-4">
            <ul className="space-y-1 text-gray-300">
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={idx}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition relative
                        ${
                          isActive
                            ? "bg-slate-700 text-teal-400 font-semibold before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-teal-400"
                            : "hover:bg-slate-700 hover:text-teal-300"
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="border-t border-slate-700">
          <li
            onClick={logout}
            className="flex items-center gap-3 px-6 py-4 cursor-pointer 
                      text-white hover:bg-slate-700 transition"
          >
            <FaPowerOff />
            Logout
          </li>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-64 p-6 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 bg-slate-800 border border-slate-700 rounded-lg px-6 py-4 shadow w-full">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-slate-300 bg-clip-text text-transparent">
            🌟 Welcome, {username}
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold shadow transition-transform hover:scale-105"
          >
            Log Out
          </button>
        </header>

        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="manageUsers" element={<ManageUsers />} />
          <Route path="auditLogs" element={<AuditLogs />} />
          <Route path="salaryComponents" element={<SalaryComponents />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
