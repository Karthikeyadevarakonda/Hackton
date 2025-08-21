import { useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaUserCog, FaBars, FaPowerOff } from "react-icons/fa";
import { FiHome, FiUsers, FiBarChart2, FiSettings } from "react-icons/fi";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { FiPieChart } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

import AuditLogs from "./AuditLogs";
import ManageUsers from "./ManageUsers";
import GenerateSalaries from "./GenerateSalaries";
import SalaryComponents from "./SalaryComponents";
import Dashboard from "./Dashboard";
import Reports from "./Reports";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { colors } = useTheme();

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
    { path: "/adminDashboard/generateSalaries", label: "Generate Salaries", icon: <FiBarChart2 /> },
    { path: "/adminDashboard/reports", label: "Reports", icon: <FiPieChart /> },
    { path: "/adminDashboard/auditLogs", label: "Audit Logs", icon: <ClipboardDocumentCheckIcon className="w-4 h-4" /> },
  ];

  return (
    <div className={`min-h-screen ${colors.primary} ${colors.text} flex transition-colors duration-300`}>
      <div className={`fixed top-0 left-0 right-0 ${colors.secondary} ${colors.border} border-b p-2 flex items-center justify-between md:hidden z-50 transition-colors duration-300`}>
        <button onClick={() => setSidebarOpen(true)} className={`${colors.textMuted} text-2xl`}>
          <FaBars />
        </button>
        <h1 className={`text-lg font-bold ${colors.text}`}>
          {"Welcome "+username}
        </h1>
      </div>


      <aside
        className={`bg-slate-800 w-64 fixed h-full z-50 border-r border-slate-700 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 ${colors.secondary} ${colors.border}`}
      >
        <div>
          <div className={`p-6 ${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'} text-lg md:text-2xl font-bold ${colors.border} border-b flex items-center gap-2`}>
            <FaUserCog className={colors.textSecondary} />
            Admin Panel
          </div>

          <nav className="mt-4">
            <ul className={`space-y-1 ${colors.textSecondary}`}>
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
                            ? `${colors.hover} ${colors.accent.includes('teal') ? 'text-teal-400' : 'text-blue-500'} font-semibold before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${colors.accent.includes('teal') ? 'before:bg-teal-400' : 'before:bg-blue-500'}`
                            : `${colors.hover} hover:${colors.accent.includes('teal') ? 'text-teal-300' : 'text-blue-300'}`
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

        <div className={`${colors.border} border-t`}>
          <li
            onClick={logout}
            className={`flex items-center gap-3 px-6 py-4 cursor-pointer ${colors.text} ${colors.hover} transition-colors`}
          >
            <FaPowerOff />
            Logout
          </li>
        </div>
      </aside>

    
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      <main className="flex-1 ml-0 md:ml-64 p-6 mt-16 md:mt-0 overflow-x-hidden transition-colors duration-300">
      
        <header className={`hidden md:flex items-center justify-between gap-4 mb-6 ${colors.card} ${colors.border} border rounded-lg px-6 py-4 shadow w-full transition-colors duration-300`}>
          <h1 className={`text-2xl font-bold ${colors.text}`}>
            🌟 Welcome, {username}
          </h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={logout}
              className={`px-4 py-2 rounded-lg ${colors.buttonSecondary} ${colors.textSecondary} font-semibold shadow transition-transform hover:scale-105`}
            >
              Log Out
            </button>
          </div>
        </header>

        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="manageUsers" element={<ManageUsers />} />
          <Route path="auditLogs" element={<AuditLogs />} />
          <Route path="salaryComponents" element={<SalaryComponents />} />
          <Route path="reports" element={<Reports />} />
          <Route path="generateSalaries" element={<GenerateSalaries />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
